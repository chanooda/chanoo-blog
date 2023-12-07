import { GlobalResponse, Tag } from 'utils';
import { AbstractTagRepository } from './abstract/tagRepository.abstract';
import { BaseRepository } from './baseRepository';

export class TagRepository extends BaseRepository implements AbstractTagRepository {
  async getTags() {
    const tags = await this.client.get<GlobalResponse<Tag[]>>('tag');
    return tags.data.data;
  }
}
