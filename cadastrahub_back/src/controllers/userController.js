const prisma = require('../dbConnector');

// Create a new user (C)
const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    cpfCnpj,
    address,
    phone,
    material,
    category
  } = req.body;

  try {
    // Creating a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        cpfCnpj,
        address,
        phone,
        material,
        category
      }
    });

    // Responding with the created user
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};


// Get all users (R) - using Prisma
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Fetch all users from the database
    res.json({
      message: 'Users retrieved successfully',
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// Update an existing user (U)
const updateUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL parameter
  
  const {
    name,
    email,
    password,
    cpfCnpj,
    address,
    phone,
    material,
    category
  } = req.body;

  try {
    // Check if the user exists by ID
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's data
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        password,
        cpfCnpj,
        address,
        phone,
        material,
        category
      },
    });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user by ID (D)
const deleteUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL parameter

  try {
    // Check if the user exists by ID
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};
