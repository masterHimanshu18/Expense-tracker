import React, { useState, useEffect } from "react";
import api from "@/lib/api";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/expenses", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setExpenses(response.data);
        } catch (error) {
          console.error("Failed to fetch expenses:", error);
        }
      }
    };
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (id: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.delete(`/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(expenses.filter((expense) => expense.id !== id));
      } catch (error) {
        console.error("Failed to delete expense:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">My Expenses</h1>
      <ul className="mt-4">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="p-4 border rounded mb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{expense.title}</h3>
              <p>Amount: ₹{expense.amount}</p>
              <p>Category: {expense.category}</p>
              <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
              {expense.notes && <p>Notes: {expense.notes}</p>}
            </div>
            <div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteExpense(expense.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;