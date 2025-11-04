import { GlobalResponse, IdReq, Write, WriteDetail, WriteReq } from "utils";
import { AbstractWriteRepository } from "./abstract/writeRepository.abstract";
import { BaseRepository } from "./baseRepository";

export class WriteRepository
	extends BaseRepository
	implements AbstractWriteRepository
{
	async getWrites(writeReq: WriteReq) {
		try {
			const writeRes = await this.client.get<GlobalResponse<Write[]>>(
				"/write",
				{
					params: writeReq,
				},
			);
			return writeRes.data.data;
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	async getWrite(writeReq: IdReq) {
		const writeRes = await this.client.get<GlobalResponse<WriteDetail>>(
			`write/${writeReq.id}`,
		);
		return writeRes.data.data;
	}
}
