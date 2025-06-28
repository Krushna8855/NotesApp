export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number | any; // Unix timestamp
  version: number;
};
