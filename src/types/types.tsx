export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  bidderPhotoURL: string;
  amount: number;
  timestamp: string;
}

export interface Task {
  paymentStatus: string;
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  postedAt: Date;
  deadline: string;
  bids: Bid[];
  bidsCount: number;
  rating: number;
  requirements: string[];
  ownerId: string;
  status: "open" | "assigned" | "completed" | "closed";
  winningBid?: Bid;
  assignedTo?: string;
}
export interface AddTask {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  postedAt: any;
  completedAt: any;
  deadline: string;
  requirements: string[];
  ownerId: string;
  bids: number;
  rating: number;
  status: "open" | "closed";
}
