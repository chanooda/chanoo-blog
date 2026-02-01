"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { ModeToggle } from "./ModToggle";

export function Header() {
  return (
    <header className="h-20 min-h-20 px-6 w-full bg-background flex items-center justify-center border-b">
      <div className="flex items-end justify-between max-w-1024 mx-auto w-full">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex ml-4 gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
