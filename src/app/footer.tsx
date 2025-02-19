import Link from 'next/link';
import Image from 'next/image';
import Subscribe from '@/modules/blog/components/Subscribe';
import { HR } from '@/app/blog/components/hr';
import { SocialIcons } from './social-icons'; // adjust the path as needed

export default function Footer() {
  return (
    <>
      <footer className="container max-w-2xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Stay Connected */}
          <div>
            <SocialIcons />
            {/* © Section */}
            <div className="mt-4 text-xs font-mono text-gray-600 dark:text-[#999999]">
              © {new Date().getFullYear()} Patrick Prunty.
            </div>
          </div>
          {/* Newsletter */}
          <div>
            <div className="mb-8">
              <Subscribe />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
