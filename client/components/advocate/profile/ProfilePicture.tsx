'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Props {
  name: string;
  profilePicture: string | null;
  isEditing: boolean;
  onImageChange: (url: string) => void;
}

export default function ProfilePicture({ name, profilePicture, isEditing, onImageChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected after cancel
    e.target.value = '';

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary is not configured.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onImageChange(data.secure_url);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Avatar */}
        <div
          className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-red-900 flex items-center justify-center"
        >
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={name}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              {initials}
            </span>
          )}
        </div>

        {/* Camera overlay — only when editing */}
        {isEditing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 shadow flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-60"
            style={{ borderColor: '#8B0000' }}
            title="Change profile picture"
          >
            {uploading
              ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#8B0000' }} />
              : <Camera className="w-4 h-4" style={{ color: '#8B0000' }} />
            }
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload error */}
      {error && (
        <p className="text-xs text-red-500 text-center max-w-[160px]" style={{ fontFamily: 'Georgia, serif' }}>
          {error}
        </p>
      )}

      {/* Uploading label */}
      {uploading && (
        <p className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
          Uploading...
        </p>
      )}
    </div>
  );
}

// 'use client';

// import { useRef } from 'react';
// import Image from 'next/image';

// interface Props {
//   name: string;
//   profilePicture: string | null;
//   onImageChange: (base64: string) => void;
// }

// export default function ProfilePicture({ name, profilePicture, onImageChange }: Props) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const initial = name ? name.charAt(0).toUpperCase() : '?';

//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => onImageChange(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <div
//         className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer group"
//         onClick={() => inputRef.current?.click()}
//       >
//         {profilePicture ? (
//           <Image src={profilePicture} alt={name} fill className="object-cover" />
//         ) : (
//           <div
//             className="w-full h-full flex items-center justify-center text-5xl font-bold text-white"
//             style={{ backgroundColor: '#8B0000' }}
//           >
//             {initial}
//           </div>
//         )}
//         {/* Hover overlay */}
//         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         </div>
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
//       <button
//         type="button"
//         onClick={() => inputRef.current?.click()}
//         className="text-sm font-medium hover:opacity-80 transition-opacity"
//         style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
//       >
//         Change Photo
//       </button>
//     </div>
//   );
// }