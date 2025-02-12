export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
  message?: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  postedAt: Date;
  deadline: Date;
  bids: number;
  rating: number;
}
export interface AddTask {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  postedAt: any;
  deadline: string;
  requirements: string[];
  ownerId: string;
  bids: number;
  rating: number;
  status: "open" | "closed";
}
