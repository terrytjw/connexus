import Image from "next/image";
import Link from "next/link";
import {
  FaHome,
  FaPhotoVideo,
  FaCalendarAlt,
  FaComment,
  FaUser,
  FaBell,
} from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";

const MobileNavbar = () => {
  return (
    <div className="lg:hidden fixed drawer z-40">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* <!-- Page content here --> */}
        <div className="flex items-center relative p-4 bg-white shadow-sm">
          <label htmlFor="my-drawer" className="">
            <BiMenuAltLeft className="w-10 h-10" />
          </label>
          <Link
            href="/"
            className="absolute top-4 left-[50%] -translate-x-[50%] hover:opacity-90 hover:-translate-y-[3px] transition-all duration-300"
          >
            <Image
              src="/images/logo-icon.png"
              alt="Connexus logo"
              width={35}
              height={35}
            />
          </Link>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
          {/* <!-- Sidebar content here --> */}
          <Link
            href="/"
            className="block p-4 hover:opacity-90 hover:-translate-y-[3px] transition-all duration-300"
          >
            <Image
              src="/images/logo.png"
              alt="Connexus logo"
              width={160}
              height={50}
            />
          </Link>
          <li className="mt-10 mb-4">
            <Link
              href="/"
              className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
            >
              <FaHome className="ml-2" />
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/merchandise"
              className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
            >
              <FaPhotoVideo className="ml-2" />
              Merchandise
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/events"
              className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
            >
              <FaCalendarAlt className="ml-2" />
              Events
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/chats"
              className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
            >
              <FaComment className="ml-2" />
              Chats
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/notifications"
              className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
            >
              <FaBell className="ml-2" />
              Notifications
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/profile"
              className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
            >
              <FaUser className="ml-2" />
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

const DesktopSidebar = () => {
  return (
    <div className="hidden lg:block h-screen w-80 bg-white">
      <Link
        href="/"
        className="block p-4 hover:opacity-90 hover:-translate-y-[3px] transition-all duration-300"
      >
        <Image
          src="/images/logo.png"
          alt="Connexus logo"
          width={160}
          height={50}
        />
      </Link>

      <ul className="mt-28 pl-2 pr-16 text-gray-500">
        <li className="mb-4">
          <Link
            href="/"
            className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
          >
            <FaHome className="ml-2" />
            Home
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/merchandise"
            className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
          >
            <FaPhotoVideo className="ml-2" />
            Merchandise
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/events"
            className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
          >
            <FaCalendarAlt className="ml-2" />
            Events
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/chats"
            className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
          >
            <FaComment className="ml-2" />
            Chats
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/notifications"
            className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
          >
            <FaBell className="ml-2" />
            Notifications
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/profile"
            className="flex items-center gap-x-2 p-2 hover:bg-cyan-600 rounded-md hover:text-white font-medium transition-all"
          >
            <FaUser className="ml-2" />
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col lg:flex-row">
      <MobileNavbar />
      <DesktopSidebar />
      <div className="w-full h-screen bg-gray-100">{children}</div>
    </div>
  );
};

export default Layout;
