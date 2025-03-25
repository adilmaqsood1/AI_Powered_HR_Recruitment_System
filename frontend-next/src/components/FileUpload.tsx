import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: Record<string, string[]>;
  maxSize?: number;
  label?: string;
  helpText?: string;
};

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt']
  },
  maxSize = 5242880, // 5MB default
  label = 'Resume',
  helpText = 'Supported formats: PDF, TXT'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setIsDragActive(false);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setFileError(`File is too large. Max size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      } else if (error.code === 'file-invalid-type') {
        setFileError('Invalid file type. Please upload a PDF or TXT file.');
      } else {
        setFileError(error.message);
      }
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileError(null);
      onFileSelect(selectedFile);
    }
  }, [maxSize, onFileSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    maxSize,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const getFileIcon = () => {
    if (fileError) return <FiAlertCircle className="text-red-500 text-xl" />;
    if (file) return <FiCheckCircle className="text-green-500 text-xl" />;
    return <FiUpload className="text-primary text-xl group-hover:text-white transition-colors duration-200" />;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ease-in-out
          ${isDragActive ? 'border-primary bg-primary bg-opacity-5 shadow-md' : 'border-gray-300'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${file && !fileError ? 'border-green-500 bg-green-50' : ''}
          ${fileError ? 'border-red-500 bg-red-50' : ''}
          group hover:bg-primary hover:border-primary cursor-pointer
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-white transition-colors duration-200">
            {getFileIcon()}
          </div>
          
          {file ? (
            <div className="space-y-1">
              <p className="text-sm font-medium group-hover:text-white transition-colors duration-200">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 group-hover:text-white transition-colors duration-200">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium group-hover:text-white transition-colors duration-200">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
              </p>
              <p className="text-xs text-gray-500 group-hover:text-white transition-colors duration-200">
                or <span className="underline">browse files</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {fileError ? (
        <p className="text-red-500 text-xs mt-1 animate-pulse">{fileError}</p>
      ) : (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default FileUpload;