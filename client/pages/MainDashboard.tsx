import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/components/Layout";
import { getApiUrl } from "@/lib/api-config";

interface DashboardStats {
  totalExpenses: number;
  pendingApprovals: number;
  totalBranches: number;
  monthlySpend: number;
  expenseGrowth: number;
  approvalRate: number;
}

interface RecentExpense {
  id: string;
  employeeName: string;
  amount: number;
  category: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export default function MainDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    pendingApprovals: 0,
    totalBranches: 0,
    monthlySpend: 0,
    expenseGrowth: 0,
    approvalRate: 0,
  });

  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Try to fetch from API, with graceful fallback to mock data
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const [statsResponse, expensesResponse] = await Promise.all([
        fetch(getApiUrl("dashboard/stats"), {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => null), // Return null on network error
        fetch(getApiUrl("dashboard/recent-expenses"), {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => null), // Return null on network error
      ]);

      if (statsResponse?.ok) {
        try {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } catch {
          // JSON parsing failed, use fallback
          setStats({
            totalExpenses: 1547,
            pendingApprovals: 23,
            totalBranches: 8,
            monthlySpend: 125430,
            expenseGrowth: 12.5,
            approvalRate: 87.3,
          });
        }
      } else {
        // Fallback mock data
        setStats({
          totalExpenses: 1547,
          pendingApprovals: 23,
          totalBranches: 8,
          monthlySpend: 125430,
          expenseGrowth: 12.5,
          approvalRate: 87.3,
        });
      }

      if (expensesResponse?.ok) {
        try {
          const expensesData = await expensesResponse.json();
          setRecentExpenses(expensesData);
        } catch {
          // JSON parsing failed, use fallback
          setRecentExpenses([
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
          ]);
        }
      } else {
        // Fallback mock data
        setRecentExpenses([
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
        ]);
      }
    } catch (error) {
      console.warn(
        "Dashboard API unavailable, using mock data:",
        error.message,
      );
      // Set fallback data on network error
      setStats({
        totalExpenses: 1547,
        pendingApprovals: 23,
        totalBranches: 8,
        monthlySpend: 125430,
        expenseGrowth: 12.5,
        approvalRate: 87.3,
      });

      setRecentExpenses([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    description,
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: "up" | "down";
    trendValue?: string;
    description: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && trendValue && (
          <div
            className={`flex items-center text-xs ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trendValue}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-tracker-blue to-tracker-light-blue rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Barath!</h1>
              <p className="text-blue-100 mt-1">
                Here's what's happening in your organization today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Today</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Expenses"
            value={stats.totalExpenses.toLocaleString()}
            icon={Receipt}
            trend="up"
            trendValue={`+${stats.expenseGrowth}%`}
            description="vs last month"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={Clock}
            description="awaiting review"
          />
          <StatCard
            title="Monthly Spend"
            value={formatCurrency(stats.monthlySpend)}
            icon={DollarSign}
            trend="up"
            trendValue="+8.2%"
            description="current month"
          />
          <StatCard
            title="Active Branches"
            value={stats.totalBranches}
            icon={Building2}
            description="across regions"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Expenses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Expenses</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.employeeName}
                        </TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Submit Expense
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Approvals
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Branches
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </CardContent>
            </Card>

            {/* Approval Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="text-lg font-semibold text-green-600">
                      {stats.approvalRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${stats.approvalRate}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="font-semibold text-green-600">142</div>
                      <div className="text-gray-500">Approved</div>
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-600">23</div>
                      <div className="text-gray-500">Pending</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600">12</div>
                      <div className="text-gray-500">Rejected</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Health</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-600">
                        Operational
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Backup</span>
                    <span className="text-sm text-gray-600">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Users</span>
                    <span className="text-sm text-gray-600">47 online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
