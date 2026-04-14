'use client';

import Image from 'next/image';
import { AdvocateProfile } from '@/store/api/advocateApi';
import { useRouter } from 'next/navigation';
import { buildFullName } from '@/lib/user';

interface Props {
  advocate: AdvocateProfile;
}

export default function AdvocateCard({ advocate }: Props) {
  const router = useRouter();
  const fullName = buildFullName(advocate);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Card header */}
      <div
        className="flex flex-col items-center pt-8 pb-6 px-6"
        style={{ backgroundColor: '#8B0000' }}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white/30 mb-4 flex items-center justify-center">
          {advocate.profilePicture ? (
            <Image
              src={advocate.profilePicture}
              alt={fullName}
              width={192}
              height={192}
              className="object-cover w-full h-full"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-14 h-14 text-gray-300"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>
        <h3
          className="text-white font-bold text-lg text-center leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {fullName}
        </h3>
        <span
          className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {advocate.category}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-6 py-5 gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>
          <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="truncate">{advocate.lawFirm}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>
          <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{advocate.county}</span>
        </div>
      </div>

      {/* Card footer actions */}
      <div className="px-6 pb-6 flex gap-3">
        <button
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          Book Appointment
        </button>
        <button
          onClick={() => router.push(`/advocates/${advocate.username}`)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-gray-50"
          style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          Send Request
        </button>
      </div>
    </div>
  );
}
