export type TRepoItem = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  watchers: number;
  owner: { avatar_url: string };
};

export type QF = {
  items: Array<TRepoItem>;
  next: number;
  total_count: number
}