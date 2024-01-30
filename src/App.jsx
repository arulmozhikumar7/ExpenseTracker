// App.js
import React, { useState, useEffect } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import ExpenseChart from "./ExpenseChart";
import { GoSun } from "react-icons/go";
import { IoMoon } from "react-icons/io5";
import axios from "axios";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleExpenseDeleted = () => {
    setExpenses((prevExpenses) => [...prevExpenses]);
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          "https://expense-tracker-backend-9fni.onrender.com/getExpenses"
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error.message);
      }
    };

    fetchExpenses();
  }, [handleExpenseDeleted]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className={`flex items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-800 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="flex flex-col w-full max-w-6xl mx-auto overflow-hidden bg-white rounded-md shadow-md dark:bg-gray-900 md:flex-row md:h-full">
        <div className="w-full p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700 md:w-1/4">
          <h1 className="mb-6 text-3xl font-bold dark:text-teal-300">
            Expense Tracker
          </h1>
          <TransactionForm onAddExpense={handleAddExpense} />
        </div>
        <div className="w-full p-4 overflow-y-auto md:w-1/2">
          <TransactionList
            onExpenseDeleted={handleExpenseDeleted}
            expenses={expenses}
          />
        </div>
        <div className="p-4 border-l border-gray-200 dark:border-gray-700 md:w-1/4">
          <ExpenseChart expenses={expenses} />
        </div>
      </div>
      <div className="fixed top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 text-white rounded-md ${
            isDarkMode ? "bg-teal-700" : "bg-blue-500"
          }`}
        >
          {isDarkMode ? <IoMoon /> : <GoSun />}
        </button>
      </div>
    </div>
  );
}

export default App;
