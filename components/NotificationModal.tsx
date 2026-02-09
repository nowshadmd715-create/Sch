
import React from 'react';
import { AppNotification } from '../types.ts';

interface NotificationModalProps {
  notification: AppNotification | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'success': return 'text-emerald-600 bg-emerald-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      default: return 'text-indigo-600 bg-indigo-50';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${getColor()}`}>
              {getIcon()}
            </div>
            <button 
              onClick={onClose}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">Notification Detail</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            {notification.text}
          </p>
          
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Received</span>
            <span className="text-xs font-semibold text-slate-500 px-2 py-1 bg-slate-100 rounded-lg">{notification.time}</span>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98]"
          >
            Close Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
