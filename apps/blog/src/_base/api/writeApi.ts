import type { IdReq, Write, WriteReq } from "utils";
import { baseApi } from "./fetch";

export const getWrites = async (writeReq: WriteReq) => {
	try {
		const data = await baseApi.get<Write[]>("public/write", writeReq);
		return data;
	} catch (e) {
		console.error(e);
		throw e;
	}
};

export const getWrite = async (writeReq: IdReq) => {
	try {
		const data = await baseApi.get<Write>(`public/write/${writeReq.id}`);
		return data;
	} catch (e) {
		console.error(e);
		throw e;
	}
};
