import dotenv from 'dotenv';
// Load environment variables from .env file into process.env
dotenv.config();

import { Clerk } from '@clerk/clerk-sdk-node'; 
import User from '../models/User.js';

// Initialize Clerk SDK client with the secret key from environment variables
const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// ------- REGISTER CONTROLLER ------------
// This controller handles user registration
export const registerUser = async (req, res) => {
  // Extract user details from the request body
  const { fullName, email, password } = req.body;

  try {
    // Create a new user in Clerk authentication service
    // Split fullName into first and last name (basic split on space)
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email], // Clerk expects an array of email addresses
      firstName: fullName?.split(' ')[0] || '', // Take first word as firstName
      lastName: fullName?.split(' ').slice(1).join(' ') || '', // Rest as lastName
      password: password, // Password as provided
    });

    // After successful creation in Clerk, check if the user already exists in MongoDB
    // by searching for the Clerk user ID (clerkId)
    const existing = await User.findOne({ clerkId: clerkUser.id });
    if (existing) {
      // If user already exists in MongoDB, return 400 Bad Request
      return res.status(400).json({ message: 'User already exists in MongoDB' });
    }

    // Create new user document to store in MongoDB
    const newUser = new User({
      clerkId: clerkUser.id, // Store Clerk user ID to link accounts
      fullName,
      email,
      createdAt: new Date(), // Timestamp for record creation
    });

    // Save the new user in MongoDB
    await newUser.save();

    // Respond with success message and the Clerk user ID
    res.status(201).json({
      message: 'User created in Clerk and saved to MongoDB',
      clerkId: clerkUser.id,
    });
  } catch (err) {
    // Log errors for debugging
    console.error('Register Error:', err);

    // Return 500 Internal Server Error and error message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
