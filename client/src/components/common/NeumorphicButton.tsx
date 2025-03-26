import React from "react";

interface NeumorphicButtonProps {
  icon: string;
  href: string;
  ariaLabel?: string;
  className?: string;
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  icon,
  href,
  ariaLabel,
  className = "",
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className={`neumorphic w-10 h-10 flex items-center justify-center text-[#34bdf2] ${className}`}
    >
      <i className={icon}></i>
    </a>
  );
};

export default NeumorphicButton;
