// TransactionForm.js
import React, { useState } from "react";
import axios from "axios";

const TransactionForm = ({ onAddExpense }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      // You can show an alert or set an error state
      console.error("Both description and amount are required.");
      return;
    }

    try {
      const response = await axios.post(
        "https://expense-tracker-backend-9fni.onrender.com/addExpense",
        {
          description,
          amount: parseFloat(amount),
          transactionDate: new Date().toISOString(), // Include transactionDate
        }
      );

      console.log("Expense added:", response.data);

      // Clear form fields after successful submission
      setDescription("");
      setAmount("");

      // Trigger the parent component to add the new expense to the list
      onAddExpense(response.data);
    } catch (error) {
      console.error("Error adding expense:", error.message);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto my-8 bg-white rounded-md shadow-lg dark:bg-gray-900">
      <h2 className="mb-4 text-2xl font-bold dark:text-teal-300">
        Add Expense
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4 dark:text-teal-200">
          Description:
          <input
            className="w-full p-2 mt-2 border dark:text-white dark:bg-gray-700"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block mb-4 dark:text-teal-200">
          Amount:
          <input
            className="w-full p-2 border dark:text-white dark:bg-gray-700"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md dark:bg-teal-700"
          type="submit"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
