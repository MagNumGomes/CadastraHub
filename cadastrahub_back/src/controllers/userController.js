const prisma = require('../dbConnector');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new user (C)
const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    cpfCnpj,
    address,
    phone,
    products,
    category
  } = req.body;

  try {

    // Verificar se o telefone já existe
    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    });
  
    if (existingPhone) {
      return res.status(409).json({ error: 'Phone already exists' }); // 409 Conflict
    }

    // Verificar se o telefone é valido
    if (phone.length !== 11) {
      return res.status(400).json({ error: 'Invalid phone' }); // 400 Bad Request
    }

    // Verificar se o CPF/CNPJ já existe
    const existingCpfCnpj = await prisma.user.findUnique({
      where: { cpfCnpj }
    });
  
    if (existingCpfCnpj) {
      return res.status(409).json({ error: 'CPF/CNPJ already exists' }); // 409 Conflict
    }
    
    // Verificar se o CPF/CNPJ é valido
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      return res.status(400).json({ error: 'Invalid CPF/CNPJ' }); // 400 Bad Request
    }
    
    // Verificar se o email é valido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email' }); // 400 Bad Request
    }

    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cpfCnpj,
        address,
        phone,
        products: {
          create: products
        },
        category
      }
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true // 👈 necessário para validar o login
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Compara a senha com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retorna token + dados essenciais do usuário para frontend (incluindo role)
    res.json({ 
      message: 'Login realizado com sucesso', 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};


// Get all users (R)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await prisma.user.count();
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cpfCnpj: true,
        phone: true,
        address: true,
      }
    });

    res.json({
      message: 'Users retrieved successfully',
      users,
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};


const getProfile = async (req, res) => {
  try {
      const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

      if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ user });
  } catch (err) {
      console.error('Profile Error:', err);
      res.status(500).json({ error: 'Erro ao carregar perfil' });
  }
};


// Update an existing user (U)
const updateUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL parameter
  
  let {
    name,
    email,
    password,
    cpfCnpj,
    address,
    phone,
    products,
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

    // Se senha foi passada, criptografar
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
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
        products: {
          create: products  // array de produtos com { name, type, quantity_tonelada }
        },
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

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { products: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

// Criar um admin
const createAdmin = async (req, res) => {
  const {
    name,
    email,
    password,
    cpfCnpj,
    address,
    phone,
    category
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cpfCnpj,
        address,
        phone,
        category,
        role: 'ADMIN'
      }
    });

    res.status(201).json({ message: 'Admin criado com sucesso', user: newAdmin });
  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ error: 'Falha ao criar admin' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getProfile,
  updateUser,
  deleteUser,
  loginUser,
  getUserById,
  createAdmin,
};
