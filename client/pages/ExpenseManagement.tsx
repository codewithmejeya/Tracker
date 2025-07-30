import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

interface Expense {
  id: string;
  employeeName: string;
  employeeId: string;
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

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    category: "",
    amount: "",
    description: "",
    receiptFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const categories = [
    "Travel & Transportation",
    "Meals & Entertainment",
    "Office Supplies",
    "Communications",
    "Training & Development",
    "Client Meeting",
    "Software & Subscriptions",
    "Equipment & Hardware",
    "Other",
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        // Fallback mock data
        setExpenses([
          {
            id: "EXP001",
            employeeName: "Rajesh Kumar",
            employeeId: "EMP001",
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
        ]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch expenses.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingExpense ? "PUT" : "POST";
      const url = editingExpense
        ? `/api/expenses/${editingExpense.id}`
        : "/api/expenses";

      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        fetchExpenses();
        setIsAddDialogOpen(false);
        setEditingExpense(null);
        resetForm();
        toast({
          title: "Success",
          description: `Expense ${editingExpense ? "updated" : "created"} successfully.`,
        });
      } else {
        throw new Error("Failed to save expense");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({
        title: "Error",
        description: "Failed to save expense.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      employeeName: expense.employeeName,
      employeeId: expense.employeeId,
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      receiptFile: null,
    });
    setIsAddDialogOpen(true);
  };

  const handleView = (expense: Expense) => {
    setViewingExpense(expense);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await fetch(`/api/expenses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          fetchExpenses();
          toast({
            title: "Success",
            description: "Expense deleted successfully.",
          });
        } else {
          throw new Error("Failed to delete expense");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast({
          title: "Error",
          description: "Failed to delete expense.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      category: "",
      amount: "",
      description: "",
      receiptFile: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-600">
            Draft
          </Badge>
        );
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || expense.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Expense Management
            </h1>
            <p className="text-gray-600">
              Manage and track all expense submissions
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-tracker-blue hover:bg-tracker-blue/90"
                  onClick={() => {
                    setEditingExpense(null);
                    resetForm();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingExpense ? "Edit Expense" : "Add New Expense"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeName">Employee Name</Label>
                      <Input
                        id="employeeName"
                        value={formData.employeeName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeId: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receipt">Receipt (Optional)</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*,application/pdf"
                      ref={fileInputRef}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          receiptFile: e.target.files?.[0] || null,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-tracker-blue hover:bg-tracker-blue/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingExpense
                          ? "Update"
                          : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredExpenses.length} expenses found
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-mono text-sm">
                    {expense.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.employeeName}</div>
                      <div className="text-sm text-gray-500">
                        {expense.employeeId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(expense.status)}
                      {getStatusBadge(expense.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(expense.submittedDate).toLocaleDateString(
                      "en-IN",
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(expense)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        disabled={expense.status === "approved"}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={expense.status === "approved"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredExpenses.length)}{" "}
                of {filteredExpenses.length} expenses
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
            </DialogHeader>
            {viewingExpense && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {viewingExpense.id}
                    </h3>
                    <p className="text-gray-600">{viewingExpense.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-tracker-blue">
                      {formatCurrency(viewingExpense.amount)}
                    </div>
                    {getStatusBadge(viewingExpense.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Employee Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>{" "}
                        {viewingExpense.employeeName}
                      </div>
                      <div>
                        <span className="text-gray-600">ID:</span>{" "}
                        {viewingExpense.employeeId}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Dates</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Submitted:</span>{" "}
                        {new Date(
                          viewingExpense.submittedDate,
                        ).toLocaleDateString("en-IN")}
                      </div>
                      {viewingExpense.approvedDate && (
                        <div>
                          <span className="text-gray-600">Approved:</span>{" "}
                          {new Date(
                            viewingExpense.approvedDate,
                          ).toLocaleDateString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {viewingExpense.description}
                  </p>
                </div>

                {viewingExpense.approverName && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Approval Information
                    </h4>
                    <p className="text-sm text-gray-600">
                      Approved by: {viewingExpense.approverName}
                    </p>
                  </div>
                )}

                {viewingExpense.rejectionReason && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Rejection Reason
                    </h4>
                    <p className="text-sm text-red-600">
                      {viewingExpense.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
