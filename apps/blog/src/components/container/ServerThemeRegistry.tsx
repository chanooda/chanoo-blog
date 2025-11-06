"use client";

import { ThemeRegistry } from "@Components/ThemeRegistry";
import type { ReactNode } from "react";

interface ThemeRegistryProps {
	children: ReactNode;
}
export function ServerThemeRegistry({ children }: ThemeRegistryProps) {
	return <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>;
}
