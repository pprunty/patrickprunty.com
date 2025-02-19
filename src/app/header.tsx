import Image from 'next/image';
import Link from 'next/link';
import { SocialIcons } from './social-icons'; // adjust the import path if needed
import { TabNavigation } from './tab-navigation';

const Header: React.FC = () => {
  return (
    <div className="mt-4 mb-8">
      <div className="flex items-center space-x-4">
        {/* Profile Image */}
        <div className="min-w-24">
          <Link href="/">
            <Image
              src="/images/me-sketch2.png"
              alt="Patrick Prunty"
              className="bg-gray-100 rounded-full w-24 h-24 object-cover transition-transform duration-300 ease-in-out hover:scale-105 active:scale-105"
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>

        {/* Text Content */}
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-xl text-gray-900 dark:text-white leading-tight my-0">
            Patrick Prunty
          </span>
          <div className="text-[#555555] dark:text-[#B0AFB0] text-sm break-words leading-tight my-0">
            Senior Web Developer based in Dublin, Ireland
          </div>
        </div>
      </div>

      {/* Place TabNavigation below the profile content */}
      <TabNavigation />
    </div>
  );
};

export default Header;
