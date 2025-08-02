export interface User {
  _id: string;
  name: string;
  email: string;
  company?: string;
  skills?: string[];
  rating?: number;
  ratingsCount?: number;
}

export interface Application {
  _id: string;
  freelancer: User;
  job: string;
  coverLetter: string;
  bidAmount: number;
  deliveryTimeline: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
}

export interface Job {
  _id: string;
  client: User;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: "open" | "in progress" | "completed" | "cancelled";
  applications?: Application[];
  hiredFreelancer?: User;
  contract?: string;
  createdAt: string;
}

export interface JobFormData {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
}

export interface ApiError {
  error: string;
}

export interface Contract {
  _id: string;
  job: {
    _id: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
  };
  client: {
    _id: string;
    name: string;
    email: string;
    company?: string;
  };
  freelancer: {
    _id: string;
    name: string;
    email: string;
    skills: string[];
  };
  status: string;
  createdAt: string;
}
