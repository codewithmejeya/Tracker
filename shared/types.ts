// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    username: string;
    id: string;
  };
}

// Branch management types
export interface Branch {
  id: string;
  branchName: string;
  location: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  branchName: string;
  location: string;
  contactPerson: string;
}

export interface UpdateBranchRequest {
  branchName: string;
  location: string;
  contactPerson: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Pagination and filtering types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
