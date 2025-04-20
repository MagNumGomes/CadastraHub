// src/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3001/api/users', formData)
      navigate('/login')
    } catch (err) {
      console.error(err.response?.data?.message || 'Erro ao registrar')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
    <form onSubmit={handleSubmit} className="w-72 p-4 border shadow">
      <h2 className="text-xl mb-4 font-bold">Register</h2>
      
      <input name="name" type="text" placeholder="Nome" className="border w-full p-2 mb-2" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" className="border w-full p-2 mb-2" onChange={handleChange} />
      <input name="password" type="password" placeholder="Senha" className="border w-full p-2 mb-2" onChange={handleChange} />
      <input name="cpfCnpj" type="text" placeholder="CPF/CNPJ" className="border w-full p-2 mb-2" onChange={handleChange} />
      <input name="address" type="text" placeholder="Endereço" className="border w-full p-2 mb-2" onChange={handleChange} />
      <input name="phone" type="text" placeholder="Telefone" className="border w-full p-2 mb-2" onChange={handleChange} />
  
      <select name="material" className="border w-full p-2 mb-2" onChange={handleChange}>
        <option value="">Selecione o tipo de material</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
  
      <select name="category" className="border w-full p-2 mb-4" onChange={handleChange}>
        <option value="">Selecione a categoria</option>
        <option value="customer">Cliente</option>
        <option value="supplier">Fornecedor</option>
      </select>
  
      <button className="bg-blue-600 text-white w-full py-2">Registrar</button>
      <p className="text-center mt-2 text-sm">
        Já tem conta? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </form>
  </div>
  
  )
}


export default Register
