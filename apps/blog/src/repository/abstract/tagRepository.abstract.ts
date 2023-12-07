import { Tag } from 'utils';
import { BaseRepository } from '../baseRepository';

export abstract class AbstractTagRepository extends BaseRepository {
  abstract getTags: () => Promise<Tag[]>;
}
