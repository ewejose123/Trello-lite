import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    CheckCircle,
    ArrowRight,
    Zap,
    Shield,
    Globe,
    // BarChart3,
    // Clock,
    // Target,
    Database,
    Server,
    Code,
    // Layers,
    // Cpu,
    // Cloud,
    // Lock,
    GitBranch,
    // FileText,
    Settings
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import * as authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { user, accessToken } = await authService.login(loginData);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', accessToken);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            const detailedErrors = err.response?.data?.errors || [];

            if (detailedErrors.length > 0) {
                // Show specific validation errors
                detailedErrors.forEach((error: any) => {
                    toast.error(`${error.field}: ${error.message}`);
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleQuickDemo = () => {
        // Set default demo credentials - password meets requirements: 6+ chars with letters
        setLoginData({ email: 'demo@taskmanager.com', password: 'demo123' });
        setShowLogin(true);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.register(registerData);
            toast.success('Account created successfully! Please sign in.');
            setShowRegister(false);
            setShowLogin(true);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            const detailedErrors = err.response?.data?.errors || [];

            if (detailedErrors.length > 0) {
                // Show specific validation errors
                detailedErrors.forEach((error: any) => {
                    toast.error(`${error.field}: ${error.message}`);
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Create teams, invite members, and work together seamlessly'
        },
        {
            icon: Calendar,
            title: 'Project Management',
            description: 'Organize projects with clear timelines and milestones'
        },
        {
            icon: CheckCircle,
            title: 'Task Tracking',
            description: 'Track progress with customizable task statuses'
        },
        {
            icon: Zap,
            title: 'Real-time Updates',
            description: 'Get instant notifications and live collaboration'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your data is protected with enterprise-grade security'
        },
        {
            icon: Globe,
            title: 'Access Anywhere',
            description: 'Work from any device, anywhere in the world'
        }
    ];

    const architectureLayers = [
        { icon: Code, value: 'Frontend', label: 'React + TypeScript', color: 'text-blue-400' },
        { icon: Server, value: 'Backend', label: 'Node.js + Express', color: 'text-green-400' },
        { icon: Database, value: 'Database', label: 'PostgreSQL + Prisma', color: 'text-purple-400' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Navigation */}
            <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">TaskManager Pro</span>
                        </motion.div>
                        <div className="flex space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => setShowLogin(true)}
                                className="text-gray-300 hover:text-white"
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => setShowRegister(true)}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    >
                        Manage Tasks Like a Pro
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
                    >
                        A <span className="text-blue-400 font-semibold">full-stack web application</span> demonstrating modern development practices.
                        Built with React, Node.js, PostgreSQL, and Prisma - featuring team collaboration, project management, and real-time task tracking.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            size="lg"
                            onClick={() => setShowRegister(true)}
                            className="text-lg px-8 py-4"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowLogin(true)}
                            className="text-lg px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            View Demo
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleQuickDemo}
                            className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white"
                        >
                            Quick Demo Login
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Architecture Overview Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
                    >
                        Modern Architecture
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {architectureLayers.map((layer, index) => (
                            <motion.div
                                key={layer.value}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <layer.icon className={`w-16 h-16 ${layer.color} mx-auto mb-4`} />
                                <div className="text-2xl font-bold text-white mb-2">{layer.value}</div>
                                <div className="text-gray-400 text-lg">{layer.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Data Flow Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
                    >
                        Data Flow & Connections
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <Card className="p-8 bg-gray-900/50 border-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* User Interaction */}
                                <div className="text-center">
                                    <div className="bg-blue-600/20 rounded-2xl p-6 border border-blue-500/30 mb-4">
                                        <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-3">User Interaction</h3>
                                        <div className="space-y-2 text-gray-300 text-sm">
                                            <div>React Components</div>
                                            <div>Form Validation</div>
                                            <div>State Management</div>
                                            <div>Real-time Updates</div>
                                        </div>
                                    </div>
                                </div>

                                {/* API Communication */}
                                <div className="text-center">
                                    <div className="bg-green-600/20 rounded-2xl p-6 border border-green-500/30 mb-4">
                                        <GitBranch className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-3">API Layer</h3>
                                        <div className="space-y-2 text-gray-300 text-sm">
                                            <div>RESTful Endpoints</div>
                                            <div>JWT Authentication</div>
                                            <div>Request Validation</div>
                                            <div>Error Handling</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Persistence */}
                                <div className="text-center">
                                    <div className="bg-purple-600/20 rounded-2xl p-6 border border-purple-500/30 mb-4">
                                        <Database className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-3">Data Storage</h3>
                                        <div className="space-y-2 text-gray-300 text-sm">
                                            <div>PostgreSQL Database</div>
                                            <div>Prisma ORM</div>
                                            <div>Type-safe Queries</div>
                                            <div>Data Relationships</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Technology Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-bold text-center mb-8 text-white">Complete Technology Stack</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Frontend Technologies */}
                            <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/20">
                                <div className="flex items-center mb-4">
                                    <Code className="w-8 h-8 text-blue-400 mr-3" />
                                    <h4 className="text-xl font-bold text-white">Frontend</h4>
                                </div>
                                <div className="space-y-2 text-gray-300 text-sm">
                                    <div>• React 18 + TypeScript</div>
                                    <div>• Vite (Build Tool)</div>
                                    <div>• Tailwind CSS</div>
                                    <div>• Framer Motion</div>
                                    <div>• React Router v6</div>
                                    <div>• Axios (HTTP Client)</div>
                                    <div>• Context API (State)</div>
                                </div>
                            </div>

                            {/* Backend Technologies */}
                            <div className="bg-green-600/10 rounded-xl p-6 border border-green-500/20">
                                <div className="flex items-center mb-4">
                                    <Server className="w-8 h-8 text-green-400 mr-3" />
                                    <h4 className="text-xl font-bold text-white">Backend</h4>
                                </div>
                                <div className="space-y-2 text-gray-300 text-sm">
                                    <div>• Node.js + Express</div>
                                    <div>• TypeScript</div>
                                    <div>• Prisma ORM</div>
                                    <div>• JWT Authentication</div>
                                    <div>• bcrypt (Hashing)</div>
                                    <div>• express-validator</div>
                                    <div>• CORS + Helmet</div>
                                </div>
                            </div>

                            {/* Database Technologies */}
                            <div className="bg-purple-600/10 rounded-xl p-6 border border-purple-500/20">
                                <div className="flex items-center mb-4">
                                    <Database className="w-8 h-8 text-purple-400 mr-3" />
                                    <h4 className="text-xl font-bold text-white">Database</h4>
                                </div>
                                <div className="space-y-2 text-gray-300 text-sm">
                                    <div>• PostgreSQL</div>
                                    <div>• Prisma Client</div>
                                    <div>• Database Migrations</div>
                                    <div>• Type-safe Queries</div>
                                    <div>• Connection Pooling</div>
                                    <div>• Docker Support</div>
                                    <div>• Supabase Ready</div>
                                </div>
                            </div>

                            {/* Infrastructure */}
                            <div className="bg-pink-600/10 rounded-xl p-6 border border-pink-500/20">
                                <div className="flex items-center mb-4">
                                    <Settings className="w-8 h-8 text-pink-400 mr-3" />
                                    <h4 className="text-xl font-bold text-white">Infrastructure</h4>
                                </div>
                                <div className="space-y-2 text-gray-300 text-sm">
                                    <div>• Docker + Compose</div>
                                    <div>• Environment Variables</div>
                                    <div>• Health Checks</div>
                                    <div>• File Uploads (Supabase)</div>
                                    <div>• Production Ready</div>
                                    <div>• CI/CD Ready</div>
                                    <div>• Scalable Architecture</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Architecture Diagram Section */}
            <section className="py-20 px-6 bg-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
                    >
                        System Architecture
                    </motion.h2>

                    {/* Architecture Flow Diagram */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <Card className="p-8 bg-gray-900/50 border-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Frontend Layer */}
                                <div className="text-center">
                                    <div className="bg-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
                                        <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-3">Frontend Layer</h3>
                                        <div className="space-y-2 text-gray-300 text-sm">
                                            <div>React 18 + TypeScript</div>
                                            <div>Vite + Tailwind CSS</div>
                                            <div>Framer Motion</div>
                                            <div>React Router v6</div>
                                            <div>Axios + Context API</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Backend Layer */}
                                <div className="text-center">
                                    <div className="bg-green-600/20 rounded-2xl p-6 border border-green-500/30">
                                        <Server className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-3">Backend Layer</h3>
                                        <div className="space-y-2 text-gray-300 text-sm">
                                            <div>Node.js + Express</div>
                                            <div>TypeScript + Prisma</div>
                                            <div>JWT Authentication</div>
                                            <div>RESTful API</div>
                                            <div>File Upload Support</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Database Layer */}
                                <div className="text-center">
                                    <div className="bg-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
                                        <Database className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-3">Database Layer</h3>
                                        <div className="space-y-2 text-gray-300 text-sm">
                                            <div>PostgreSQL</div>
                                            <div>Prisma ORM</div>
                                            <div>Database Migrations</div>
                                            <div>Type-safe Queries</div>
                                            <div>Docker Ready</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Database Schema Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-bold text-center mb-8 text-white">Database Schema</h3>
                        <Card className="p-8 bg-gray-900/50 border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Users Table */}
                                <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                                    <div className="flex items-center mb-3">
                                        <Users className="w-6 h-6 text-blue-400 mr-2" />
                                        <h4 className="font-bold text-white">Users</h4>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        <div>• id (UUID)</div>
                                        <div>• email (String)</div>
                                        <div>• password (String)</div>
                                        <div>• name (String)</div>
                                        <div>• createdAt (DateTime)</div>
                                    </div>
                                </div>

                                {/* Teams Table */}
                                <div className="bg-green-600/10 rounded-xl p-4 border border-green-500/20">
                                    <div className="flex items-center mb-3">
                                        <Users className="w-6 h-6 text-green-400 mr-2" />
                                        <h4 className="font-bold text-white">Teams</h4>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        <div>• id (UUID)</div>
                                        <div>• name (String)</div>
                                        <div>• description (String)</div>
                                        <div>• createdAt (DateTime)</div>
                                        <div>• updatedAt (DateTime)</div>
                                    </div>
                                </div>

                                {/* Projects Table */}
                                <div className="bg-purple-600/10 rounded-xl p-4 border border-purple-500/20">
                                    <div className="flex items-center mb-3">
                                        <Calendar className="w-6 h-6 text-purple-400 mr-2" />
                                        <h4 className="font-bold text-white">Projects</h4>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        <div>• id (UUID)</div>
                                        <div>• name (String)</div>
                                        <div>• description (String)</div>
                                        <div>• teamId (UUID)</div>
                                        <div>• createdAt (DateTime)</div>
                                    </div>
                                </div>

                                {/* Tasks Table */}
                                <div className="bg-pink-600/10 rounded-xl p-4 border border-pink-500/20">
                                    <div className="flex items-center mb-3">
                                        <CheckCircle className="w-6 h-6 text-pink-400 mr-2" />
                                        <h4 className="font-bold text-white">Tasks</h4>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-300">
                                        <div>• id (UUID)</div>
                                        <div>• title (String)</div>
                                        <div>• description (String)</div>
                                        <div>• projectId (UUID)</div>
                                        <div>• status (Enum)</div>
                                        <div>• priority (Enum)</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center mb-16"
                    >
                        Key Features
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="p-8 h-full bg-gray-800/50 border-gray-700 hover:border-gray-600">
                                    <feature.icon className="w-12 h-12 text-blue-400 mb-6" />
                                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Ready to Transform Your Workflow?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-gray-300 mb-8"
                    >
                        Experience a full-stack application built with modern technologies and best practices.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button
                            size="lg"
                            onClick={() => setShowRegister(true)}
                            className="text-lg px-8 py-4"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Auth Forms */}
            {(showLogin || showRegister) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => {
                        setShowLogin(false);
                        setShowRegister(false);
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md"
                    >
                        <Card className="p-8 bg-gray-800 border-gray-700">
                            {showLogin ? (
                                <div>
                                    <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            required
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                        <Input
                                            label="Password"
                                            type="password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                        <Button
                                            type="submit"
                                            loading={loading}
                                            className="w-full"
                                            size="lg"
                                        >
                                            Sign In
                                        </Button>
                                    </form>
                                    <p className="text-center mt-4 text-gray-400">
                                        Don't have an account?{' '}
                                        <button
                                            onClick={() => {
                                                setShowLogin(false);
                                                setShowRegister(true);
                                            }}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
                                    <form onSubmit={handleRegister} className="space-y-6">
                                        <Input
                                            label="Full Name"
                                            type="text"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            required
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            required
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                        <Input
                                            label="Password"
                                            type="password"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            required
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                        <Button
                                            type="submit"
                                            loading={loading}
                                            className="w-full"
                                            size="lg"
                                        >
                                            Create Account
                                        </Button>
                                    </form>
                                    <p className="text-center mt-4 text-gray-400">
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => {
                                                setShowRegister(false);
                                                setShowLogin(true);
                                            }}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default LandingPage;
