import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import type { Attachment } from '../types';
import * as taskService from '../services/task.service';
import * as projectService from '../services/project.service';
import type { Task } from '../services/task.service';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import toast from 'react-hot-toast';

interface Project {
    id: string;
    name: string;
    description: string;
}

const ProjectPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

    const fetchProjectData = useCallback(async () => {
        try {
            // Fetch real project data from API
            const projectData = await projectService.getProjectById(projectId!);
            setProject(projectData);

            // Fetch real tasks from API
            const realTasks = await taskService.getTasksByProject(projectId!);
            setTasks(realTasks);
        } catch (err) {
            console.error('Error fetching project data:', err);
            setError('Failed to fetch project data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId, fetchProjectData]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            // Try to create task via API
            const newTask = await taskService.createTask(
                newTaskTitle,
                newTaskDescription,
                projectId!
            );
            setTasks([...tasks, newTask]);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setShowCreateForm(false);
            toast.success('Task created successfully!');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to create task');
        }
    };

    const handleStatusUpdate = async (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
        try {
            await taskService.updateTaskStatus(taskId, newStatus);
            setTasks(tasks.map(task =>
                task.id === taskId
                    ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
                    : task
            ));
            toast.success('Task status updated!');
        } catch {
            toast.error('Failed to update task status');
        }
    };

    const handleUploadSuccess = (attachment: Attachment) => {
        console.log('Uploaded attachment:', attachment);
        toast.success('File uploaded successfully!');
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'TODO':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'IN_PROGRESS':
                return <Clock className="w-5 h-5 text-blue-500" />;
            case 'DONE':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TODO':
                return 'border-yellow-500 bg-yellow-500/10';
            case 'IN_PROGRESS':
                return 'border-blue-500 bg-blue-500/10';
            case 'DONE':
                return 'border-green-500 bg-green-500/10';
            default:
                return 'border-gray-500 bg-gray-500/10';
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

    if (!project) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-white text-xl">Project not found</div>
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
                    <h1 className="text-4xl font-bold text-white mb-4">{project.name}</h1>
                    <p className="text-gray-300 text-lg">{project.description}</p>
                </div>

                <Card className="p-8 bg-gray-800/50 border-gray-700">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Tasks</h2>
                        <Button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            variant={showCreateForm ? 'outline' : 'primary'}
                            size="lg"
                        >
                            <Plus className="w-6 h-6 mr-3" />
                            {showCreateForm ? 'Cancel' : 'Create Task'}
                        </Button>
                    </div>

                    {showCreateForm && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleCreateTask}
                            className="mb-8 p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl border border-gray-600"
                        >
                            <div className="space-y-4">
                                <Input
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Task title"
                                    className="bg-gray-700 border-gray-600 text-white"
                                    required
                                />
                                <textarea
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    placeholder="Task description (optional)"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                                <Button
                                    type="submit"
                                    disabled={!newTaskTitle.trim()}
                                    size="lg"
                                    className="w-full"
                                >
                                    Create Task
                                </Button>
                            </div>
                        </motion.form>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <Card key={task.id} className="p-6 bg-gray-700/50 border-gray-600 hover:border-gray-500 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-bold text-xl text-white">{task.title}</h3>
                                        <div className={`px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                                            {getStatusIcon(task.status)}
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-4">{task.description}</p>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Status:</span>
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleStatusUpdate(task.id, e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')}
                                                className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="TODO">To Do</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="DONE">Done</option>
                                            </select>
                                        </div>

                                        {task.dueDate && (
                                            <div className="flex items-center text-sm text-gray-400">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-600 pt-4">
                                        <FileUpload
                                            taskId={task.id}
                                            onUploadSuccess={handleUploadSuccess}
                                        />
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Plus className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
                                <p className="text-gray-400">Create your first task to get started</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProjectPage;
