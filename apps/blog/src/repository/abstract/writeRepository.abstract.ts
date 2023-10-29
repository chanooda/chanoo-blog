import { WriteReq, WriteRes } from 'utils';

export abstract class AbstractWriteRepository {
  getWrites: (req: WriteReq) => Promise<WriteRes[]>;
}
