import { RequestHandler } from "express";
import { z } from "zod";

// Expense data validation schema
const ExpenseSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
});

const ApprovalSchema = z.object({
  comments: z.string().min(1, "Comments are required"),
  approvedAmount: z.number().positive().optional(),
});

// In-memory database for expenses (in production, use a real database)
interface Expense {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  category: string;
  amount: number;
  description: string;
  receiptUrl?: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedDate: string;
  approvedDate?: string;
  approverName?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

let expenses: Expense[] = [
  {
    id: "EXP001",
    employeeName: "Rajesh Kumar",
    employeeId: "EMP001",
    department: "Sales",
    category: "Travel & Transportation",
    amount: 2500,
    description: "Flight tickets for client meeting in Mumbai",
    status: "submitted",
    submittedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "EXP002",
    employeeName: "Priya Sharma",
    employeeId: "EMP002",
    department: "Marketing",
    category: "Office Supplies",
    amount: 850,
    description: "Stationary and office materials",
    status: "approved",
    submittedDate: new Date(Date.now() - 86400000).toISOString(),
    approvedDate: new Date().toISOString(),
    approverName: "Manager A",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "EXP003",
    employeeName: "Arun Patel",
    employeeId: "EMP003",
    department: "Marketing",
    category: "Meals & Entertainment",
    amount: 1200,
    description: "Client dinner at Taj Hotel",
    status: "submitted",
    submittedDate: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "EXP004",
    employeeName: "Meera Reddy",
    employeeId: "EMP004",
    department: "HR",
    category: "Communications",
    amount: 450,
    description: "Mobile recharge and internet bills",
    status: "rejected",
    submittedDate: new Date(Date.now() - 259200000).toISOString(),
    rejectionReason: "Insufficient documentation",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "EXP005",
    employeeName: "Suresh Das",
    employeeId: "EMP005",
    department: "IT",
    category: "Training & Development",
    amount: 3200,
    description: "Technical certification course",
    status: "approved",
    submittedDate: new Date(Date.now() - 345600000).toISOString(),
    approvedDate: new Date(Date.now() - 172800000).toISOString(),
    approverName: "Manager B",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Generate unique expense ID
function generateExpenseId(): string {
  const lastExpense = expenses.sort((a, b) => a.id.localeCompare(b.id)).pop();
  if (!lastExpense) return "EXP001";

  const lastNumber = parseInt(lastExpense.id.substring(3));
  return `EXP${String(lastNumber + 1).padStart(3, "0")}`;
}

// Calculate days waiting for pending expenses
function calculateDaysWaiting(submittedDate: string): number {
  const submitted = new Date(submittedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - submitted.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Determine urgency based on amount and days waiting
function calculateUrgency(
  amount: number,
  daysWaiting: number,
): "low" | "medium" | "high" {
  if (amount > 10000 || daysWaiting > 3) return "high";
  if (amount > 5000 || daysWaiting > 1) return "medium";
  return "low";
}

// GET /api/expenses - Get all expenses
export const getAllExpenses: RequestHandler = (req, res) => {
  res.json(
    expenses.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );
};

// GET /api/expenses/pending-approval - Get pending expenses for approval
export const getPendingExpenses: RequestHandler = (req, res) => {
  const pendingExpenses = expenses
    .filter((expense) => expense.status === "submitted")
    .map((expense) => {
      const daysWaiting = calculateDaysWaiting(expense.submittedDate);
      return {
        ...expense,
        daysWaiting,
        urgency: calculateUrgency(expense.amount, daysWaiting),
      };
    })
    .sort((a, b) => {
      // Sort by urgency first, then by days waiting
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }
      return b.daysWaiting - a.daysWaiting;
    });

  res.json(pendingExpenses);
};

// GET /api/expenses/:id - Get expense by ID
export const getExpenseById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  res.json(expense);
};

// POST /api/expenses - Create new expense
export const createExpense: RequestHandler = (req, res) => {
  try {
    const validatedData = ExpenseSchema.parse(req.body);

    const newExpense: Expense = {
      id: generateExpenseId(),
      ...validatedData,
      department: validatedData.department || "General",
      status: "submitted",
      submittedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    res.status(201).json(newExpense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/expenses/:id - Update expense
export const updateExpense: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = ExpenseSchema.partial().parse(req.body);

    const expenseIndex = expenses.findIndex((e) => e.id === id);
    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Only allow updates if expense is not approved
    if (expenses[expenseIndex].status === "approved") {
      return res
        .status(400)
        .json({ message: "Cannot update approved expense" });
    }

    const updatedExpense: Expense = {
      ...expenses[expenseIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    expenses[expenseIndex] = updatedExpense;
    res.json(updatedExpense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/expenses/:id - Delete expense
export const deleteExpense: RequestHandler = (req, res) => {
  const { id } = req.params;
  const expenseIndex = expenses.findIndex((e) => e.id === id);

  if (expenseIndex === -1) {
    return res.status(404).json({ message: "Expense not found" });
  }

  // Only allow deletion if expense is not approved
  if (expenses[expenseIndex].status === "approved") {
    return res.status(400).json({ message: "Cannot delete approved expense" });
  }

  const deletedExpense = expenses.splice(expenseIndex, 1)[0];
  res.json({
    message: "Expense deleted successfully",
    expense: deletedExpense,
  });
};

// POST /api/expenses/:id/approve - Approve expense
export const approveExpense: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { comments, approvedAmount } = ApprovalSchema.parse(req.body);

    const expenseIndex = expenses.findIndex((e) => e.id === id);
    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const expense = expenses[expenseIndex];
    if (expense.status !== "submitted") {
      return res
        .status(400)
        .json({ message: "Expense is not pending approval" });
    }

    const updatedExpense: Expense = {
      ...expense,
      status: "approved",
      approvedDate: new Date().toISOString(),
      approverName: "barath", // In real app, get from JWT token
      amount: approvedAmount || expense.amount,
      updatedAt: new Date().toISOString(),
    };

    expenses[expenseIndex] = updatedExpense;
    res.json({
      message: "Expense approved successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/expenses/:id/reject - Reject expense
export const rejectExpense: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = ApprovalSchema.parse(req.body);

    const expenseIndex = expenses.findIndex((e) => e.id === id);
    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const expense = expenses[expenseIndex];
    if (expense.status !== "submitted") {
      return res
        .status(400)
        .json({ message: "Expense is not pending approval" });
    }

    const updatedExpense: Expense = {
      ...expense,
      status: "rejected",
      rejectionReason: comments,
      updatedAt: new Date().toISOString(),
    };

    expenses[expenseIndex] = updatedExpense;
    res.json({
      message: "Expense rejected successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
