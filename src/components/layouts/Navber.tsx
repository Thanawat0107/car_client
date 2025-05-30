import { GrCar } from "react-icons/gr";
import Link from "next/link";
import RightUserArea from "./RightUserArea";
import NavLinks from "./NavLinks";

const login = "/";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 flex justify-between items-center bg-[var(--foreground)] p-5 text-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-semibold text-[var(--color-accent)] cursor-pointer">
        <GrCar size={34} />
        <Link href={login}>รถยนต์มือสอง</Link>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <ul className="menu menu-horizontal px-1">
          <NavLinks />
        </ul>
      </div>

      {/* Mobile dropdown menu */}
      <div className="lg:hidden dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 text-white bg-[var(--color-neutral)]"
        >
          <NavLinks />
        </ul>
      </div>

      {/* Right user area */}
      <RightUserArea />
    </div>
  );
}
