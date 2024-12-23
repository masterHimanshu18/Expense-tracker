// backend/models/Expense.ts
import { Schema, model, models } from "mongoose";

interface IExpense {
  title: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String }, // Optional field
  },
  { timestamps: true }
);

export default models.Expense || model<IExpense>("Expense", ExpenseSchema);