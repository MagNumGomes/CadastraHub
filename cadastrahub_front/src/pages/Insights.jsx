import React, { useState, useEffect } from 'react';
import api from '../api/axios';
// ResponsiveContainer é a chave para a responsividade!!!!!!!!!!!!
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19B2FF'];

const Insights = () => {
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await api.get('/products/all');
                
                const aggregatedData = response.data.reduce((acc, product) => {
                    const existingProduct = acc.find(p => p.type === product.type);
                    if (existingProduct) {
                        existingProduct.quantity += parseFloat(product.quantity_tonelada);
                    } else {
                        acc.push({
                            type: product.type,
                            quantity: parseFloat(product.quantity_tonelada),
                        });
                    }
                    return acc;
                }, []);
                
                setProductData(aggregatedData);
            } catch (error) {
                console.error("Erro ao buscar dados de produtos:", error);
                toast.error("Não foi possível carregar os insights.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Insights de Materiais</h1>
            
            {productData.length === 0 ? (
                 <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Não há dados suficientes para exibir insights.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    
                    {/* Gráfico de Pizza Responsivo */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribuição de Materiais</h2>
                        {/* Definimos uma altura para o contêiner do gráfico */}
                        <div className="w-full h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={productData}
                                        dataKey="quantity"
                                        nameKey="type"
                                        cx="50%" // Centro X em porcentagem
                                        cy="50%" // Centro Y em porcentagem
                                        outerRadius="80%" // Raio em porcentagem
                                        fill="#8884d8"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {productData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toFixed(2)} TON`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico de Barras Responsivo */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quantidade por Material (em Toneladas)</h2>
                        {/* Definimos uma altura para o contêiner do gráfico */}
                        <div className="w-full h-80">
                            <ResponsiveContainer>
                                <BarChart
                                    data={productData}
                                    margin={{ top: 5, right: 20, left: -10, bottom: 20 }} // Ajuste de margem
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    {/* Ajustes no Eixo X para evitar sobreposição de texto */}
                                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} interval={0} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value.toFixed(2)} TON`}/>
                                    <Legend />
                                    <Bar dataKey="quantity" fill="#82ca9d" name="Toneladas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Insights;