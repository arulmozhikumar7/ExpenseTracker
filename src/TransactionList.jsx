import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { MdEdit, MdDelete } from "react-icons/md";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const TransactionList = ({ onExpenseDeleted }) => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [sortOrder, setSortOrder] = useState("date"); // Default sort order

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
  }, [onExpenseDeleted, sortOrder]);

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await axios.delete(
        `https://expense-tracker-backend-9fni.onrender.com/deleteExpense/${expenseId}`
      );
      console.log("Expense deleted:", response.data);
      onExpenseDeleted(); // Trigger a refresh after deletion
    } catch (error) {
      console.error("Error deleting expense:", error.message);
    }
  };

  const handleEditExpense = async (expenseId) => {
    const expenseToEdit = expenses.find((expense) => expense._id === expenseId);
    setEditingExpenseId(expenseId);
    setEditedDescription(expenseToEdit.description);
    setEditedAmount(expenseToEdit.amount.toString());
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `https://expense-tracker-backend-9fni.onrender.com/editExpense/${editingExpenseId}`,
        {
          description: editedDescription,
          amount: parseFloat(editedAmount),
          // Exclude transactionDate when editing
          // transactionDate: new Date().toISOString(),
        }
      );
      console.log("Expense edited:", response.data);
      setEditingExpenseId(null);
      onExpenseDeleted(); // Trigger a refresh after edit
    } catch (error) {
      console.error("Error editing expense:", error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setEditedDescription("");
    setEditedAmount("");
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedExpenses = [...expenses];

  if (sortOrder === "low") {
    sortedExpenses.sort((a, b) => a.amount - b.amount);
  } else if (sortOrder === "high") {
    sortedExpenses.sort((a, b) => b.amount - a.amount);
  } else if (sortOrder === "old") {
    sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOrder === "new") {
    sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const sortOptions = [
    { label: "Date Old", value: "old" },
    { label: "Date New", value: "new" },
    { label: "Low Expense", value: "low" },
    { label: "High Expense", value: "high" },
  ];

  const formatDate = (dateString) => {
    const optionsTime = { hour: "numeric", minute: "numeric" };
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };

    const expenseDate = new Date(dateString);
    const currentDate = new Date();

    // Check if the expense is within the last 24 hours
    const within24Hours = currentDate - expenseDate < 24 * 60 * 60 * 1000;

    return within24Hours
      ? expenseDate.toLocaleTimeString(undefined, optionsTime)
      : expenseDate.toLocaleDateString(undefined, optionsDate);
  };

  const handleExportCSV = () => {
    const csvData = expenses.map((expense) => ({
      Description: expense.description,
      Amount: expense.amount,
      Date: new Date(expense.date).toLocaleDateString(),
      Time: new Date(expense.date).toLocaleTimeString(),
    }));

    return csvData;
  };
  const handleExportPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Expense List", 20, 10);

    const columns = ["Description", "Amount", "Date and Time"]; // Update columns
    const rows = expenses.map((expense) => [
      expense.description,
      expense.amount,
      formatDateTime(expense.date),
    ]);

    pdf.autoTable({
      head: [columns],
      body: rows,
    });

    pdf.save("expense_list.pdf");
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const expenseDate = new Date(dateString);
    return expenseDate.toLocaleString(undefined, options);
  };
  return (
    <div className="max-w-md p-6 mx-auto my-8 bg-white rounded-md shadow-lg dark:bg-gray-900">
      <h2 className="mb-4 text-2xl font-bold dark:text-teal-300">
        Transaction List
      </h2>
      <div className="mb-4">
        <label className="dark:text-white">Sort By:</label>
        <select
          className="p-2 ml-2 border dark:text-white dark:bg-gray-700"
          value={sortOrder}
          onChange={(e) => handleSort(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>{" "}
      <CSVLink data={handleExportCSV()} filename="expense_list.csv">
        <button className="p-2 text-white bg-green-500 rounded-md dark:bg-teal-700">
          Export CSV
        </button>
      </CSVLink>
      <button
        onClick={handleExportPDF}
        className="px-4 py-2 mt-4 ml-4 text-white bg-green-500 rounded-md dark:bg-teal-700"
      >
        Export PDF
      </button>
      {sortedExpenses.length === 0 ? (
        <p className="dark:text-white">No transactions available.</p>
      ) : (
        <ul className="dark:text-white dark:bg-gray-900">
          {sortedExpenses.map((expense) => (
            <li
              key={expense._id}
              className="flex items-center justify-between py-2 border-b"
            >
              {editingExpenseId === expense._id ? (
                <>
                  <div className="flex-1 mr-2">
                    <input
                      type="text"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full p-2 border dark:text-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex-1 mr-2">
                    <input
                      type="number"
                      value={editedAmount}
                      min="0"
                      onChange={(e) => setEditedAmount(e.target.value)}
                      className="w-full p-2 border dark:text-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={handleSaveEdit} className="text-green-500">
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 mr-2">
                    <span className="mr-2">{expense.description}</span>
                  </div>
                  <div className="flex-1 mr-2">
                    <span
                      className={`text-${
                        expense.amount >= 0 ? "green" : "red"
                      }-500 `}
                    >
                      ₹{expense.amount}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      <span>{formatDate(expense.date)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditExpense(expense._id)}
                      className="text-blue-500"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-500"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
