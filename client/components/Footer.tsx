import Link from 'next/link';

const footerColumns = [
  {
    heading: 'For Clients',
    links: [
      { label: 'Hire an Advocate', href: '#' },
      { label: 'Post a Job', href: '#' },
      { label: 'Login to Account', href: '/login' },
    ],
  },
  {
    heading: 'For Advocates',
    links: [
      { label: 'Apply for Job', href: '#' },
      { label: 'Login to Account', href: '/login' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Help and Support', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="text-white py-12 px-6" style={{ backgroundColor: '#8B0000' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {footerColumns.map((col) => (
          <div key={col.heading}>
            <h3
              className="font-bold text-base mb-3 underline"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {col.heading}
            </h3>
            <ul className="space-y-2 list-none p-0 m-0">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-gray-200 transition-colors"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p
        className="text-center text-sm border-t border-white/20 pt-6"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        © 2024 LawConnect. All rights reserved.
      </p>
    </footer>
  );
}
