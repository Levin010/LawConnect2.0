'use client';

import Image from 'next/image';
import { useGetAdvocateByUsernameQuery } from '@/store/api/advocateApi';
import { buildFullName, getNameInitial } from '@/lib/user';

const DetailRow = ({ label, value }: { label: string; value: string | number | null | undefined }) =>
  value ? (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>{label}</span>
      <span className="text-sm text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>{value}</span>
    </div>
  ) : null;

export default function AdvocateView({ username }: { username: string }) {
  const { data: advocate, isLoading, isError } = useGetAdvocateByUsernameQuery(username);

  if (isLoading) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      Loading...
    </div>
  );

  if (isError || !advocate) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center text-red-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      Failed to load advocate.
    </div>
  );

  const fullName = buildFullName(advocate);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 shrink-0" style={{ borderColor: '#8B0000' }}>
          {advocate.profilePicture ? (
            <Image src={advocate.profilePicture} alt={fullName} width={80} height={80} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: '#8B0000' }}>
              {getNameInitial(advocate)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>{fullName}</h2>
          <span className="text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>@{advocate.username}</span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailRow label="Category" value={advocate.category} />
        <DetailRow label="Law Firm" value={advocate.lawFirm} />
        <DetailRow label="County" value={advocate.county} />
        <DetailRow label="Gender" value={advocate.gender} />
        <DetailRow label="Phone" value={advocate.phone} />
        <DetailRow label="Address" value={advocate.address} />
        <DetailRow label="Postal Address" value={advocate.postalAddress} />
        <DetailRow label="Experience" value={advocate.experience ? `${advocate.experience} years` : null} />
      </div>

      {advocate.bio && (
        <>
          <div className="border-t border-gray-100" />
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Bio</span>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{advocate.bio}</p>
          </div>
        </>
      )}
    </div>
  );
}
