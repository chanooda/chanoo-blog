/* eslint-disable @typescript-eslint/no-empty-interface */
interface Meta {
  successCallback?: () => void;
}

declare global {
  module '@tanstack/react-query' {
    export interface QueryMeta extends Meta {}
  }
}
