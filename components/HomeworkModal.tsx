
import React, { useState } from 'react';
import { Homework } from '../types.ts';

interface HomeworkModalProps {
  homework: Homework | null;
  onClose: () => void;
}

const HomeworkModal: React.FC<HomeworkModalProps> = ({ homework, onClose }) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  if (!homework) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Full Image Overlay (Lightbox) */}
        {isImageExpanded && homework.imageUrl && (
          <div className="fixed inset-0 z-[80] bg-black flex items-center justify-center animate-in fade-in duration-200">
            <button 
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[90] text-2xl"
            >
              ✕
            </button>
            <img 
              src={homework.imageUrl} 
              alt="Full view" 
              className="max-w-full max-h-full object-contain p-4" 
            />
          </div>
        )}

        {/* Header Section */}
        <div className={`relative shrink-0 ${homework.imageUrl ? 'h-64 sm:h-80' : 'h-32 bg-indigo-600'} overflow-hidden group`}>
          {homework.imageUrl ? (
            <>
              <img 
                src={homework.imageUrl} 
                alt={homework.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <button 
                onClick={() => setIsImageExpanded(true)}
                className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/40 transition-all"
              >
                🔍 Expand Image
              </button>
            </>
          ) : (
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
          )}
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-black/20 sm:bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all border border-white/20 z-10"
          >
            ✕
          </button>
          
          <div className="absolute bottom-6 left-6 sm:left-10">
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-indigo-400/30">
              Grade: {homework.className}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10 overflow-y-auto no-scrollbar flex-1 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>📅 Posted: {homework.date}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Assignment</span>
             </div>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 mb-6 leading-tight tracking-tight">
            {homework.title}
          </h2>

          <div className="bg-slate-50 rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-inner">
             <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm shrink-0 border border-slate-200">📝</div>
                <div className="flex-1">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Task Instructions</h4>
                   <p className="text-slate-600 leading-relaxed text-sm sm:text-lg whitespace-pre-wrap font-medium">
                      {homework.description}
                   </p>
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4">
             <button 
                onClick={onClose}
                className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
             >
                Confirm Receipt
             </button>
             <button 
                onClick={() => window.print()}
                className="px-8 py-5 rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all hidden sm:flex items-center justify-center gap-2"
             >
                🖨️ Print
             </button>
          </div>
          
          <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-8">
            EduPulse Management System • Security Verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeworkModal;
