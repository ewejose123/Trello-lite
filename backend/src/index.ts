import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { join } from 'path';
import authRoutes from './routes/auth.routes.js';
import teamRoutes from './routes/team.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import attachmentRoutes from './routes/attachment.routes.js';

const app: Express = express();
const port = process.env.PORT || 8000;

// Enable CORS for frontend
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://localhost:3002',
        'https://taskmanagerpro-jade.vercel.app', // Production frontend
        process.env.FRONTEND_URL || 'http://localhost:5173' // Fallback
    ],
    credentials: true, // Allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attachments', attachmentRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// Health check endpoint for API
app.get('/api', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Health check with more details
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
}).on('error', (err) => {
    console.error('[server]: Error starting server:', err);
});

