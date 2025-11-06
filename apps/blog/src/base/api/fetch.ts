import type { RequestInit } from "next/dist/server/web/spec-extension/request";
import { cookies } from "next/headers";
import { type GlobalResponse, getCookie } from "utils";
import { API_URL } from "./api.const";

const buildUrl = (url: string, params?: object) => {
	const searchParams = new URLSearchParams(params as Record<string, string>);
	const queryString = searchParams.toString()
		? `?${searchParams.toString()}`
		: "";
	return `${API_URL}/${url}${queryString}`;
};

const getToken = async () => {
	if (typeof window !== "undefined") {
		return getCookie("token");
	}

	const cookie = await cookies();
	return cookie.get("token")?.value;
};

const request = async <Response>(
	_url: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	params?: object,
	options?: Omit<RequestInit, "method">,
) => {
	try {
		const token = await getToken();
		const url = buildUrl(
			_url,
			method === "GET" || method === "DELETE" ? params : undefined,
		);
		const response = await fetch(url, {
			...options,
			method,
			body:
				method === "POST" || method === "PUT"
					? JSON.stringify(params)
					: undefined,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				...options?.headers,
			},
		});
		const data = (await response.json()) as GlobalResponse<Response>;
		return data.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const baseApi = {
	get: async <T>(
		_url: string,
		params?: object,
		options?: Omit<RequestInit, "method">,
	) => {
		return request<T>(_url, "GET", params, options);
	},

	post: async <T>(
		_url: string,
		body: object,
		options?: Omit<RequestInit, "method" | "body">,
	) => {
		return request<T>(_url, "POST", body, options);
	},

	put: async <T>(
		_url: string,
		body: object,
		options?: Omit<RequestInit, "method" | "body">,
	) => {
		return request<T>(_url, "PUT", body, options);
	},

	delete: async <T>(
		_url: string,
		params?: object,
		options?: Omit<RequestInit, "method">,
	) => {
		return request<T>(_url, "DELETE", params, options);
	},
};
