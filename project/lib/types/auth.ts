export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  points: number;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username: string;
  name: string;
}