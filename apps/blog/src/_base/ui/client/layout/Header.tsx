"use client";

import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
	return (
		<header className="h-20 min-h-20 px-3 w-full bg-background flex items-center justify-center">
			<div className="flex items-end max-w-1024 mx-auto w-full">
				<Link href="/">
					<Logo />
				</Link>
				<div className="flex ml-4 gap-2"></div>
			</div>
		</header>
	);
}
