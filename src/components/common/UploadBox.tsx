'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
}

const UploadBox = ({ onFileSelect, selectedFile }: UploadBoxProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const file = selectedFile || null;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (selectedFile: File): boolean => {
    // Check file type
    const validTypes = [
      // Document types
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain',
      // Image types
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/tiff',
      'image/bmp',
      'image/webp'
    ];
    
    // For files that might have an empty MIME type but valid extension
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'docx', 'doc', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'tiff', 'bmp', 'webp'];
    
    if (!validTypes.includes(selectedFile.type) && 
        !(fileExtension && validExtensions.includes(fileExtension))) {
      setError('Invalid file type. Please upload a document (PDF, DOC, DOCX, TXT) or image file (JPG, PNG, GIF, etc).');
      return false;
    }
    
    // Check file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      
      if (validateFile(selectedFile)) {
        setError(null);
        onFileSelect(selectedFile);
      }
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (validateFile(selectedFile)) {
        setError(null);
        onFileSelect(selectedFile);
      }
    }
  }, [onFileSelect]);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    onFileSelect(null as any);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
            : 'border-secondary-300 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-white dark:hover:bg-secondary-800'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-1">{file.name}</h3>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-4">{formatFileSize(file.size)}</p>
            <button 
              type="button"
              onClick={removeFile}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
              <span>Remove file</span>
            </button>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.tiff,.bmp,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/jpeg,image/png,image/gif,image/tiff,image/bmp,image/webp"
              className="hidden"
              onChange={handleChange}
            />
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-1">Upload your document</h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4">Drag and drop or click to browse</p>
              <button
                type="button"
                onClick={handleClick}
                className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md font-medium text-sm hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800"
              >
                Select file
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadBox; 