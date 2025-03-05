export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface UserResponse {
  data: User[];
  message?: string;
} 