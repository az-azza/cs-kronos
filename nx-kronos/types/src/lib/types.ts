import { Dispatch, SetStateAction } from 'react';

export type TRepoItem = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  watchers_count: number;
  stargazers_count: number;
  owner: { avatar_url: string };
  html_url: string;
};


export type TQueryResult = {
  items: Array<TRepoItem>;
  next?: number;
  total_count?: number;
};

export type TLinkPagination = Record<string, number>;

export enum EFetchSource {
  GHSearch = 'GHSearch',
  APIProxy = 'APIProxy',
  APIMock = 'APIMock',
}

export type TFetchSource =
  | EFetchSource.GHSearch
  | EFetchSource.APIProxy
  | EFetchSource.APIMock;

export interface IFetchSourceContext {
  fetchSource: TFetchSource;
  setFetchSource: Dispatch<SetStateAction<TFetchSource>>;
}

export interface ILoadingContext {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
