import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as attachmentController from '../controllers/attachment.controller.js'; 

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

// Upload attachment for a task
router.post('/upload/:taskId', upload.single('file'), attachmentController.uploadAttachment);

// Get attachments for a task
router.get('/task/:taskId', attachmentController.getAttachmentsByTask);

export default router;
