export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "client" | "freelancer" | "admin";
  bio?: string;
  skills?: string[];
  company?: string;
  rating: number;
  ratingsCount: number;
  isActive: boolean;
  createdAt: string;
}
export interface Client {
  _id: string;
  name: string;
  email: string;
  company?: string;
}
