from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated
from datetime import timedelta
import shutil
import os
import subprocess
import cv2
from ultralytics import YOLO

from . import models, database, schemas, crud, security
from .security import create_access_token

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS configuration (fully open per user request)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the public directory to serve static files
# Assuming the public directory is at the root of the project
public_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
app.mount("/public", StaticFiles(directory=public_path), name="public")

# Initialize YOLO model (yolo11n-pose is the latest as of late 2024/2025)
# If the user specifically wants "yolo26", we could try that, but yolo11 is the standard.
try:
    model = YOLO('yolo11n-pose.pt')
except Exception:
    model = YOLO('yolov8n-pose.pt')

def ensure_h264_encoding(video_path: str):
    """Re-encode the video using ffmpeg/libx264 so browsers can play it reliably."""
    if shutil.which("ffmpeg") is None:
        print("Skipping H.264 transcode because ffmpeg is not installed")
        return

    temp_output = f"{os.path.splitext(video_path)[0]}_h264.mp4"
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-c:v", "libx264",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        temp_output,
    ]

    try:
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if result.returncode == 0:
            os.replace(temp_output, video_path)
            print(f"Re-encoded {video_path} with libx264 for browser compatibility")
        else:
            print(f"FFmpeg failed to re-encode {video_path}: {result.stderr}")
            if os.path.exists(temp_output):
                os.remove(temp_output)
    except Exception as exc:
        print(f"Unexpected error while running ffmpeg on {video_path}: {exc}")
        if os.path.exists(temp_output):
            os.remove(temp_output)


def process_video_task(input_path: str, output_path: str):
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"Error: Could not open video {input_path}")
        return

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # Many VPS/VM environments lack hardware H.264 encoders. Default to the
    # software-friendly 'mp4v' (MPEG-4 Part 2) codec for reliability, but still
    # attempt 'avc1' (H.264) as a secondary option for better compression.
    preferred_fourccs = ['mp4v', 'avc1']
    out = None
    for codec in preferred_fourccs:
        fourcc = cv2.VideoWriter_fourcc(*codec)
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        if out.isOpened():
            if codec != 'mp4v':
                print(f"Using '{codec}' codec for {output_path}")
            break
        else:
            print(f"Warning: '{codec}' codec failed for {output_path}")
            out = None

    if not out.isOpened():
        print(f"Error: Could not create video writer for {output_path}")
        cap.release()
        return
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Run YOLO pose estimation
        results = model(frame, verbose=False)
        
        # Plot results on frame
        annotated_frame = results[0].plot()
        
        out.write(annotated_frame)
        
    cap.release()
    out.release()
    ensure_h264_encoding(output_path)
    print(f"Finished processing video: {output_path}")

# Security settings
SECRET_KEY = security.SECRET_KEY
ALGORITHM = security.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = security.ACCESS_TOKEN_EXPIRE_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Annotated[Session, Depends(get_db)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = security.verify_token(token, credentials_exception)
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/upload-video")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    # Use absolute paths to avoid confusion
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
    video_dir = os.path.join(base_dir, "videos")
    marked_dir = os.path.join(base_dir, "marked_videos")
    
    os.makedirs(video_dir, exist_ok=True)
    os.makedirs(marked_dir, exist_ok=True)
    
    # Sanitize filename
    safe_filename = file.filename.replace(" ", "_")
    file_path = os.path.join(video_dir, safe_filename)
    output_filename = f"marked_{safe_filename}"
    output_path = os.path.join(marked_dir, output_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process in background
    background_tasks.add_task(process_video_task, file_path, output_path)
    
    # Return the URL for the marked video
    # Note: The processing might take some time, so the frontend should handle the delay
    return {
        "filename": safe_filename,
        "marked_url": f"/public/marked_videos/{output_filename}",
        "status": "processing"
    }

@app.get("/")
async def read_root():
    return {"message": "Welcome to AceSense FastAPI backend!"}

@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Annotated[Session, Depends(get_db)]):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/me/avatar", response_model=schemas.User)
async def upload_avatar(db: Annotated[Session, Depends(get_db)],
                        current_user: Annotated[models.User, Depends(get_current_user)],
                        file: UploadFile = File(...)):
    UPLOAD_DIR = "./avatars"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_extension = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}{file_extension}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    updated_user = crud.update_user_avatar(db, current_user.id, file_path)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@app.post("/users/me/password", response_model=schemas.User)
async def change_password(current_user: Annotated[models.User, Depends(get_current_user)],
                          password_change: schemas.PasswordChange,
                          db: Annotated[Session, Depends(get_db)]):
    if not crud.verify_password(password_change.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    new_hashed_password = crud.get_password_hash(password_change.new_password)
    updated_user = crud.update_user_password(db, current_user.id, new_hashed_password)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user