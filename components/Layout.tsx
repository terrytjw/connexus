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
    <div className="drawer fixed z-40 lg:hidden">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* <!-- Page content here --> */}
        <div className="relative flex items-center bg-white p-4 shadow-sm">
          <label htmlFor="my-drawer" className="">
            <BiMenuAltLeft className="h-10 w-10" />
          </label>
          <Link
            href="/"
            className="absolute top-4 left-[50%] -translate-x-[50%] transition-all duration-300 hover:-translate-y-[3px] hover:opacity-90"
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
        <ul className="menu w-80 bg-base-100 p-4 text-base-content">
          {/* <!-- Sidebar content here --> */}
          <Link
            href="/"
            className="block p-4 transition-all duration-300 hover:-translate-y-[3px] hover:opacity-90"
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
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
            >
              <FaHome className="ml-2" />
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/merchandise"
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
            >
              <FaPhotoVideo className="ml-2" />
              Merchandise
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/events"
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
            >
              <FaCalendarAlt className="ml-2" />
              Events
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/chats"
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
            >
              <FaComment className="ml-2" />
              Chats
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/notifications"
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
            >
              <FaBell className="ml-2" />
              Notifications
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/profile"
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
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
    <div className="hidden h-screen w-80 bg-white lg:block">
      <Link
        href="/"
        className="block p-4 transition-all duration-300 hover:-translate-y-[3px] hover:opacity-90"
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
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
          >
            <FaHome className="ml-2" />
            Home
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/merchandise"
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
          >
            <FaPhotoVideo className="ml-2" />
            Merchandise
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/events"
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
          >
            <FaCalendarAlt className="ml-2" />
            Events
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/chats"
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
          >
            <FaComment className="ml-2" />
            Chats
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/notifications"
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
          >
            <FaBell className="ml-2" />
            Notifications
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/profile"
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
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
      <div className="h-screen w-full bg-gray-100">{children}</div>
    </div>
  );
};

export default Layout;
