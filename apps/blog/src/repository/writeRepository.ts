import { GlobalResponse, IdReq, WriteReq, WriteRes } from 'utils';
import { AbstractWriteRepository } from './abstract/writeRepository.abstract';
import { BaseRepository } from './baseRepository';

export class WriteRepository extends BaseRepository implements AbstractWriteRepository {
  async getWrites(writeReq: WriteReq) {
    try {
      const writeRes = await this.client.get<GlobalResponse<WriteRes[]>>('write', {
        params: writeReq
      });

      return writeRes.data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getWrite(writeReq: IdReq) {
    const writeRes = await this.client.get<GlobalResponse<WriteRes>>(`write/${writeReq.id}`);
    return writeRes.data.data;
  }
}
