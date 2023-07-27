import { HttpStatusCode } from 'axios';

export interface GlobalResponse<T> {
  data: T;
  status: HttpStatusCode;
}

export interface GlobalError {
  error: string;
  status: number;
}
