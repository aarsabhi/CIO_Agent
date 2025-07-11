import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Upload, File, X, CheckCircle, AlertCircle, Loader2, Paperclip } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  files?: string[];
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processed' | 'error';
  progress: number;
}

const UnifiedChatUpload: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. Upload documents and I'll help you analyze them. You can ask me questions about your uploaded files, and I'll provide insights based on their content.",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['PDF', 'DOCX', 'XLSX', 'CSV', 'TXT'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    if (validFiles.length === 0) {
      addSystemMessage("No valid files selected. Please upload PDF, DOCX, XLSX, CSV, or TXT files under 10MB.");
      return;
    }

    const newUploadedFiles = validFiles.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    
    // Add upload notification message
    addSystemMessage(`Uploading ${validFiles.length} file(s): ${validFiles.map(f => f.name).join(', ')}`);

    // Process each file
    newUploadedFiles.forEach((uploadedFile) => {
      uploadFile(uploadedFile);
    });
  };

  const uploadFile = async (uploadedFile: UploadedFile) => {
    try {
      const formData = new FormData();
      formData.append('files', uploadedFile.file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(file => {
          if (file.file.name === uploadedFile.file.name && file.status === 'uploading') {
            return { ...file, progress: Math.min(file.progress + 15, 90) };
          }
          return file;
        }));
      }, 300);

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      setUploadedFiles(prev => prev.map(file => {
        if (file.file.name === uploadedFile.file.name) {
          return {
            ...file,
            progress: 100,
            status: result.files?.[0]?.status === 'processed' ? 'processed' : 'error'
          };
        }
        return file;
      }));

      if (result.files?.[0]?.status === 'processed') {
        addSystemMessage(`✅ ${uploadedFile.file.name} processed successfully! You can now ask questions about this document.`);
      } else {
        addSystemMessage(`❌ Error processing ${uploadedFile.file.name}. Please try again.`);
      }
      
    } catch (error) {
      setUploadedFiles(prev => prev.map(file => {
        if (file.file.name === uploadedFile.file.name) {
          return { ...file, progress: 0, status: 'error' };
        }
        return file;
      }));
      addSystemMessage(`❌ Failed to upload ${uploadedFile.file.name}. Please try again.`);
    }
  };

  const addSystemMessage = (text: string) => {
    const systemMessage: Message = {
      id: Date.now(),
      text,
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          uploaded_files: uploadedFiles.filter(f => f.status === 'processed').map(f => f.file.name)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(),
        files: uploadedFiles.filter(f => f.status === 'processed').length > 0 
          ? uploadedFiles.filter(f => f.status === 'processed').map(f => f.file.name)
          : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting to the AI service. Please make sure the backend server is running and try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.file.name !== fileName));
    addSystemMessage(`Removed ${fileName} from the conversation context.`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processedFiles = uploadedFiles.filter(f => f.status === 'processed');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Document Assistant</h2>
              <p className="text-sm text-gray-500">
                {processedFiles.length > 0 
                  ? `${processedFiles.length} document(s) ready for analysis`
                  : 'Upload documents to start analyzing'
                }
              </p>
            </div>
          </div>
          
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
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

      {/* File Upload Area (when no files) */}
      {uploadedFiles.length === 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mx-6 mt-4 border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDragOver ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-6 h-6 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Drop files here or click to upload</p>
              <p className="text-xs text-gray-500">Supports: {supportedFormats.join(', ')} • Max 10MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <File className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Uploaded Documents</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  {uploadedFile.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                  {uploadedFile.status === 'processed' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700 truncate max-w-32">
                    {uploadedFile.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(uploadedFile.file.size)})
                  </span>
                </div>
                <button
                  onClick={() => removeFile(uploadedFile.file.name)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-br from-blue-600 to-purple-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.files && (
                    <div className="mt-2 flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        Referenced: {message.files.slice(0, 2).join(', ')}
                        {message.files.length > 2 && ` +${message.files.length - 2} more`}
                      </span>
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md xl:max-w-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Analyzing your documents...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div 
        className={`bg-white border-t border-gray-200 px-6 py-4 ${isDragOver ? 'bg-blue-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Upload files"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                processedFiles.length > 0 
                  ? "Ask me anything about your uploaded documents..."
                  : "Upload documents first, then ask me questions about them..."
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={processedFiles.length === 0}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading || processedFiles.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
        
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center border-2 border-dashed border-blue-400 rounded-lg">
            <div className="text-center">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Drop files here to upload</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedChatUpload;