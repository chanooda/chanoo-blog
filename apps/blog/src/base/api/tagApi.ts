import type { GlobalResponse, Tag } from "utils";
import { baseApi } from "..";

export const getTags = async () => {
	const tags = await baseApi.get<GlobalResponse<Tag[]>>("tag");
	return tags.data;
};
