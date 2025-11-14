import type { HttpStatusCode } from "axios";

export interface GlobalResponse<T> {
	data: T;
	status: HttpStatusCode;
}

export interface GlobalError<T = unknown> {
	code: string;
	message: string;
	data?: T;
}

export interface ImageFile {
	file: File;
	url: string;
}
