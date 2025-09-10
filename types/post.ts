export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: User;
  postId: number;
}

export interface Post {
  id: number;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  image?: string;
  author: User;
  comments: Comment[];
}
