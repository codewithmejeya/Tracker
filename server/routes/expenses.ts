import { RequestHandler } from "express";
import { z } from "zod";
import { getQueries } from "../database.js";

// Expense validation schema
const expenseSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
  status: z
    .enum(["draft", "submitted", "approved", "rejected"])
    .default("draft"),
});

const approvalSchema = z.object({
  comments: z.string().optional(),
  approvedAmount: z.number().positive().optional(),
});

// GET /api/expenses - Get all expenses
export const getAllExpenses: RequestHandler = (req, res) => {
  try {
    const expenses = getQueries().getAllExpenses.all();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/expenses/pending-approval - Get pending expenses for approval
export const getPendingExpenses: RequestHandler = (req, res) => {
  try {
    const pendingExpenses = queries.getPendingExpenses.all("pending");

    // Add urgency and days waiting calculation
    const enrichedExpenses = pendingExpenses.map((expense: any) => {
      const submittedDate = new Date(
        expense.submitted_date || expense.created_at,
      );
      const now = new Date();
      const daysWaiting = Math.floor(
        (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      let urgency: "low" | "medium" | "high" = "low";
      if (daysWaiting > 7) urgency = "high";
      else if (daysWaiting > 3) urgency = "medium";

      return {
        ...expense,
        daysWaiting,
        urgency,
        department: "General", // Default department
      };
    });

    res.json(enrichedExpenses);
  } catch (error) {
    console.error("Error fetching pending expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/expenses/:id - Get an expense by ID
export const getExpenseById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const expense = queries.getExpenseById.get(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/expenses - Create a new expense
export const createExpense: RequestHandler = (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      category,
      amount,
      description,
      receiptUrl,
      status,
    } = expenseSchema.parse(req.body);

    const result = queries.createExpense.run(
      employeeName,
      employeeId,
      category,
      amount,
      description || "",
      receiptUrl || "",
      status,
    );

    const newExpenseId = result.lastInsertRowid;
    const newExpense = queries.getExpenseById.get(newExpenseId);

    res.status(201).json({
      message: "Expense created successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/expenses/:id - Update an expense
export const updateExpense: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeName,
      employeeId,
      category,
      amount,
      description,
      receiptUrl,
      status,
    } = expenseSchema.parse(req.body);

    // Check if expense exists
    const existingExpense = queries.getExpenseById.get(id);
    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update the expense
    queries.updateExpense.run(
      employeeName,
      employeeId,
      category,
      amount,
      description || "",
      receiptUrl || "",
      status,
      id,
    );

    // Fetch the updated expense
    const updatedExpense = queries.getExpenseById.get(id);

    res.json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/expenses/:id - Delete an expense
export const deleteExpense: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    // Check if expense exists
    const existingExpense = queries.getExpenseById.get(id);
    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Delete the expense
    queries.deleteExpense.run(id);

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/expenses/:id/approve - Approve an expense
export const approveExpense: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { comments, approvedAmount } = approvalSchema.parse(req.body);

    // Check if expense exists
    const existingExpense = queries.getExpenseById.get(id) as any;
    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Get approver name from token (simplified)
    const user = (req as any).user;
    const approverName = user?.username || "System";

    // Approve the expense
    queries.approveExpense.run(approverName, id);

    // Fetch the updated expense
    const updatedExpense = queries.getExpenseById.get(id);

    res.json({
      message: "Expense approved successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error approving expense:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/expenses/:id/reject - Reject an expense
export const rejectExpense: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = approvalSchema.parse(req.body);

    // Check if expense exists
    const existingExpense = queries.getExpenseById.get(id);
    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Reject the expense
    queries.rejectExpense.run(comments || "No reason provided", id);

    // Fetch the updated expense
    const updatedExpense = queries.getExpenseById.get(id);

    res.json({
      message: "Expense rejected successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error rejecting expense:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
