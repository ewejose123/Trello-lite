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
const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:3002',
    'https://taskmanagerpro-jade.vercel.app', // Original Vercel frontend
    process.env.FRONTEND_URL || 'http://localhost:5173' // Fallback from env
];

// CORS configuration
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        console.log(`CORS Check - Origin: ${origin || 'none'}`);
        
        // Allow requests with no origin (mobile apps, curl, postman)
        if (!origin) {
            console.log('CORS: Allowing request with no origin');
            return callback(null, true);
        }
        
        // Allow any localhost origin for development
        if (origin.includes('localhost')) {
            console.log('CORS: Allowing localhost origin');
            return callback(null, true);
        }
        
        // Allow any .vercel.app domain
        if (origin.includes('.vercel.app')) {
            console.log('CORS: Allowing .vercel.app domain');
            return callback(null, true);
        }
        
        // Allow any .onrender.com domain (for backend-to-backend calls if needed)
        if (origin.includes('.onrender.com')) {
            console.log('CORS: Allowing .onrender.com domain');
            return callback(null, true);
        }
        
        // Allow specific origins
        if (allowedOrigins.includes(origin)) {
            console.log('CORS: Allowing specific origin from allowedOrigins');
            return callback(null, true);
        }
        
        // For development, be more permissive
        if (process.env.NODE_ENV !== 'production') {
            console.log('CORS: Allowing in development mode');
            return callback(null, true);
        }
        
        console.log(`CORS: Rejecting origin: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`), false);
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Cookie',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    preflightContinue: false
};

app.use(cors(corsOptions));

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
    next();
});

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

// CORS test endpoint
app.get('/cors-test', (req: Request, res: Response) => {
    res.json({ 
        message: 'CORS is working!',
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

// CORS test endpoint under API path
app.get('/api/cors-test', (req: Request, res: Response) => {
    res.json({ 
        message: 'API CORS is working!',
        origin: req.headers.origin,
        userAgent: req.headers['user-agent'],
        method: req.method,
        timestamp: new Date().toISOString(),
        headers: {
            origin: req.headers.origin,
            authorization: req.headers.authorization ? 'Present' : 'Not present',
            contentType: req.headers['content-type']
        }
    });
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

