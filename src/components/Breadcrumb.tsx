import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  customLabels?: { [key: string]: string };
}

export default function Breadcrumb({ customLabels = {} }: BreadcrumbProps) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 py-3 mb-4 bg-gray-50 dark:bg-gray-900/30 px-4 rounded-lg border border-gray-100 dark:border-gray-800/50">
      <Link
        to="/"
        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        হোম (Home)
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        // Human-friendly translation
        let label = customLabels[value] || value;
        if (value === "category") label = "ক্যাটাগরি";
        else if (value === "video") label = "ভিডিও প্লেয়ার";
        else if (value === "search") label = "অনুসন্ধান";
        else if (value === "admin") label = "অ্যাডমিন প্যানেল";

        // Capitalize if fallback
        if (label === value) {
          label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
        }

        return (
          <div key={to} className="flex items-center">
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            {last ? (
              <span className="text-gray-800 dark:text-gray-200 font-semibold max-w-[200px] truncate">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
