import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-neutral)] text-base-content p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <aside className="flex flex-col gap-2">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="..." /> {/* ตัด path ยาวๆ เก็บไว้ได้ */}
          </svg>
          <p>
            ACME Industries Ltd.
            <br />
            Providing reliable tech since 1992
          </p>
        </aside>

        <nav>
          <h6 className="footer-title">Services</h6>
          <ul className="flex flex-col gap-1">
            <li>
              <a className="link link-hover">Branding</a>
            </li>
            <li>
              <a className="link link-hover">Design</a>
            </li>
            <li>
              <a className="link link-hover">Marketing</a>
            </li>
            <li>
              <a className="link link-hover">Advertisement</a>
            </li>
          </ul>
        </nav>

        <nav>
          <h6 className="footer-title">Company</h6>
          <ul className="flex flex-col gap-1">
            <li>
              <a className="link link-hover">About us</a>
            </li>
            <li>
              <a className="link link-hover">Contact</a>
            </li>
            <li>
              <a className="link link-hover">Jobs</a>
            </li>
            <li>
              <a className="link link-hover">Press kit</a>
            </li>
          </ul>
        </nav>

        <nav>
          <h6 className="footer-title">Legal</h6>
          <ul className="flex flex-col gap-1">
            <li>
              <a className="link link-hover">Terms of use</a>
            </li>
            <li>
              <a className="link link-hover">Privacy policy</a>
            </li>
            <li>
              <a className="link link-hover">Cookie policy</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
