import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviando dados do login para o backend
            const response = await axios.post('http://localhost:3001/api/users/login', values);

            if (response.status === 200) {
                // Armazenando o token no localStorage
                localStorage.setItem('token', response.data.token);

                // Redirecionando para a página de perfil (ou outra página)
                navigate('/profile');
            }
        } catch (err) {
            console.log('Erro no login:', err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="shadow-lg px-8 py-5 border w-72">
                <h2 className="text-lg font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full px-3 py-2 border"
                            name="email"
                            value={values.email}
                            onChange={handleChanges}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border"
                            name="password"
                            value={values.password}
                            onChange={handleChanges}
                        />
                    </div>
                    <button className="w-full bg-green-600 text-white py-2">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
