"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Tổng quan", emoji: "🏠" },
  { href: "/tu-vung", label: "Từ vựng", emoji: "📖" },
  { href: "/mau-cau", label: "Mẫu câu", emoji: "💬" },
  { href: "/hoi-thoai", label: "Hội thoại", emoji: "🗣️" },
  { href: "/tien-do", label: "Tiến độ", emoji: "📊" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${active
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <span>{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
