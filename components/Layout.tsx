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
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import Footer from "./Footer";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import dynamic from "next/dynamic";
import Loading from "./Loading";
import { getSession, useSession } from "next-auth/react";
import useSWR from "swr";
import { getUserInfo } from "../lib/api-helpers/user-api";
import { useUserRole } from "../utils/hooks";

const SocialLoginDynamic = dynamic(
  () => import("../components/scw").then((res) => res.default),
  {
    ssr: false,
    loading: () => <Loading className="!h-full" />,
  }
);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MobileNavbar = ({ userData, isFan, switchRole, children }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      <div id="scrollable" className="drawer-content">
        {/* <!-- Page content here --> */}
        <div className="relative flex items-center justify-between bg-white p-4 shadow-sm lg:hidden">
          <label
            htmlFor="my-drawer"
            className="cursor-pointer text-gray-700 transition-all hover:text-gray-500"
          >
            <BiMenuAltLeft className="h-10 w-10" />
          </label>
          <Link
            href="/"
            className="absolute top-4 left-[50%] -translate-x-[50%] transition-all duration-300 hover:-translate-y-[3px] hover:opacity-90"
          >
            <Image
              src="/svgs/mobile-connexus-logo.svg"
              alt="Connexus logo"
              width={35}
              height={35}
            />
          </Link>

          {/* mobile profile dropdown */}
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn m-1 hover:bg-gray-100">
              <Image
                className="rounded-full"
                src={userData.profilePic}
                alt="profile photo"
                width={40}
                height={40}
              />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-60 bg-base-100 p-2 text-sm font-semibold shadow"
            >
              <li>
                <a onClick={() => switchRole()}>
                  {isFan ? "Switch to Creator view" : "Switch to Fan view"}
                </a>
              </li>
              <li>
                <a href={`/user/balance/${session?.user.userId}`}>
                  Account Balance
                </a>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </div>

      {/* Side Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-white p-4 text-gray-700">
          {/* <!-- Sidebar content here --> */}
          <Link
            href="/"
            className="block p-4 transition-all duration-300 hover:-translate-y-[3px] hover:opacity-90"
          >
            <Image
              src="/svgs/desktop-connexus-logo.svg"
              alt="Connexus logo"
              width={160}
              height={50}
            />
          </Link>
          <li className="mt-10 mb-4">
            <Link
              href="/communities"
              className={classNames(
                "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
                router.pathname === "/communities"
                  ? "bg-blue-600 text-white"
                  : ""
              )}
            >
              <FaHome className="ml-2" />
              Communities
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/merchandise"
              className={classNames(
                "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
                router.pathname === "/merchandise"
                  ? "bg-blue-600 text-white"
                  : ""
              )}
            >
              <FaPhotoVideo className="ml-2" />
              Merchandise
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/events"
              className={classNames(
                "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
                router.pathname === "/events" ? "bg-blue-600 text-white" : ""
              )}
            >
              <FaCalendarAlt className="ml-2" />
              Events
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href={`/user/profile/${session?.user?.userId}`}
              className={classNames(
                "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
                router.pathname === "/user/profile/[id]"
                  ? "bg-blue-600 text-white"
                  : ""
              )}
            >
              <FaUser className="ml-2" />
              Profile
            </Link>
          </li>
          <li className="mb-4">
            <button
              className="flex w-full items-center gap-x-2 rounded-md p-2 font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <FaSignOutAlt className="ml-2" />
              Logout
            </button>
          </li>
        </ul>
        <Modal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen}>
          <SocialLoginDynamic />
        </Modal>
      </div>
    </div>
  );
};

const DesktopSidebar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="hidden min-h-screen w-64 bg-white lg:fixed lg:block">
      <Link
        href="/"
        className="block p-4 transition-all duration-300 hover:-translate-y-[3px] hover:opacity-90"
      >
        <Image
          src="/svgs/desktop-connexus-logo.svg"
          alt="Connexus logo"
          width={160}
          height={50}
        />
      </Link>

      <ul className="mt-28 pl-2 pr-8 text-gray-700">
        <li className="mb-4">
          <Link
            href="/communities"
            className={classNames(
              "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
              router.pathname === "/communities" ? "bg-blue-600 text-white" : ""
            )}
          >
            <FaHome className="ml-2" />
            Communities
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/merchandise"
            className={classNames(
              "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
              router.pathname === "/merchandise" ? "bg-blue-600 text-white" : ""
            )}
          >
            <FaPhotoVideo className="ml-2" />
            Merchandise
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href="/events"
            className={classNames(
              "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
              router.pathname === "/events" ? "bg-blue-600 text-white" : ""
            )}
          >
            <FaCalendarAlt className="ml-2" />
            Events
          </Link>
        </li>
        <li className="mb-4">
          <Link
            href={`/user/profile/${session?.user?.userId}`}
            className={classNames(
              "flex items-center gap-x-2 rounded-md p-2 font-medium transition-all hover:bg-blue-600 hover:text-white",
              router.pathname === "/user/profile/[id]"
                ? "bg-blue-600 text-white"
                : ""
            )}
          >
            <FaUser className="ml-2" />
            Profile
          </Link>
        </li>
        <li className="mb-4">
          <button
            className="flex w-full items-center gap-x-2 rounded-md p-2 font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
            onClick={() => setIsAuthModalOpen(true)}
          >
            <FaSignOutAlt className="ml-2" />
            Logout
          </button>
        </li>
      </ul>
      <Modal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen}>
        <SocialLoginDynamic />
      </Modal>
    </div>
  );
};

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  const { data: session, status } = useSession();
  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(session?.user.userId, getUserInfo);
  const [isFan, setIsFan] = useUserRole();

  const switchRole = () => {
    if (
      localStorage.getItem("role") === null ||
      localStorage.getItem("role") === "fan"
    ) {
      localStorage.setItem("role", "creator");
      setIsFan(false);
    } else if (localStorage.getItem("role") === "creator") {
      localStorage.setItem("role", "fan");
      setIsFan(true);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <MobileNavbar userData={userData} isFan={isFan} switchRole={switchRole}>
      <div className="flex text-black">
        <DesktopSidebar />
        <main className="debug-screens w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
          <div className="min-h-screen bg-sky-100">
            {/* desktop profile dropdown */}
            <div className="hidden p-2 lg:flex lg:justify-end">
              <div className="dropdown-end dropdown">
                <label
                  tabIndex={0}
                  className="group btn-ghost btn m-1 hover:bg-gray-100/0"
                >
                  <Image
                    className="rounded-full"
                    src={userData.profilePic}
                    alt="profile photo"
                    width={40}
                    height={40}
                  />
                  <span className="ml-2 lowercase italic text-gray-500 transition-all  group-hover:text-gray-400">
                    @{userData.username}
                  </span>
                  <FaChevronDown className="ml-2 text-gray-500 transition-all  group-hover:text-gray-400" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-60 bg-base-100 p-2 text-sm font-semibold shadow"
                >
                  <li>
                    <a onClick={() => switchRole()}>
                      {isFan ? "Switch to Creator view" : "Switch to Fan view"}
                    </a>
                  </li>
                  <li>
                    <a href={`/user/balance/${session?.user.userId}`}>
                      Account Balance
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </MobileNavbar>
  );
};

export default Layout;
