import Image from 'next/image';
import { SocialIcons } from './social-icons'; // adjust the import path if needed
import UniqueViewers from './unique-viewers'; // adjust path if you created it separately

const ProfileCard: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 mb-6 mt-6">
      {/* Profile Image */}
      <div className="min-w-24">
        <Image
          src="/images/me-sketch2.png"
          alt="Patrick Prunty"
          className="bg-gray-100 rounded-full w-24 h-24 object-cover"
          width={100}
          height={100}
          priority
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-xl text-gray-900 dark:text-white leading-tight my-0">
          Patrick Prunty
        </span>
        <div className="text-[#555555] dark:text-[#B0AFB0] font-md break-words leading-tight my-0">
          Senior Web Developer based in Dublin, Ireland
        </div>

        {/* Render UniqueViewers Component */}
        <UniqueViewers />

        {/* Optionally, render Social Icons */}
        {/* <SocialIcons containerClassName="flex flex-wrap mt-2" /> */}
      </div>
    </div>
  );
};

export default ProfileCard;
