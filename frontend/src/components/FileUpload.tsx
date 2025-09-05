import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

interface FileUploadProps {
    onUploadSuccess: (attachment: any) => void;
    taskId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, taskId }) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:8000/api/attachments/upload/${taskId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'File upload failed');
            }

            const newAttachment = await response.json();
            onUploadSuccess(newAttachment);
            toast.success('File uploaded successfully!');

            // Clear the file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Error uploading file.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full">
            <motion.div
                className={cn(
                    'relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
                    dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400',
                    uploading && 'opacity-50 pointer-events-none'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                whileHover={{ scale: dragActive ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-3">
                    {uploading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <Upload className="w-8 h-8 text-blue-500 mx-auto" />
                        </motion.div>
                    ) : (
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    )}

                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Supports any file type
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FileUpload;
