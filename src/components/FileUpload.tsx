import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processed' | 'error';
  progress: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['PDF', 'DOCX', 'XLSX', 'CSV', 'TXT'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toUpperCase();
      return supportedFormats.includes(extension || '') && file.size <= maxFileSize;
    });

    const newUploadedFiles = validFiles.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    onFileUpload(validFiles);

    // Simulate file processing
    newUploadedFiles.forEach((uploadedFile, index) => {
      simulateFileProcessing(uploadedFile, index);
    });
  };

  const simulateFileProcessing = (uploadedFile: UploadedFile, index: number) => {
    // Upload file to backend
    const uploadFile = async () => {
      try {
        const formData = new FormData();
        formData.append('files', uploadedFile.file);

        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        setUploadedFiles(prev => prev.map((file) => {
          if (file.file.name === uploadedFile.file.name) {
            return {
              ...file,
              progress: 100,
              status: result.files[0]?.status === 'processed' ? 'processed' : 'error'
            };
          }
          return file;
        }));
        
      } catch (error) {
        setUploadedFiles(prev => prev.map((file) => {
          if (file.file.name === uploadedFile.file.name) {
            return {
              ...file,
              progress: 0,
              status: 'error'
            };
          }
          return file;
        }));
      }
    };

    // Simulate progress while uploading
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map((file) => {
        if (file.file.name === uploadedFile.file.name && file.status === 'uploading') {
          const newProgress = Math.min(file.progress + 15, 90);
          return {
            ...file,
            progress: newProgress
          };
        }
        return file;
      }));
    }, 300);

    // Start actual upload
    uploadFile().finally(() => {
      clearInterval(interval);
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.file.name !== fileName));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <File className="w-8 h-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-500">
              Supported formats: {supportedFormats.join(', ')}
            </p>
            <p className="text-sm text-gray-400">
              Maximum file size: 10MB
            </p>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select Files
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.csv,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map((uploadedFile, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(uploadedFile.file.name)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadedFile.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    )}
                    {uploadedFile.status === 'processed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {uploadedFile.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <button
                      onClick={() => removeFile(uploadedFile.file.name)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {uploadedFile.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadedFile.progress}%` }}
                    />
                  </div>
                )}
                
                {uploadedFile.status === 'processed' && (
                  <div className="text-sm text-green-600">
                    ✓ Processed and ready for analysis
                  </div>
                )}
                
                {uploadedFile.status === 'error' && (
                  <div className="text-sm text-red-600">
                    ✗ Error processing file
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Statistics */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {uploadedFiles.filter(f => f.status === 'processed').length}
              </div>
              <div className="text-sm text-gray-500">Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {uploadedFiles.filter(f => f.status === 'uploading').length}
              </div>
              <div className="text-sm text-gray-500">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {uploadedFiles.filter(f => f.status === 'error').length}
              </div>
              <div className="text-sm text-gray-500">Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;