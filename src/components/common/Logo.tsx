import React from 'react';

interface LogoProps {
  variant?: 'full' | 'symbol';
  className?: string;
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'symbol') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        <path d="M50 80C33.4315 80 20 66.5685 20 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M20 30C14.4772 30 10 25.5228 10 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40 15H45V25H40V15ZM47 15H52C54.2091 15 56 16.7909 56 19V21C56 23.2091 54.2091 25 52 25H47V15Z" fill="currentColor"/>
      <path d="M58 15H63L66 25H61L58 15ZM67 15H72L69 25H64L67 15Z" fill="currentColor"/>
      <path d="M74 15H79V25H74V15ZM81 15H86C88.2091 15 90 16.7909 90 19V21C90 23.2091 88.2091 25 86 25H81V15Z" fill="currentColor"/>
      <path d="M92 15H97V25H92V15Z" fill="currentColor"/>
    </svg>
  );
}