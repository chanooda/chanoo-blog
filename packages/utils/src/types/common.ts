import type { ReactNode } from "react";

export interface GlobalResponse<T> {
	data: T;
	status: "success" | "error";
}

export interface IdReq {
	id: string;
}

export interface ChildrenProps {
	children: ReactNode;
}

export interface IdRes {
	id: string;
}
