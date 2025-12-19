import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import toast from 'react-hot-toast';
import { FiMap, FiMapPin, FiGrid, FiLayers, FiUsers, FiUserCheck } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await adminAPI.getEstadisticas();
            setStats(response.data.data);
        } catch (error) {
            toast.error('Error cargando estadísticas');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Provincias',
            value: stats?.total_provincias || 0,
            icon: FiMap,
            color: 'bg-blue-500',
            link: '/admin/provincias'
        },
        {
            label: 'Municipios',
            value: stats?.total_municipios || 0,
            icon: FiMapPin,
            color: 'bg-green-500',
            link: '/admin/municipios'
        },
        {
            label: 'Policlínicos',
            value: stats?.total_policlinicos || 0,
            icon: FiGrid,
            color: 'bg-purple-500',
            link: '/admin/policlinicos'
        },
        {
            label: 'Consultorios',
            value: stats?.total_consultorios || 0,
            icon: FiLayers,
            color: 'bg-orange-500',
            link: '/admin/consultorios'
        },
        {
            label: 'Médicos',
            value: stats?.total_medicos || 0,
            icon: FiUserCheck,
            color: 'bg-teal-500',
            link: null
        },
        {
            label: 'Pacientes',
            value: stats?.total_pacientes || 0,
            icon: FiUsers,
            color: 'bg-pink-500',
            link: null
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <AdminNavbar />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard de Administración</h1>
                    <p className="mt-2 text-gray-600">Gestiona las ubicaciones del sistema de consultorios médicos</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        const Card = stat.link ? Link : 'div';
                        return (
                            <Card
                                key={index}
                                to={stat.link}
                                className={`bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 ${stat.link ? 'hover:shadow-xl transition cursor-pointer' : ''
                                    }`}
                            >
                                <div className={`p-4 rounded-lg ${stat.color}`}>
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            to="/admin/provincias"
                            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
                        >
                            <FiMap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Gestionar Provincias</span>
                        </Link>
                        <Link
                            to="/admin/municipios"
                            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
                        >
                            <FiMapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Gestionar Municipios</span>
                        </Link>
                        <Link
                            to="/admin/policlinicos"
                            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
                        >
                            <FiGrid className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Gestionar Policlínicos</span>
                        </Link>
                        <Link
                            to="/admin/consultorios"
                            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-center"
                        >
                            <FiLayers className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Gestionar Consultorios</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;