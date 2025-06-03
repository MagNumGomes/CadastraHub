require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/routes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.json());

app.use('/api/users', routes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
