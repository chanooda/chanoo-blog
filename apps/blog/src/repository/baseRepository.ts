import axios from 'axios';
import { AbstractBaseRepository } from './abstract/baseRepository.abstract';

export class BaseRepository implements AbstractBaseRepository {
  client = axios.create({
    baseURL: `${process.env.BLOG_ADMIN_BASE_URL || ''}/api`
  });
}
