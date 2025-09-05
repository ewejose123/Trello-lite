import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import type { Team } from '../types';
import * as projectService from '../services/project.service';
import * as teamService from '../services/team.service';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import toast from 'react-hot-toast';

interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

const TeamPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const [team, setTeam] = useState<Team | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newProjectName, setNewProjectName] = useState<string>('');
    const [newProjectDescription, setNewProjectDescription] = useState<string>('');
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

    const fetchTeamData = useCallback(async () => {
        try {
            // Fetch real team data from API
            const teamData = await teamService.getTeamById(teamId!);
            setTeam(teamData);

            // Fetch real projects from API
            const realProjects = await projectService.getProjectsByTeam(teamId!);
            setProjects(realProjects);
        } catch (err) {
            console.error('Error fetching team data:', err);
            setError('Failed to fetch team data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        if (teamId) {
            fetchTeamData();
        }
    }, [teamId, fetchTeamData]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        try {
            // Try to create project via API
            const newProject = await projectService.createProject(
                newProjectName,
                newProjectDescription,
                teamId!
            );
            setProjects([...projects, newProject]);
            setNewProjectName('');
            setNewProjectDescription('');
            setShowCreateForm(false);
            toast.success('Project created successfully!');
        } catch (err: unknown) {
            console.error('Project creation error:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to create project');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-red-400 text-xl">{error}</div>
        </div>
    );

    if (!team) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-white text-xl">Team not found</div>
        </div>
    );

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
                                onClick={() => window.location.href = '/dashboard'}
                                className="text-gray-300 hover:text-white"
                            >
                                ← Back to Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('token');
                                    window.location.href = '/';
                                }}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">{team.name}</h1>
                    <p className="text-gray-300 text-lg">Manage your team's projects and tasks</p>
                </div>

                <Card className="p-8 bg-gray-800/50 border-gray-700">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Projects</h2>
                        <Button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            variant={showCreateForm ? 'outline' : 'primary'}
                            size="lg"
                        >
                            <Plus className="w-6 h-6 mr-3" />
                            {showCreateForm ? 'Cancel' : 'Create Project'}
                        </Button>
                    </div>

                    {showCreateForm && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleCreateProject}
                            className="mb-8 p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl border border-gray-600"
                        >
                            <div className="space-y-4">
                                <Input
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="Project name"
                                    className="bg-gray-700 border-gray-600 text-white"
                                    required
                                />
                                <textarea
                                    value={newProjectDescription}
                                    onChange={(e) => setNewProjectDescription(e.target.value)}
                                    placeholder="Project description (optional)"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                                <Button
                                    type="submit"
                                    disabled={!newProjectName.trim()}
                                    size="lg"
                                    className="w-full"
                                >
                                    Create Project
                                </Button>
                            </div>
                        </motion.form>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <Link
                                    key={project.id}
                                    to={`/project/${project.id}`}
                                    className="block"
                                >
                                    <Card className="p-6 h-full bg-gray-700/50 border-gray-600 hover:border-gray-500 transition-all duration-200">
                                        <h3 className="font-bold text-xl text-white mb-2">{project.name}</h3>
                                        <p className="text-gray-300 mb-4">{project.description}</p>
                                        <p className="text-sm text-gray-400">
                                            Created: {new Date(project.createdAt).toLocaleDateString()}
                                        </p>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Plus className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                                <p className="text-gray-400">Create your first project to get started</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TeamPage;
