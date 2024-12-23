import express from "express";
import { verifyToken } from "../middlewares/authMiddleware"; // Middleware to verify user authentication
import Expense from "../models/Expense"; // Expense model

// Extend Express Request to include `user` property
interface CustomRequest extends express.Request {
  user?: { id: string }; // The user object is added by the verifyToken middleware
}

const router = express.Router();

/**
 * GET /api/expenses
 * Fetch all expenses for the logged-in user
 */
router.get("/", verifyToken, async (req: CustomRequest, res) => {
  try {
    // Retrieve all expenses associated with the authenticated user's ID
    const expenses = await Expense.find({ userId: req.user?.id });
    res.json(expenses); // Send the expenses as a JSON response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" }); // Handle errors
  }
});

/**
 * POST /api/expenses
 * Create a new expense for the logged-in user
 */
router.post("/", verifyToken, async (req: CustomRequest, res: express.Response): Promise<void> => {
  console.log("Request body:", req.body); // Debugging log
  console.log("User ID:", req.user?.id); // Debugging log
  try {
    const { title, amount, category, date, notes } = req.body; // Extract expense details from the request body
    if (!title || !amount || !category || !date) {
      res.status(400).json({ error: "Title, amount, category, and date are required" }); // Validation check
      return;
    }

    // Create a new expense associated with the authenticated user
    const newExpense = new Expense({
      userId: req.user?.id, // Link the expense to the user's ID
      title,
      amount,
      category,
      date,
      notes,
    });

    await newExpense.save(); // Save the expense to the database
    res.status(201).json(newExpense); // Respond with the created expense
  } catch (error) {
    console.error("Error in backend:", error); // Debugging log
    res.status(500).json({ error: "Failed to create expense" }); // Handle errors
  }
});

/**
 * PUT /api/expenses/:id
 * Update an expense by its ID
 */
router.put("/:id", verifyToken, async (req: CustomRequest, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params; // Extract the expense ID from the URL
    const { title, amount, category, date, notes } = req.body; // Extract updated expense details from the request body

    // Find the expense by ID and user, then update it
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user?.id }, // Ensure the expense belongs to the user
      { title, amount, category, date, notes }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      res.status(404).json({ error: "Expense not found" }); // Handle non-existing expenses
      return;
    }

    res.json(updatedExpense); // Respond with the updated expense
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" }); // Handle errors
  }
});

/**
 * DELETE /api/expenses/:id
 * Delete an expense by its ID
 */
router.delete("/:id", verifyToken, async (req: CustomRequest, res): Promise<void> => {
  try {
    const { id } = req.params; // Extract the expense ID from the URL

    // Find the expense by ID and user, then delete it
    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user?.id, // Ensure the expense belongs to the user
    });

    if (!deletedExpense) {
      res.status(404).json({ error: "Expense not found" }); // Handle non-existing expenses
      return;
    }

    res.json({ message: "Expense deleted successfully" }); // Respond with a success message
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" }); // Handle errors
  }
});

export default router;
