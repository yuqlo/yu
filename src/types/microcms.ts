export type CategoryType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
};

export type CategoriesType = {
  contents: CategoryType[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type PostType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  category: CategoryType;
  title: string;
  description: string;
  body: string;
};

export type PostsType = {
  contents: PostType[];
  totalCount: number;
  offset: number;
  limit: number;
};
