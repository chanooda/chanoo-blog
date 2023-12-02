import { HttpStatusCode } from 'axios';
import { ReactNode } from 'react';

export interface GlobalResponse<T> {
  data: T;
  status: HttpStatusCode;
}

export interface IdReq {
  id: number;
}

export interface ChildrenProps {
  children: ReactNode;
}
