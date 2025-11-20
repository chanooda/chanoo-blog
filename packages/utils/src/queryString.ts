export type QueryObject = {
	[key: string]: string;
};

export type QueryParams = Record<
	string,
	string | number | boolean | undefined | null
>;

export interface BuildQueryStringOptions {
	/**
	 * 빈 문자열을 필터링할지 여부 (기본값: true)
	 */
	filterEmpty?: boolean;
	/**
	 * 특정 값들을 기본값으로 간주하고 필터링하는 함수
	 * 예: (key, value) => value === "0" || value === "all"
	 */
	filterDefault?: (key: string, value: string) => boolean;
	/**
	 * 값의 앞뒤 공백을 제거할지 여부 (기본값: true)
	 */
	trim?: boolean;
}

/**
 * Query 파라미터 객체를 query string으로 변환합니다.
 *
 * @param params - query 파라미터 객체
 * @param options - 옵션 설정
 * @returns query string (파라미터가 없으면 빈 문자열 반환)
 *
 * @example
 * ```ts
 * buildQueryString({ search: "test", seriesId: "1", tagId: "0" })
 * // => "search=test&seriesId=1"
 *
 * buildQueryString({ search: "  test  ", empty: "" }, { trim: true, filterEmpty: true })
 * // => "search=test"
 *
 * buildQueryString({ seriesId: "0", tagId: "0" }, {
 *   filterDefault: (key, value) => value === "0"
 * })
 * // => ""
 * ```
 */
export const buildQueryString = (
	params: QueryParams,
	options: BuildQueryStringOptions = {},
): string => {
	const { filterEmpty = true, filterDefault, trim = true } = options;

	const urlParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		// undefined, null 필터링
		if (value === undefined || value === null) {
			continue;
		}

		// 문자열로 변환
		const stringValue = String(value);

		// trim 처리
		const trimmedValue = trim ? stringValue.trim() : stringValue;

		// 빈 문자열 필터링
		if (filterEmpty && !trimmedValue) {
			continue;
		}

		// 기본값 필터링
		if (filterDefault?.(key, trimmedValue)) {
			continue;
		}

		urlParams.set(key, trimmedValue);
	}

	return urlParams.toString();
};

/**
 * Query 파라미터 객체를 query string으로 변환하고, URL 경로와 결합합니다.
 *
 * @param basePath - 기본 경로
 * @param params - query 파라미터 객체
 * @param options - 옵션 설정
 * @returns query string이 있으면 "경로?query", 없으면 "경로"
 *
 * @example
 * ```ts
 * createQueryUrl("/post", { search: "test", seriesId: "1" })
 * // => "/post?search=test&seriesId=1"
 *
 * createQueryUrl("/post", {})
 * // => "/post"
 * ```
 */
export const createQueryUrl = (
	basePath: string,
	params: QueryParams,
	options?: BuildQueryStringOptions,
): string => {
	const queryString = buildQueryString(params, options);
	return queryString ? `${basePath}?${queryString}` : basePath;
};

export const getQuery = (urlQuery: string, queries: string[]) => {
	const parsedQuery = new URLSearchParams(urlQuery);
	const queryObj: QueryObject = {};
	for (const query of queries) {
		const queryValue = parsedQuery.get(query);
		queryObj[query] = queryValue || "";
	}

	return queryObj;
};
