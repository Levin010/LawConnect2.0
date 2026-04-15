'use client';

import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  Film,
  Globe,
  HeartHandshake,
  Landmark,
  Leaf,
  Scale,
} from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

const categories = [
  'General Practice',
  'Corporate Law',
  'Criminal Defense',
  'Immigration Law',
  'Family Law',
  'Finance Law',
  'Environment Law',
  'Entertainment Law',
  'Land Law',
] as const;

const categoryIcons = {
  'General Practice': Scale,
  'Corporate Law': Building2,
  'Criminal Defense': BriefcaseBusiness,
  'Immigration Law': Globe,
  'Family Law': HeartHandshake,
  'Finance Law': BadgeDollarSign,
  'Environment Law': Leaf,
  'Entertainment Law': Film,
  'Land Law': Landmark,
} as const;

export default function Categories() {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const gap = 24;

  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth < 768 ? 1 : 3);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = categories.length - visibleCount;
  const activeIndex = Math.min(startIndex, Math.max(maxIndex, 0));
  const cardWidth = useMemo(() => {
    if (!viewportWidth) {
      return 0;
    }

    return (viewportWidth - gap * (visibleCount - 1)) / visibleCount;
  }, [gap, viewportWidth, visibleCount]);
  const translateX = activeIndex * (cardWidth + gap);

  useLayoutEffect(() => {
    const viewport = carouselRef.current;

    if (!viewport) {
      return;
    }

    const updateWidth = () => {
      setViewportWidth(viewport.clientWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || maxIndex <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#fff8f1] py-20 px-6">
      <h2
        className="text-3xl font-bold text-center mb-4"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Categories
      </h2>
      <p
        className="max-w-2xl mx-auto text-center text-sm md:text-base text-gray-600 mb-12"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Explore advocates by area of practice and jump straight into a filtered listing.
      </p>

      <div
        className="max-w-6xl mx-auto relative bg-transparent"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-y-0 left-0 z-10 flex items-center">
          <button
            onClick={handlePrev}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-black/10 bg-white/90 text-gray-900 shadow-lg backdrop-blur transition-all hover:-translate-x-0.5 hover:bg-white"
            aria-label="Previous category"
          >
            <ArrowLeft className="mx-auto h-5 w-5" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 z-10 flex items-center">
          <button
            onClick={handleNext}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-black/10 bg-white/90 text-gray-900 shadow-lg backdrop-blur transition-all hover:translate-x-0.5 hover:bg-white"
            aria-label="Next category"
          >
            <ArrowRight className="mx-auto h-5 w-5" />
          </button>
        </div>

        <div className="px-12 md:px-16 bg-transparent">
          <div
            ref={carouselRef}
            className="overflow-hidden py-0 rounded-[30px] bg-[#fff8f1] bg-transparent"
          >
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                gap: `${gap}px`,
                transform: `translateX(-${translateX}px)`,
              }}
            >
              {categories.map((category) => {
                const Icon = categoryIcons[category];

                return (
                  <div
                    key={category}
                    className="min-w-0 shrink-0"
                    style={{
                      width: cardWidth ? `${cardWidth}px` : visibleCount === 1 ? '100%' : 'calc((100% - 48px) / 3)',
                    }}
                  >
                    <div className="group flex h-full min-h-[110px] flex-col rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_18px_36px_rgba(120,53,15,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(120,53,15,0.12)]">
                      <div className="mb-8 flex items-center justify-between">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-md">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span
                          className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          Specialty
                        </span>
                      </div>

                      <h3
                        className="text-2xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {category}
                      </h3>

                      <p
                        className="mb-8 text-sm leading-6 text-gray-600"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        Browse advocates experienced in {category.toLowerCase()}.
                      </p>

                      <Link
                        href={`/advocates?category=${encodeURIComponent(category)}`}
                        className="mt-auto inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
