import type { Tag } from "utils";
import { baseApi } from "./fetch";

export const getTags = async () => {
	try {
		const tags = await baseApi.get<Tag[]>("tag");
		return tags;
	} catch (e) {
		console.error(e);
		throw e;
	}
};
