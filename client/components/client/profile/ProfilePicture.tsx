'use client';

import { useRef } from 'react';
import Image from 'next/image';

interface Props {
  name: string;
  profilePicture: string | null;
  onImageChange: (base64: string) => void;
}

export default function ProfilePicture({ name, profilePicture, onImageChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const initial = name ? name.charAt(0).toUpperCase() : '?';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer group"
        onClick={() => inputRef.current?.click()}
      >
        {profilePicture ? (
          <Image src={profilePicture} alt={name} fill className="object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl font-bold text-white"
            style={{ backgroundColor: '#8B0000' }}
          >
            {initial}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
      >
        Change Photo
      </button>
    </div>
  );
}