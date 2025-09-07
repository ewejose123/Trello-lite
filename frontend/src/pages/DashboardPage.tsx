import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import * as teamService from '../services/team.service';
import type { Team } from '../types';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState<{ totalProjects: number; totalTasks: number }>({ totalProjects: 0, totalTasks: 0 });
    const [newTeamName, setNewTeamName] = useState<string>('');
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [creating, setCreating] = useState<boolean>(false);

    useEffect(() => {
        fetchTeamsAndStats();
    }, []);

    const fetchTeamsAndStats = async () => {
        try {
            const [userTeams, teamStats] = await Promise.all([
                teamService.getTeams(),
                teamService.getTeamStats()
            ]);
            setTeams(userTeams);
            setStats(teamStats);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        setCreating(true);
        try {
            await teamService.createTeam(newTeamName);
            setNewTeamName('');
            setShowCreateForm(false);
            toast.success('Team created successfully!');
            fetchTeamsAndStats(); // Refresh the list
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to create team');
        } finally {
            setCreating(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: 'easeOut' as const,
            },
        },
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Navigation Header */}
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
                                onClick={() => navigate('/')}
                                className="text-gray-300 hover:text-white"
                            >
                                ← Back to Landing
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                }}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Welcome back, {user?.name}! 👋
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Manage your teams and projects efficiently
                        </p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="p-10 text-center transform hover:scale-105 transition-transform duration-200 bg-gray-800/50 border-gray-700">
                            <Users className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                            <h3 className="text-4xl font-bold text-white mb-3">{teams.length}</h3>
                            <p className="text-gray-300 font-medium text-lg">Teams</p>
                        </Card>
                        <Card className="p-10 text-center transform hover:scale-105 transition-transform duration-200 bg-gray-800/50 border-gray-700">
                            <Calendar className="w-16 h-16 text-green-400 mx-auto mb-6" />
                            <h3 className="text-4xl font-bold text-white mb-3">{stats.totalProjects}</h3>
                            <p className="text-gray-300 font-medium text-lg">Projects</p>
                        </Card>
                        <Card className="p-10 text-center transform hover:scale-105 transition-transform duration-200 bg-gray-800/50 border-gray-700">
                            <ArrowRight className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                            <h3 className="text-4xl font-bold text-white mb-3">{stats.totalTasks}</h3>
                            <p className="text-gray-300 font-medium text-lg">Tasks</p>
                        </Card>
                    </motion.div>

                    {/* Teams Section */}
                    <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
                        <Card className="p-10 bg-gray-800/50 border-gray-700">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-3">Your Teams</h2>
                                    <p className="text-xl text-gray-300">Collaborate with your team members</p>
                                </div>
                                <Button
                                    onClick={() => setShowCreateForm(!showCreateForm)}
                                    variant={showCreateForm ? 'outline' : 'primary'}
                                    size="lg"
                                >
                                    <Plus className="w-6 h-6 mr-3" />
                                    {showCreateForm ? 'Cancel' : 'Create Team'}
                                </Button>
                            </div>

                            <AnimatePresence>
                                {showCreateForm && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onSubmit={handleCreateTeam}
                                        className="mb-10 p-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl border border-gray-600"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <Input
                                                value={newTeamName}
                                                onChange={(e) => setNewTeamName(e.target.value)}
                                                placeholder="Enter team name"
                                                className="flex-1 bg-gray-600 border-gray-500 text-white placeholder-gray-300"
                                            />
                                            <Button
                                                type="submit"
                                                loading={creating}
                                                disabled={!newTeamName.trim()}
                                                size="lg"
                                            >
                                                Create Team
                                            </Button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                <AnimatePresence>
                                    {teams.length > 0 ? (
                                        teams.map((team, index) => (
                                            <motion.div
                                                key={team.id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Card
                                                    hover
                                                    onClick={() => { }}
                                                    className="p-8 h-full transform hover:scale-105 transition-transform duration-200 bg-gray-700/50 border-gray-600 hover:border-gray-500"
                                                >
                                                    <Link to={`/team/${team.id}`} className="block h-full">
                                                        <div className="flex items-start justify-between mb-6">
                                                            <h3 className="font-bold text-2xl text-white">
                                                                {team.name}
                                                            </h3>
                                                            <Users className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-300 mb-6 text-lg">
                                                            {team._count?.projects || 0} projects
                                                        </p>
                                                        <div className="flex items-center text-base text-gray-400">
                                                            <Calendar className="w-5 h-5 mr-3" />
                                                            Created {new Date(team.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </Link>
                                                </Card>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            variants={itemVariants}
                                            className="col-span-full text-center py-20"
                                        >
                                            <Users className="w-24 h-24 text-gray-500 mx-auto mb-8" />
                                            <h3 className="text-3xl font-bold text-white mb-4">
                                                No teams yet
                                            </h3>
                                            <p className="text-gray-300 mb-8 text-xl">
                                                Create your first team to get started
                                            </p>
                                            <Button
                                                onClick={() => setShowCreateForm(true)}
                                                variant="outline"
                                                size="lg"
                                            >
                                                <Plus className="w-6 h-6 mr-3" />
                                                Create Your First Team
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardPage;
