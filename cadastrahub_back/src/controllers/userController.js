const prisma = require('../dbConnector');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Criar um novo usuário
const createUser = async (req, res) => {
  const { name, email, password, cpfCnpj, address, phone, category } = req.body;

  if (!name || !email || !password || !cpfCnpj || !category) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { cpfCnpj }] },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email ou CPF/CNPJ já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name, email, password: hashedPassword, cpfCnpj, address, phone, category, role: 'USER',
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Usuário criado com sucesso', user: userWithoutPassword });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Falha ao criar usuário.' });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Erro interno ao fazer login.' });
  }
};

// Obter Perfil do Usuário Logado
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true, category: true, phone: true, address: true, createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Erro ao carregar perfil.' });
  }
};

// Obter todos os usuários (para Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, category: true, role: true, createdAt: true, updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Falha ao buscar usuários.' });
  }
};

// Obter usuário por ID (para Admin)
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true, name: true, email: true, category: true, role: true, address: true, phone: true, createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar usuário.' });
  }
};

// Atualizar usuário (para Admin)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, category, role, address, phone } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, category, role, address, phone },
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ message: 'Usuário atualizado com sucesso', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao atualizar usuário.' });
  }
};

// Deletar usuário (para Admin)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao deletar usuário.' });
  }
};

// CRIAR UM ADMIN (FUNÇÃO ADICIONADA)
const createAdmin = async (req, res) => {
  const { name, email, password, cpfCnpj, address, phone, category } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.user.create({
      data: {
        name, email, password: hashedPassword, cpfCnpj, address, phone, category,
        role: 'ADMIN' // A única diferença é esta linha
      }
    });
    res.status(201).json({ message: 'Admin criado com sucesso', user: newAdmin });
  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ error: 'Falha ao criar admin' });
  }
};

// Exporta todas as funções, incluindo a nova createAdmin
module.exports = {
  createUser,
  loginUser,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin, // Adicionado
};