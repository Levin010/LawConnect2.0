import AdvocateSearch from '@/components/advocates/AdvocateSearch';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface AdvocateListingPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function AdvocateListingPage({
  searchParams,
}: AdvocateListingPageProps) {
  const params = await searchParams;
  const initialCategory = params?.category?.trim() ?? '';

  return (
    <>
    <Navbar />
      <main className="min-h-screen bg-gray-50 px-6 py-10 mx-auto">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Advocate Listing
        </h1>
        <AdvocateSearch initialCategory={initialCategory} />
      </main>
      <Footer />
    </>
  );
}
