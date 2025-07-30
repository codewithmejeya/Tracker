# Tracker API Documentation

## Overview

The Tracker Management System provides a RESTful API for managing users, branches, expenses, and approvals. All endpoints (except authentication) require a valid JWT token.

## Authentication

### Base URL

```
http://localhost:8080/api
```

### Headers

```
Content-Type: application/json
Authorization: Bearer <jwt_token>  // For protected routes
```

## Authentication Endpoints

### POST /auth/login

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "id": "user_001",
    "username": "barath",
    "fullName": "Barath Kumar",
    "email": "barath@tracker.com",
    "employeeId": "EMP001",
    "department": "Admin",
    "role": "admin"
  }
}
```

**Error Responses:**

- `400`: Missing username or password
- `401`: Invalid credentials

### POST /auth/signup

Register a new user account.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "employeeId": "EMP002",
  "department": "Sales",
  "role": "employee"
}
```

**Response (201):**

```json
{
  "message": "Account created successfully",
  "user": {
    "id": "user_002",
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "employeeId": "EMP002",
    "department": "Sales",
    "role": "employee",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true
  }
}
```

**Error Responses:**

- `400`: Validation error or duplicate username/email/employeeId

## Dashboard Endpoints

### GET /dashboard/stats

Get dashboard statistics for the overview page.

**Response (200):**

```json
{
  "totalExpenses": 1547,
  "pendingApprovals": 23,
  "totalBranches": 8,
  "monthlySpend": 125430,
  "expenseGrowth": 12.5,
  "approvalRate": 87.3
}
```

### GET /dashboard/recent-expenses

Get recent expense activity for the dashboard.

**Response (200):**

```json
[
  {
    "id": "EXP001",
    "employeeName": "Rajesh Kumar",
    "amount": 2500,
    "category": "Travel",
    "status": "pending",
    "date": "2024-01-01T00:00:00.000Z"
  }
]
```

## Branch Management Endpoints

### GET /branches

Get all branches with optional filtering.

**Query Parameters:**

- `search` (optional): Search term for filtering
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**

