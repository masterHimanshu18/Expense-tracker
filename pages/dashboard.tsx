import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Moon, Sun } from "lucide-react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "@/lib/api";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: 0,
    category: "",
    date: "",
    notes: "",
  });
  

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  const handleLogout = async () => {
    await signOut();
  };

  const handleCreateExpense = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging log
    if (token) {
      console.log("Making API call with:", newExpense); // Debugging log
      const response = await api.post("/expenses", newExpense, { headers: { Authorization: `Bearer ${token}` } });
      console.log("API response:", response.data); // Debugging log
      setExpenses([...expenses, response.data]);
      setShowModal(false);
      setNewExpense({ title: "", amount: 0, category: "", date: "", notes: "" });
    } else {
      console.log("No token found"); // Debugging log
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      await api.delete(`/expenses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  const expenseDataByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(expenseDataByCategory).map((category) => ({
    name: category,
    value: expenseDataByCategory[category],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (status === "loading") {
    return <p>Loading...</p>; // Show a loading state while session status is being checked
  }

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
      <button
        onClick={toggleDarkMode}
        className={`mb-4 p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {session ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {session.user?.name || "User"}!</h1>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleLogout}>
            Logout
          </button>

          <div className="mt-6">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => setShowModal(true)}
            >
              Add Expense
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="p-4 bg-white rounded shadow dark:bg-gray-800 dark:text-gray-200">
                <h3 className="text-lg font-bold">{expense.description}</h3>
                <p>Amount: ₹{expense.amount}</p>
                <p>Category: {expense.category}</p>
                <p>Date: {new Date(expense.date).toLocaleDateString()}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Expense Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : null}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold">Add Expense</h3>
            <input
              type="text"
              placeholder="Title"
              value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              className="mt-4 w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              className="mt-2 w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="mt-2 w-full p-2 border rounded"
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="mt-2 w-full p-2 border rounded"
            />
            <textarea
              placeholder="Notes (Optional)"
              value={newExpense.notes}
              onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
              className="mt-2 w-full p-2 border rounded"
            />
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  console.log("Save button clicked"); // Debugging log
                  handleCreateExpense();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
