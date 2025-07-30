import { RequestHandler } from "express";

// Mock data - in real app, this would come from database queries
const calculateDashboardStats = () => {
  return {
    totalExpenses: 1547,
    pendingApprovals: 23,
    totalBranches: 8,
    monthlySpend: 125430,
    expenseGrowth: 12.5,
    approvalRate: 87.3,
  };
};

const generateRecentExpenses = () => {
  return [
    {
      id: "EXP001",
      employeeName: "Rajesh Kumar",
      amount: 2500,
      category: "Travel",
      status: "pending",
      date: new Date().toISOString(),
    },
    {
      id: "EXP002",
      employeeName: "Priya Sharma",
      amount: 850,
      category: "Office Supplies",
      status: "approved",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "EXP003",
      employeeName: "Arun Patel",
      amount: 1200,
      category: "Client Meeting",
      status: "pending",
      date: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "EXP004",
      employeeName: "Meera Reddy",
      amount: 450,
      category: "Communications",
      status: "rejected",
      date: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "EXP005",
      employeeName: "Suresh Das",
      amount: 3200,
      category: "Training",
      status: "approved",
      date: new Date(Date.now() - 345600000).toISOString(),
    },
  ];
};

// GET /api/dashboard/stats - Get dashboard statistics
export const getDashboardStats: RequestHandler = (req, res) => {
  const stats = calculateDashboardStats();
  res.json(stats);
};

// GET /api/dashboard/recent-expenses - Get recent expenses for dashboard
export const getRecentExpenses: RequestHandler = (req, res) => {
  const recentExpenses = generateRecentExpenses();
  res.json(recentExpenses);
};
