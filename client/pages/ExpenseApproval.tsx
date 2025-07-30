import { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Download,
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

interface PendingExpense {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  category: string;
  amount: number;
  description: string;
  receiptUrl?: string;
  submittedDate: string;
  urgency: 'low' | 'medium' | 'high';
  daysWaiting: number;
  createdAt: string;
}

interface ApprovalAction {
  expenseId: string;
  action: 'approve' | 'reject';
  comments: string;
  amount?: number; // for partial approvals
}

export default function ExpenseApproval() {
  const [pendingExpenses, setPendingExpenses] = useState<PendingExpense[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewingExpense, setReviewingExpense] = useState<PendingExpense | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [partialAmount, setPartialAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const categories = [
    'Travel & Transportation',
    'Meals & Entertainment',
    'Office Supplies',
    'Communications',
    'Training & Development',
    'Client Meeting',
    'Software & Subscriptions',
    'Equipment & Hardware',
    'Other'
  ];

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      const response = await fetch('/api/expenses/pending-approval', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingExpenses(data);
      } else {
        // Fallback mock data
        setPendingExpenses([
          {
            id: 'EXP001',
            employeeName: 'Rajesh Kumar',
            employeeId: 'EMP001',
            department: 'Sales',
            category: 'Travel & Transportation',
            amount: 2500,
            description: 'Flight tickets for client meeting in Mumbai',
            submittedDate: new Date().toISOString(),
            urgency: 'high',
            daysWaiting: 1,
            createdAt: new Date().toISOString()
          },
          {
            id: 'EXP003',
            employeeName: 'Arun Patel',
            employeeId: 'EMP003',
            department: 'Marketing',
            category: 'Meals & Entertainment',
            amount: 1200,
            description: 'Client dinner at Taj Hotel',
            submittedDate: new Date(Date.now() - 172800000).toISOString(),
            urgency: 'medium',
            daysWaiting: 2,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 'EXP006',
            employeeName: 'Lakshmi Narayanan',
            employeeId: 'EMP006',
            department: 'IT',
            category: 'Software & Subscriptions',
            amount: 5000,
            description: 'Annual software license renewal',
            submittedDate: new Date(Date.now() - 259200000).toISOString(),
            urgency: 'low',
            daysWaiting: 3,
            createdAt: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: 'EXP007',
            employeeName: 'Kavitha Reddy',
            employeeId: 'EMP007',
            department: 'HR',
            category: 'Training & Development',
            amount: 8500,
            description: 'Leadership training program',
            submittedDate: new Date(Date.now() - 345600000).toISOString(),
            urgency: 'medium',
            daysWaiting: 4,
            createdAt: new Date(Date.now() - 345600000).toISOString()
          },
          {
            id: 'EXP008',
            employeeName: 'Ravi Shankar',
            employeeId: 'EMP008',
            department: 'Operations',
            category: 'Equipment & Hardware',
            amount: 12000,
            description: 'New laptop for development work',
            submittedDate: new Date(Date.now() - 432000000).toISOString(),
            urgency: 'high',
            daysWaiting: 5,
            createdAt: new Date(Date.now() - 432000000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching pending expenses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending expenses.",
        variant: "destructive",
      });
    }
  };

  const handleApprovalAction = async (expense: PendingExpense, action: 'approve' | 'reject', comments: string, amount?: number) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(`/api/expenses/${expense.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          comments,
          approvedAmount: amount || expense.amount
        })
      });

      if (response.ok) {
        fetchPendingExpenses();
        setIsReviewDialogOpen(false);
        setReviewingExpense(null);
        setApprovalComments('');
        setPartialAmount('');
        
        toast({
          title: "Success",
          description: `Expense ${action}d successfully.`,
        });
      } else {
        throw new Error(`Failed to ${action} expense`);
      }
    } catch (error) {
      console.error(`Error ${action}ing expense:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} expense.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkApproval = async (action: 'approve' | 'reject') => {
    if (selectedExpenses.size === 0) {
      toast({
        title: "Warning",
        description: "Please select expenses to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const promises = Array.from(selectedExpenses).map(expenseId => {
        const expense = pendingExpenses.find(e => e.id === expenseId);
        if (expense) {
          return handleApprovalAction(expense, action, `Bulk ${action}al`);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedExpenses(new Set());
      
      toast({
        title: "Success",
        description: `${selectedExpenses.size} expenses ${action}d successfully.`,
      });
    } catch (error) {
      console.error(`Error in bulk ${action}al:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} selected expenses.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReview = (expense: PendingExpense) => {
    setReviewingExpense(expense);
    setApprovalAction('approve');
    setApprovalComments('');
    setPartialAmount('');
    setIsReviewDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{urgency}</Badge>;
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <Clock className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredExpenses = pendingExpenses.filter(expense => {
    const matchesSearch = expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'all' || expense.urgency === urgencyFilter;
    
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const totalPendingAmount = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgProcessingTime = pendingExpenses.length > 0 
    ? Math.round(pendingExpenses.reduce((sum, expense) => sum + expense.daysWaiting, 0) / pendingExpenses.length)
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Approval</h1>
            <p className="text-gray-600">Review and approve pending expense submissions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => handleBulkApproval('approve')}
              className="bg-green-600 hover:bg-green-700"
              disabled={selectedExpenses.size === 0 || isProcessing}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Bulk Approve
            </Button>
            <Button 
              onClick={() => handleBulkApproval('reject')}
              variant="destructive"
              disabled={selectedExpenses.size === 0 || isProcessing}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Bulk Reject
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingExpenses.length}</div>
              <p className="text-xs text-gray-500 mt-1">expenses waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalPendingAmount)}</div>
              <p className="text-xs text-gray-500 mt-1">pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Processing</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{avgProcessingTime} days</div>
              <p className="text-xs text-gray-500 mt-1">average waiting time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {pendingExpenses.filter(e => e.urgency === 'high').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">urgent approvals</p>
            </CardContent>
          </Card>
        </div>

        {/* High Priority Alert */}
        {pendingExpenses.filter(e => e.urgency === 'high' && e.daysWaiting > 2).length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Urgent Attention Required</AlertTitle>
            <AlertDescription className="text-red-700">
              You have {pendingExpenses.filter(e => e.urgency === 'high' && e.daysWaiting > 2).length} high-priority 
              expenses waiting for more than 2 days. Please review immediately.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
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

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {selectedExpenses.size} of {filteredExpenses.length} selected
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedExpenses.size === filteredExpenses.length) {
                    setSelectedExpenses(new Set());
                  } else {
                    setSelectedExpenses(new Set(filteredExpenses.map(e => e.id)));
                  }
                }}
              >
                {selectedExpenses.size === filteredExpenses.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedExpenses.size === paginatedExpenses.length && paginatedExpenses.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedExpenses(new Set(paginatedExpenses.map(expense => expense.id)));
                      } else {
                        setSelectedExpenses(new Set());
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Expense</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Days Waiting</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense.id} className={expense.urgency === 'high' ? 'bg-red-50' : ''}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedExpenses.has(expense.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedExpenses);
                        if (e.target.checked) {
                          newSelected.add(expense.id);
                        } else {
                          newSelected.delete(expense.id);
                        }
                        setSelectedExpenses(newSelected);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-mono text-sm">{expense.id}</div>
                      <div className="text-sm text-gray-500 truncate max-w-40">{expense.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.employeeName}</div>
                      <div className="text-sm text-gray-500">{expense.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getUrgencyIcon(expense.urgency)}
                      {getUrgencyBadge(expense.urgency)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={expense.daysWaiting > 3 ? "destructive" : "secondary"}>
                      {expense.daysWaiting} days
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReview(expense)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprovalAction(expense, 'approve', 'Quick approval')}
                        className="text-green-600 hover:text-green-800"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprovalAction(expense, 'reject', 'Quick rejection')}
                        className="text-red-600 hover:text-red-800"
                        disabled={isProcessing}
                      >
                        <XCircle className="w-4 h-4" />
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} expenses
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Review Expense</DialogTitle>
            </DialogHeader>
            {reviewingExpense && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{reviewingExpense.id}</h3>
                      <p className="text-gray-600">{reviewingExpense.category}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Employee Information</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-gray-600">Name:</span> {reviewingExpense.employeeName}</div>
                        <div><span className="text-gray-600">ID:</span> {reviewingExpense.employeeId}</div>
                        <div><span className="text-gray-600">Department:</span> {reviewingExpense.department}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm">{reviewingExpense.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-digitrac-blue mb-2">
                          {formatCurrency(reviewingExpense.amount)}
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          {getUrgencyIcon(reviewingExpense.urgency)}
                          {getUrgencyBadge(reviewingExpense.urgency)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-gray-600">Submitted:</span> {new Date(reviewingExpense.submittedDate).toLocaleDateString('en-IN')}</div>
                        <div><span className="text-gray-600">Waiting:</span> {reviewingExpense.daysWaiting} days</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Approval Decision</h4>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <Button
                        variant={approvalAction === 'approve' ? 'default' : 'outline'}
                        onClick={() => setApprovalAction('approve')}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant={approvalAction === 'reject' ? 'destructive' : 'outline'}
                        onClick={() => setApprovalAction('reject')}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>

                    {approvalAction === 'approve' && (
                      <div>
                        <Label htmlFor="partialAmount">Approved Amount (optional)</Label>
                        <Input
                          id="partialAmount"
                          type="number"
                          step="0.01"
                          value={partialAmount}
                          onChange={(e) => setPartialAmount(e.target.value)}
                          placeholder={`Original amount: ${reviewingExpense.amount}`}
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="comments">Comments</Label>
                      <Textarea
                        id="comments"
                        value={approvalComments}
                        onChange={(e) => setApprovalComments(e.target.value)}
                        placeholder={`Add your ${approvalAction} comments...`}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => setIsReviewDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleApprovalAction(
                          reviewingExpense, 
                          approvalAction, 
                          approvalComments,
                          partialAmount ? parseFloat(partialAmount) : undefined
                        )}
                        className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                        variant={approvalAction === 'reject' ? 'destructive' : 'default'}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : `${approvalAction === 'approve' ? 'Approve' : 'Reject'} Expense`}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
