import Transaction from '../models/Transaction.js';

// Create a new transaction
export const addTransaction = async (req, res) => {
  try {
    const { type, amount, description, date } = req.body; // Extract fields from request body
    const auth = req.auth(); // Get auth data from request (middleware must provide this)
    const userId = auth.userId; // Extract userId from auth data

    // If no userId (unauthenticated), return 401 Unauthorized
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID' });
    }

    // Validate required fields: type and amount
    if (!type || !amount) {
      return res.status(400).json({ message: 'Type and amount are required' });
    }

    // Create a new transaction document
    const transaction = new Transaction({
      userId,
      type,
      amount,
      description,
      // Validate date; if invalid or missing, use current date
      date: (date && new Date(date).getTime()) ? new Date(date) : new Date(),
    });

    // Save the transaction to the database
    await transaction.save();

    // Return the saved transaction with status 201 Created
    return res.status(201).json(transaction);
  } catch (error) {
    console.error('Add transaction error:', error);
    // On error, return 500 Internal Server Error
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Retrieve all transactions for the authenticated user
export const getTransactions = async (req, res) => {
  try {
    const authData = req.auth(); // Get auth info from request
    const userId = authData.userId;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID' });
    }

    // Query transactions belonging to this user, sorted by date descending
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    // Return the list of transactions
    return res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a transaction by its ID, only if it belongs to the authenticated user
export const deleteTransaction = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData?.userId;

    // Check authentication
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const transactionId = req.params.id; // Get transaction ID from URL params

    // Find transaction by ID and userId to ensure user owns it
    const transaction = await Transaction.findOne({ _id: transactionId, userId });

    // If not found, return 404 Not Found
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Delete the transaction document
    await Transaction.deleteOne({ _id: transactionId, userId });

    // Respond with success message
    return res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
