import { IdReq, Write, WriteDetail, WriteReq } from 'utils';
import { AbstractBaseRepository } from './baseRepository.abstract';

export abstract class AbstractWriteRepository extends AbstractBaseRepository {
  abstract getWrites: (req: WriteReq) => Promise<Write[]>;

  abstract getWrite: (id: IdReq) => Promise<WriteDetail>;
}
