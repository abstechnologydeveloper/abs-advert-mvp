import type { Campaign, User } from "../types";


export const mockUser: User = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  timezone: "UTC",
  currency: "USD",
};

export const mockDrafts: Campaign[] = [
  { id: 1, name: "Summer Workshop Series", date: "2024-10-28", audience: "All Students" },
  { id: 2, name: "Library Resources Update", date: "2024-10-25", audience: "Undergraduate" },
  { id: 3, name: "Career Fair Invitation", date: "2024-10-22", audience: "Graduate" },
];

export const mockHistory: Campaign[] = [
  {
      id: 1,
      name: "Spring Semester Promo",
      date: "2024-10-30T14:30:00Z",
      recipients: 5420,
      status: "Delivered",
      audience: ""
  },
  {
      id: 2,
      name: "New Course Launch",
      date: "2024-10-29T09:15:00Z",
      recipients: 3200,
      status: "Delivered",
      audience: ""
  },
  {
      id: 3,
      name: "Campus Event Reminder",
      date: "2024-10-28T16:45:00Z",
      recipients: 4800,
      status: "Delivered",
      audience: ""
  },
  {
      id: 4,
      name: "Scholarship Opportunities",
      date: "2024-10-26T11:20:00Z",
      recipients: 6100,
      status: "Delivered",
      audience: ""
  },
];
