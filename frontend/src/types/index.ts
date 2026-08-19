export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
}

export interface OfferLetter {
  id: string;
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  domain: string;
  stipend: string;
  location: string;
  workingHours: string;
  createdAt: string;
}
