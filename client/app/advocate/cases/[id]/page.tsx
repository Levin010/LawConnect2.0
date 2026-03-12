import AdvocateNavbar from '@/components/advocate/AdvocateNavbar';
import CaseDetail from '@/components/advocate/cases/CaseDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <AdvocateNavbar />
      <main className="min-h-screen bg-gray-50 mx-auto">
        <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto">
        <CaseDetail caseId={String(id)} />
        </div>
      </main>
    </>
  );
}