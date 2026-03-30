import Navbar from '@/components/Navbar';
import CaseDetail from '@/components/client/cases/CaseDetail';
import { use } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: Props) {
  const { id } = use (params);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 mx-auto">
        <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto">
          <CaseDetail caseId={String(id)} />
        </div>
      </main>
    </>
  );
}

