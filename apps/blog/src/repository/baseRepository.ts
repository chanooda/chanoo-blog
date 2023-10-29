import { axiosClient } from 'utils';
import { AbstractBaseRepository } from './abstract/baseRepository.abstract';

export class BaseRepository implements AbstractBaseRepository {
  client = axiosClient;
}
