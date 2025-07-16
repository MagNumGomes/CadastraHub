const prisma = require('../dbConnector');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const axios = require('axios');

// --- Funções de Usuário Comum ---

// Criar um novo usuário (Registro Público)
const createUser = async (req, res) => {
  const { name, email, password, cpfCnpj, address, phone, category } = req.body;
  if (!name || !email || !password || !cpfCnpj || !category) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }
  try {
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { cpfCnpj }] } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email ou CPF/CNPJ já cadastrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, cpfCnpj, address, phone, category, role: 'USER' },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Usuário criado com sucesso', user: userWithoutPassword });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Falha ao criar usuário.' });
  }
};

// Login de Usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login realizado com sucesso', token, user: userWithoutPassword });
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
      select: { id: true, name: true, email: true, role: true, category: true, phone: true, address: true, createdAt: true },
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

// Atualizar o próprio perfil
const updateProfile = async (req, res) => {
  const { id } = req.user;
  const { name, email, phone, address } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, phone, address },
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ message: 'Perfil atualizado com sucesso', user: userWithoutPassword });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: 'Falha ao atualizar perfil.' });
  }
};

// --- Funções Utilitárias ---

// Buscar Endereço por CEP
const getAddressByCep = async (req, res) => {
  const { cep } = req.params;
  const cleanedCep = cep.replace(/\D/g, '');
  if (cleanedCep.length !== 8) {
    return res.status(400).json({ error: 'CEP inválido. Deve conter 8 dígitos.' });
  }
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado.' });
    }
    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    res.status(500).json({ error: 'Falha ao consultar o serviço de CEP.' });
  }
};

// --- Funções de Administrador ---

// Obter todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, category: true, role: true, createdAt: true, updatedAt: true },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Falha ao buscar usuários.' });
  }
};

// Obter usuário por ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, category: true, role: true, address: true, phone: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar usuário.' });
  }
};

// Atualizar qualquer usuário
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

// Deletar qualquer usuário
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao deletar usuário.' });
  }
};

// Criar um novo Admin
const createAdmin = async (req, res) => {
  const { name, email, password, cpfCnpj, address, phone, category } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.user.create({
      data: { name, email, password: hashedPassword, cpfCnpj, address, phone, category, role: 'ADMIN' }
    });
    const { password: _, ...userWithoutPassword } = newAdmin;
    res.status(201).json({ message: 'Admin criado com sucesso', user: userWithoutPassword });
  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ error: 'Falha ao criar admin' });
  }
};

// Buscar usuários
const searchUsers = async (req, res) => {
  const { q = '', category } = req.query;
  try {
    const filters = {
      where: {
        OR: [{ name: { contains: q } }, { email: { contains: q } }],
      },
      select: { id: true, name: true, email: true, cpfCnpj: true, address: true, phone: true, category: true, role: true }
    };
    if (category && category !== 'all') {
      filters.where.category = category;
    }
    const users = await prisma.user.findMany(filters);
    res.json(users);
  } catch (error) {
    console.error('Erro na busca de usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};

// Obter estatísticas para o Dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [clientCount, supplierCount] = await Promise.all([
      prisma.user.count({ where: { category: 'customer' } }),
      prisma.user.count({ where: { category: 'supplier' } })
    ]);
    const now = new Date();
    const sixMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 6));
    const oneYearAgo = new Date(new Date().setFullYear(now.getFullYear() - 1));
    const twoYearsAgo = new Date(new Date().setFullYear(now.getFullYear() - 2));
    const fiveYearsAgo = new Date(new Date().setFullYear(now.getFullYear() - 5));
    const selectFields = { id: true, name: true, email: true, updatedAt: true };
    const [inactive6m, inactive1y, inactive2y, inactive5y] = await Promise.all([
      prisma.user.findMany({ where: { updatedAt: { lt: sixMonthsAgo } }, select: selectFields }),
      prisma.user.findMany({ where: { updatedAt: { lt: oneYearAgo } }, select: selectFields }),
      prisma.user.findMany({ where: { updatedAt: { lt: twoYearsAgo } }, select: selectFields }),
      prisma.user.findMany({ where: { updatedAt: { lt: fiveYearsAgo } }, select: selectFields }),
    ]);
    res.json({
      stats: { clients: clientCount, suppliers: supplierCount },
      inactiveUsers: { '6m': inactive6m, '1y': inactive1y, '2y': inactive2y, '5y': inactive5y }
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Falha ao buscar estatísticas do dashboard.' });
  }
};

const exportUsersToExcel = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, cpfCnpj: true, phone: true, address: true, category: true, role: true, createdAt: true,
      },
      orderBy: { name: 'asc' }
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuários CadastraHub');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nome', key: 'name', width: 35 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'CPF/CNPJ', key: 'cpfCnpj', width: 20 },
      { header: 'Telefone', key: 'phone', width: 20 },
      { header: 'Endereço', key: 'address', width: 45 },
      { header: 'Categoria', key: 'category', width: 15 },
      { header: 'Permissão', key: 'role', width: 15 },
      { header: 'Data de Cadastro', key: 'createdAt', width: 20 },
    ];
    worksheet.getRow(1).font = { bold: true };
    users.forEach(user => {
      worksheet.addRow({ ...user, createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR') });
    });
    const date = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="usuarios_cadastrahub_${date}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error);
    res.status(500).json({ message: 'Falha ao gerar o arquivo Excel.' });
  }
};

// Exporta todas as funções
module.exports = {
  createUser,
  loginUser,
  getProfile,
  updateProfile,
  getAddressByCep,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  searchUsers,
  getDashboardStats,
  exportUsersToExcel,
};