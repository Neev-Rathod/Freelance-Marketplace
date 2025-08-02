// Define types for admin data (if not already defined)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "client" | "freelancer" | "admin";
  isActive: boolean;
  createdAt: string;
}

export interface Dispute {
  _id: string;
  job: {
    title: string;
    description: string;
  };
  raisedBy: {
    name: string;
    email: string;
  };
  against: {
    name: string;
    email: string;
  };
  admin?: {
    name: string;
    email: string;
  };
  reason: string;
  status: "open" | "resolved" | "rejected";
  resolution?: string;
  createdAt: string;
}