```json
[
  {
    "id": "BR001",
    "branchName": "Main Branch",
    "location": "Chennai, Tamil Nadu",
    "contactPerson": "Rajesh Kumar",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /branches/:id

Get a specific branch by ID.

**Response (200):**

```json
{
  "id": "BR001",
  "branchName": "Main Branch",
  "location": "Chennai, Tamil Nadu",
  "contactPerson": "Rajesh Kumar",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `404`: Branch not found

### POST /branches

Create a new branch.

**Request Body:**

```json
{
  "branchName": "North Branch",
  "location": "Delhi, India",
  "contactPerson": "Priya Sharma"
}
```

**Response (201):**

```json
{
  "id": "BR006",
  "branchName": "North Branch",
  "location": "Delhi, India",
  "contactPerson": "Priya Sharma",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /branches/:id

Update an existing branch.

**Request Body:**

```json
{
  "branchName": "Updated Branch Name",
  "location": "Updated Location",
  "contactPerson": "Updated Contact"
}
```

**Response (200):**

```json
{
  "id": "BR001",
  "branchName": "Updated Branch Name",
  "location": "Updated Location",
  "contactPerson": "Updated Contact",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

### DELETE /branches/:id

Delete a branch.

**Response (200):**

```json
{
  "message": "Branch deleted successfully",
  "branch": {
    "id": "BR001",
    "branchName": "Deleted Branch",
    "location": "Some Location",
    "contactPerson": "Some Contact",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Expense Management Endpoints

### GET /expenses

Get all expenses for the current user's context.

**Response (200):**

```json
[
  {
    "id": "EXP001",
    "employeeName": "Rajesh Kumar",
    "employeeId": "EMP001",
    "department": "Sales",
    "category": "Travel & Transportation",
    "amount": 2500,
    "description": "Flight tickets for client meeting",
    "status": "submitted",
    "submittedDate": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /expenses/pending-approval

Get expenses pending approval with urgency indicators.

**Response (200):**

```json
[
  {
    "id": "EXP001",
    "employeeName": "Rajesh Kumar",
    "employeeId": "EMP001",
    "department": "Sales",
    "category": "Travel & Transportation",
    "amount": 2500,
    "description": "Flight tickets for client meeting",
    "submittedDate": "2024-01-01T00:00:00.000Z",
    "urgency": "high",
    "daysWaiting": 3,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /expenses

Create a new expense.

**Request Body:**

```json
{
  "employeeName": "John Doe",
  "employeeId": "EMP002",
  "department": "Marketing",
  "category": "Office Supplies",
  "amount": 500,
  "description": "Office stationery and supplies"
}
```

**Response (201):**

```json
{
  "id": "EXP006",
  "employeeName": "John Doe",
  "employeeId": "EMP002",
  "department": "Marketing",
  "category": "Office Supplies",
  "amount": 500,
  "description": "Office stationery and supplies",
  "status": "submitted",
  "submittedDate": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /expenses/:id

Update an existing expense (only if not approved).

**Request Body:** Same as POST
**Response (200):** Updated expense object

### DELETE /expenses/:id

Delete an expense (only if not approved).

**Response (200):**

```json
{
  "message": "Expense deleted successfully",
  "expense": {
    /* expense object */
  }
}
```

## Expense Approval Endpoints

### POST /expenses/:id/approve

Approve an expense.

**Request Body:**

```json
{
  "comments": "Approved for business travel",
  "approvedAmount": 2500 // Optional: for partial approvals
}
```

**Response (200):**

```json
{
  "message": "Expense approved successfully",
  "expense": {
    "id": "EXP001",
    "status": "approved",
    "approvedDate": "2024-01-01T12:00:00.000Z",
    "approverName": "barath",
    "amount": 2500
    // ... other expense fields
  }
}
```

### POST /expenses/:id/reject

Reject an expense.

**Request Body:**

```json
{
  "comments": "Insufficient documentation provided"
}
```

**Response (200):**

```json
{
  "message": "Expense rejected successfully",
  "expense": {
    "id": "EXP001",
    "status": "rejected",
    "rejectionReason": "Insufficient documentation provided"
    // ... other expense fields
  }
}
```

## Error Responses

### Common Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error

### Error Response Format

```json
{
  "message": "Error description",
  "errors": [
    // Optional: for validation errors
    {
      "field": "fieldName",
      "message": "Specific field error"
    }
  ]
}
```

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider:

- Authentication endpoints: 5 requests per minute
- Data modification endpoints: 100 requests per hour
- Read-only endpoints: 1000 requests per hour

## Security Notes

### Current Security Measures

- JWT token authentication
- Input validation with Zod
- CORS configuration
- Basic XSS protection through React

### Production Security Recommendations

- Implement password hashing (bcrypt)
- Add rate limiting middleware
- Use HTTPS in production
- Implement request logging
- Add API key authentication for service-to-service calls
- Configure security headers (CSP, HSTS, etc.)

## Data Models

### User Model

```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password: string; // Should be hashed in production
  employeeId: string;
  department: string;
  role: "employee" | "manager" | "admin";
  createdAt: string;
  isActive: boolean;
}
```

### Branch Model

```typescript
interface Branch {
  id: string;
  branchName: string;
  location: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
}
```

### Expense Model

```typescript
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
```

## Testing the API

### Using cURL

**Login:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"barath","password":"123456"}'
```

**Get Branches (with token):**

```bash
curl -X GET http://localhost:8080/api/branches \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the endpoints into Postman
2. Set up environment variables for base URL and token
3. Create a collection for organized testing
4. Use tests to validate responses

### Using JavaScript/Fetch

```javascript
// Login and store token
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "barath", password: "123456" }),
});
const { token } = await loginResponse.json();

// Use token for authenticated requests
const branchesResponse = await fetch("/api/branches", {
  headers: { Authorization: `Bearer ${token}` },
});
const branches = await branchesResponse.json();
```

This documentation covers all the available API endpoints in the Tracker Management System. For additional support or questions about the API, please refer to the main README.md file.
