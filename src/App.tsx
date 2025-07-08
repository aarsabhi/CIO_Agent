import React, { useState } from 'react';
import { Settings, User, Search, LogOut } from 'lucide-react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Forecast from './components/Forecast';
import HeatmapTile from './components/HeatmapTile';
import DailyBrief from './components/DailyBrief';
import { User as UserType } from './data/mockData';

type ActiveView = 'dashboard' | 'chat' | 'upload' | 'forecast' | 'heatmap' | 'brief';

function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleLogin = (userData: UserType) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('dashboard');
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Show login page if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'chat':
        return <Chat uploadedFiles={uploadedFiles} />;
      case 'upload':
        return <FileUpload onFileUpload={handleFileUpload} />;
      case 'forecast':
        return <Forecast />;
      case 'heatmap':
        return <HeatmapTile />;
      case 'brief':
        return <DailyBrief />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">CIO Assistant</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>Welcome, {user.name}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title={user.email}>
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default App;