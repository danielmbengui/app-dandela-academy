import { PAGE_CONTACT } from "@/libs/constants/constants_pages";
import Link from "next/link";

export default function Navitem({ navItem, idx, children }) {
  const { name, path, dropdown, isRelative } = navItem;

  return (
    <li key={idx} className={`nav-item group ${isRelative ? "relative" : ""}`}>
      <Link
        href={path}
        target={path===PAGE_CONTACT ? '_blank' : '_self'}
        className="px-5 lg:px-10px 2xl:px-15px 3xl:px-5 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-primaryColor dark:text-whiteColor"
      >
        {name} {dropdown && <i className="icofont-rounded-down"></i>}
      </Link>

      {/* dropdown */}
      {children}
    </li>
  );
}
