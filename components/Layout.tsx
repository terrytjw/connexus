import Image from "next/image";
import Link from "next/link";
import {
  FaHome,
  FaPhotoVideo,
  FaCalendarAlt,
  FaComment,
  FaUser,
  FaBell,
  FaGripVertical,
} from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import Footer from "./Footer";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const MobileNavbar = ({ children }: any) => {
  const router = useRouter();
  const checkboxRef = useRef<HTMLInputElement>(null);

  // to automatically close daisyUI side drawer when route changes
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      if (checkboxRef.current && checkboxRef.current.checked === true) {
        checkboxRef.current.checked = false;
      }
    });
  }, [router.events]);

  return (
    <div className="drawer">
      <input
        id="my-drawer"
        ref={checkboxRef}
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content">
        {/* <!-- Page content here --> */}
        <div className="relative flex items-center bg-white p-4 shadow-sm lg:hidden">
          <label
            htmlFor="my-drawer"
            className="cursor-pointer transition-all hover:text-gray-500"
          >
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
        {children}
      </div>

      {/* Side Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-white p-4 text-gray-500">
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
              href="/users/profile/1"
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
            >
              <FaUser className="ml-2" />
              Profile
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/playground"
              className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-green-600 hover:text-white"
            >
              <FaGripVertical className="ml-2" />
              Playground
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

const DesktopSidebar = () => {
  return (
    <div className="hidden min-h-screen w-64 bg-white lg:fixed lg:block">
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

      <ul className="mt-28 pl-2 pr-8 text-gray-500">
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
            href="/users/profile/1"
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-cyan-600 hover:text-white"
          >
            <FaUser className="ml-2" />
            Profile
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/playground"
            className="flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-green-600 hover:text-white"
          >
            <FaGripVertical className="ml-2" />
            Playground
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
    <MobileNavbar>
      <div className="flex text-black">
        <DesktopSidebar />
        <main className="w-full lg:ml-64">
          <div className="min-h-screen bg-gray-100">{children}</div>
          <Footer />
        </main>
      </div>
    </MobileNavbar>
  );
};

export default Layout;
