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

// Expense management types
export interface Expense {
  id: string;
  employeeName: string;
  employeeId: string;
  department?: string;
  category: string;
  amount: number;
  description: string;
  receiptUrl?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedDate: string;
  approvedDate?: string;
  approverName?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  employeeName: string;
  employeeId: string;
  department?: string;
  category: string;
  amount: number;
  description: string;
  receiptFile?: File;
}

export interface UpdateExpenseRequest {
  employeeName?: string;
  employeeId?: string;
  department?: string;
  category?: string;
  amount?: number;
  description?: string;
  receiptFile?: File;
}

export interface ApprovalRequest {
  comments: string;
  approvedAmount?: number;
}

export interface PendingExpense extends Expense {
  urgency: 'low' | 'medium' | 'high';
  daysWaiting: number;
}

// Dashboard statistics types
export interface DashboardStats {
  totalExpenses: number;
  pendingApprovals: number;
  totalBranches: number;
  monthlySpend: number;
  expenseGrowth: number;
  approvalRate: number;
}

export interface RecentExpense {
  id: string;
  employeeName: string;
  amount: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
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
