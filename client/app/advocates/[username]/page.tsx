import RepresentationRequest from '@/components/advocates/view/RepresentationRequest';
import PostReview from '@/components/advocates/view/PostReview';
import ReviewsList from '@/components/advocates/view/ReviewsList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdvocateView from '@/components/advocates/view/AdvocateView';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function AdvocateDetailPage({ params }: Props) {
  const { username } = await params;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-6 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Left — advocate details (fetched client-side) */}
          <AdvocateView username={username} />
          {/* Right — representation request */}
          <RepresentationRequest advocateUsername={username} />
        </div>

        {/* Bottom — review form + reviews list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PostReview advocateUsername={username} />
          <ReviewsList advocateUsername={username} />
        </div>
      </main>
      <Footer />
    </>
  );
}