export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  category: string;
  status: 'pending' | 'published';
  authorId: string;
  authorName: string;
  authorEmail: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
  status: 'active' | 'inactive';
}

export interface MailchimpResponse {
  id: string;
  email_address: string;
  status: string;
  [key: string]: any;
}