import { RequestHandler } from "express";
import { z } from "zod";
import { getQueries } from "../database.js";

// Branch validation schema
const branchSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  location: z.string().min(1, "Location is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
});

// GET /api/branches - Get all branches
export const getAllBranches: RequestHandler = (req, res) => {
  try {
    const branches = getQueries().getAllBranches.all();
    res.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/branches/:id - Get a branch by ID
export const getBranchById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const branch = queries.getBranchById.get(id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/branches - Create a new branch
export const createBranch: RequestHandler = (req, res) => {
  try {
    const { branchName, location, contactPerson } = branchSchema.parse(
      req.body,
    );

    const result = queries.createBranch.run(
      branchName,
      location,
      contactPerson,
    );
    const newBranchId = result.lastInsertRowid;

    // Fetch the created branch
    const newBranch = queries.getBranchById.get(newBranchId);

    res.status(201).json({
      message: "Branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.error("Error creating branch:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/branches/:id - Update a branch
export const updateBranch: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { branchName, location, contactPerson } = branchSchema.parse(
      req.body,
    );

    // Check if branch exists
    const existingBranch = queries.getBranchById.get(id);
    if (!existingBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Update the branch
    queries.updateBranch.run(branchName, location, contactPerson, id);

    // Fetch the updated branch
    const updatedBranch = queries.getBranchById.get(id);

    res.json({
      message: "Branch updated successfully",
      branch: updatedBranch,
    });
  } catch (error) {
    console.error("Error updating branch:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/branches/:id - Delete a branch
export const deleteBranch: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    // Check if branch exists
    const existingBranch = queries.getBranchById.get(id);
    if (!existingBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Delete the branch
    queries.deleteBranch.run(id);

    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
