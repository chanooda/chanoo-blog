import { GlobalResponse, WriteReq, WriteRes, axiosClient } from 'utils';
import { AbstractWriteRepository } from './abstract/writeRepository.abstract';
import { BaseRepository } from './baseRepository';

export class WriteRepository extends BaseRepository implements AbstractWriteRepository {
  async getWrites(writeReq: WriteReq) {
    const writeRes = await this.client.get<GlobalResponse<WriteRes[]>>('write', {
      params: writeReq
    });

    return writeRes.data.data;
  }
}
