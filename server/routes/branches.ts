import { RequestHandler } from 'express';
import { z } from 'zod';

// Branch data validation schema
const BranchSchema = z.object({
  branchName: z.string().min(1, 'Branch name is required'),
  location: z.string().min(1, 'Location is required'),
  contactPerson: z.string().min(1, 'Contact person is required')
});

// In-memory database for branches (in production, use a real database)
interface Branch {
  id: string;
  branchName: string;
  location: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
}

let branches: Branch[] = [
  {
    id: 'BR001',
    branchName: 'Main Branch',
    location: 'Chennai, Tamil Nadu',
    contactPerson: 'Rajesh Kumar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'BR002',
    branchName: 'North Branch',
    location: 'Delhi, India',
    contactPerson: 'Priya Sharma',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'BR003',
    branchName: 'West Branch',
    location: 'Mumbai, Maharashtra',
    contactPerson: 'Arun Patel',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'BR004',
    branchName: 'South Branch',
    location: 'Bangalore, Karnataka',
    contactPerson: 'Meera Reddy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'BR005',
    branchName: 'East Branch',
    location: 'Kolkata, West Bengal',
    contactPerson: 'Suresh Das',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Generate unique branch ID
function generateBranchId(): string {
  const lastBranch = branches.sort((a, b) => a.id.localeCompare(b.id)).pop();
  if (!lastBranch) return 'BR001';
  
  const lastNumber = parseInt(lastBranch.id.substring(2));
  return `BR${String(lastNumber + 1).padStart(3, '0')}`;
}

// GET /api/branches - Get all branches
export const getAllBranches: RequestHandler = (req, res) => {
  res.json(branches.sort((a, b) => a.id.localeCompare(b.id)));
};

// GET /api/branches/:id - Get branch by ID
export const getBranchById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const branch = branches.find(b => b.id === id);
  
  if (!branch) {
    return res.status(404).json({ message: 'Branch not found' });
  }
  
  res.json(branch);
};

// POST /api/branches - Create new branch
export const createBranch: RequestHandler = (req, res) => {
  try {
    const validatedData = BranchSchema.parse(req.body);
    
    // Check if branch name already exists
    const existingBranch = branches.find(b => 
      b.branchName.toLowerCase() === validatedData.branchName.toLowerCase()
    );
    
    if (existingBranch) {
      return res.status(400).json({ message: 'Branch name already exists' });
    }
    
    const newBranch: Branch = {
      id: generateBranchId(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    branches.push(newBranch);
    res.status(201).json(newBranch);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/branches/:id - Update branch
export const updateBranch: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = BranchSchema.parse(req.body);
    
    const branchIndex = branches.findIndex(b => b.id === id);
    if (branchIndex === -1) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    // Check if branch name already exists (excluding current branch)
    const existingBranch = branches.find(b => 
      b.branchName.toLowerCase() === validatedData.branchName.toLowerCase() && b.id !== id
    );
    
    if (existingBranch) {
      return res.status(400).json({ message: 'Branch name already exists' });
    }
    
    const updatedBranch: Branch = {
      ...branches[branchIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    branches[branchIndex] = updatedBranch;
    res.json(updatedBranch);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/branches/:id - Delete branch
export const deleteBranch: RequestHandler = (req, res) => {
  const { id } = req.params;
  const branchIndex = branches.findIndex(b => b.id === id);
  
  if (branchIndex === -1) {
    return res.status(404).json({ message: 'Branch not found' });
  }
  
  const deletedBranch = branches.splice(branchIndex, 1)[0];
  res.json({ message: 'Branch deleted successfully', branch: deletedBranch });
};
