import type { RequestInit } from "next/dist/server/web/spec-extension/request";
import { cookies } from "next/headers";
import { type GlobalResponse, getCookie } from "utils";
import { API_URL } from "./api.const";

const buildUrl = (url: string, params?: object) => {
	if (!params) {
		const normalizedApiUrl = API_URL.replace(/\/$/, "");
		const normalizedUrl = url.replace(/^\//, "");
		return `${normalizedApiUrl}/${normalizedUrl}`;
	}

	// undefined, null, 빈 문자열 제거 및 boolean을 문자열로 변환
	const filteredParams: Record<string, string> = {};
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== "") {
			filteredParams[key] = String(value);
		}
	}

	const searchParams = new URLSearchParams(filteredParams);
	const queryString = searchParams.toString()
		? `?${searchParams.toString()}`
		: "";

	// URL 정규화: API_URL 끝의 / 제거, url 시작의 / 제거
	const normalizedApiUrl = API_URL.replace(/\/$/, "");
	const normalizedUrl = url.replace(/^\//, "");

	return `${normalizedApiUrl}/${normalizedUrl}${queryString}`;
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

		if (!response.ok) {
			console.error(`${url}`);
			console.error(response);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const jsonData = await response.json();
		console.log("Response data:", jsonData);
		const data = jsonData as GlobalResponse<Response>;

		if (!data || !data.data) {
			console.error("Invalid response structure:", data);
			throw new Error("Invalid response structure");
		}

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
