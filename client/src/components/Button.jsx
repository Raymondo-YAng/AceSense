import React from 'react';

export default function Button({ variant = 'primary', fullWidth = false, className = '', children, ...props }) {
  const baseStyles = "flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 text-base font-bold leading-normal tracking-[0.015em] transition-colors";
  const variants = {
    primary: "bg-primary text-[#111813]",
    secondary: "bg-card text-white border border-transparent",
    icon: "bg-transparent text-white p-0 h-auto",
  };
  const widthStyle = fullWidth ? "w-full" : "min-w-[84px]";

  return (
    <button className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}