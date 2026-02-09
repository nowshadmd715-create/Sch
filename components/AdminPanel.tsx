
import React, { useState, useRef } from 'react';
import { Student, AppSettings, Homework } from '../types.ts';

interface AdminPanelProps {
  students: Student[];
  homeworks: Homework[];
  onPostHomework: (homework: Homework) => void;
  appSettings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  onBulkUpload: (students: Student[]) => void;
  onPostAnnouncement: (text: string, type: 'info' | 'warning' | 'success') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  students, 
  homeworks,
  onPostHomework,
  appSettings, 
  onUpdateSettings,
  onAdd, 
  onEdit, 
  onDelete, 
  onDeleteAll, 
  onBulkUpload, 
  onPostAnnouncement 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const homeworkImageRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'registry' | 'branding' | 'homework' | 'broadcast'>('registry');

  // Announcement State
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success'>('info');
  
  // Homework State
  const [hwData, setHwData] = useState({
    title: '',
    description: '',
    className: 'Play',
    image: ''
  });

  const [tempSettings, setTempSettings] = useState<AppSettings>(appSettings);

  const SCHOOL_CLASSES = ['Play', 'Nursery', 'KG-1', 'KG-2', 'KG-3', 'KG-4', 'KG-5'];

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwData.title || !hwData.description) return;
    
    onPostHomework({
      id: Math.random().toString(36).substr(2, 9),
      title: hwData.title,
      description: hwData.description,
      className: hwData.className,
      imageUrl: hwData.image || undefined,
      date: new Date().toLocaleDateString()
    });

    setHwData({ title: '', description: '', className: 'Play', image: '' });
    // Visual feedback
    const toast = document.createElement('div');
    toast.className = 'fixed top-10 right-10 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl animate-in slide-in-from-right-10 z-[100]';
    toast.innerText = 'Homework Published Successfully! ✅';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-right-10');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  const handleHwImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHwData({ ...hwData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newStudents: Student[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const [name, fatherName, className, roll, gpa, attendance, contact] = lines[i].split(',');
        newStudents.push({
          id: Math.random().toString(36).substr(2, 9),
          name: (name || 'Unnamed').trim(),
          fatherName: (fatherName || 'Unknown').trim(),
          className: (className || 'Play').trim(),
          rollNumber: (roll || `R-${i}`).trim(),
          gpa: parseFloat(gpa) || 0,
          attendance: (attendance || '0%').trim(),
          contact: (contact || 'N/A').trim(),
          avatar: `https://picsum.photos/seed/${Math.random()}/200`,
          subjects: [],
          dateOfBirth: '2015-01-01'
        });
      }

      if (newStudents.length > 0) {
        onBulkUpload(newStudents);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onPostAnnouncement(announcementText, announcementType);
    setAnnouncementText('');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Dynamic Tab Navigation */}
      <div className="flex bg-white p-2.5 rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <TabBtn active={activeTab === 'registry'} onClick={() => setActiveTab('registry')} label="Student Registry" icon="👥" />
        <TabBtn active={activeTab === 'homework'} onClick={() => setActiveTab('homework')} label="Manage Homework" icon="📝" />
        <TabBtn active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} label="Push Alerts" icon="📢" />
        <TabBtn active={activeTab === 'branding'} onClick={() => setActiveTab('branding')} label="Campus Logo" icon="🎨" />
      </div>

      {activeTab === 'registry' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl mb-10 border-b-8 border-indigo-600">
            <div>
              <h3 className="text-3xl font-black tracking-tight">Student Repository</h3>
              <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mt-2 opacity-70">Master Database v4.2</p>
            </div>
            <div className="flex flex-wrap gap-3">
               <button onClick={onAdd} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95">Enroll New</button>
               <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800 text-indigo-300 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all">CSV Import</button>
               <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Details</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={student.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Parent: {student.fatherName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider">{student.className}</span>
                        <p className="text-xs font-bold text-slate-500 mt-2 ml-1">Roll # {student.rollNumber}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button onClick={() => onEdit(student)} className="w-11 h-11 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">✏️</button>
                          <button onClick={() => onDelete(student.id)} className="w-11 h-11 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="p-24 text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 opacity-50">👥</div>
                   <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No active enrollments found</p>
                </div>
              )}
            </div>
            {students.length > 0 && (
               <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {students.length} Total Records</p>
                  <button onClick={onDeleteAll} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors bg-white px-5 py-2 rounded-xl border border-slate-200 hover:border-red-100 shadow-sm">Reset All Records</button>
               </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'homework' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-2">
          {/* Homework Creator Form */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-32">
                <div className="p-8 bg-indigo-600 text-white">
                   <h3 className="font-black uppercase text-xs tracking-[0.3em]">Publish New Task</h3>
                   <p className="text-indigo-200 text-[10px] mt-1 font-bold">Assignments reach students instantly</p>
                </div>
                <form onSubmit={handleHomeworkSubmit} className="p-8 space-y-7">
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Grade</label>
                      <select 
                        value={hwData.className}
                        onChange={(e) => setHwData({ ...hwData, className: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Headline</label>
                      <input 
                        type="text" 
                        required
                        value={hwData.title}
                        onChange={(e) => setHwData({ ...hwData, title: e.target.value })}
                        placeholder="e.g. Creative Arts Project"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignment Brief</label>
                      <textarea 
                        required
                        value={hwData.description}
                        onChange={(e) => setHwData({ ...hwData, description: e.target.value })}
                        placeholder="Detailed instructions for the students..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all min-h-[150px] resize-none leading-relaxed"
                      ></textarea>
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Reference (Optional)</label>
                      <div 
                        onClick={() => homeworkImageRef.current?.click()}
                        className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden group shadow-inner"
                      >
                        {hwData.image ? (
                          <div className="relative w-full h-full">
                            <img src={hwData.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                               <span className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black">CHANGE IMAGE</span>
                            </div>
                          </div>
                        ) : (
                          <>
                             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">📸</div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Click to attach photo</span>
                          </>
                        )}
                      </div>
                      <input type="file" ref={homeworkImageRef} onChange={handleHwImageUpload} className="hidden" accept="image/*" />
                   </div>
                   <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 transition-all transform active:scale-[0.98]">Push to Class Dashboard</button>
                </form>
             </div>
          </div>

          {/* Recently Posted Feed for Admin */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Publications</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-4 py-2 rounded-xl">Total: {homeworks.length}</span>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {homeworks.map(hw => (
                  <div key={hw.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group shadow-sm">
                     <div className="w-full sm:w-24 h-24 rounded-[1.5rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                        {hw.imageUrl ? (
                           <img src={hw.imageUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                           <span className="text-3xl">📝</span>
                        )}
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                           <h4 className="font-black text-slate-800 text-base group-hover:text-indigo-600 transition-colors leading-tight">{hw.title}</h4>
                           <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">{hw.className}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{hw.description}</p>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                           <span className="flex items-center gap-1.5">📅 {hw.date}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                           <span className="text-indigo-500">Public Live</span>
                        </div>
                     </div>
                  </div>
                ))}
                {homeworks.length === 0 && (
                  <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 opacity-50">📤</div>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No published tasks in history</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 max-w-3xl mx-auto">
          <div className="p-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-100">📢</div>
                <div>
                   <h4 className="text-2xl font-black text-slate-800 tracking-tight">System Broadcast</h4>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Direct to User Inbox</p>
                </div>
             </div>
             <form onSubmit={handlePostAnnouncement} className="space-y-8">
                <textarea 
                  required
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Enter high-priority announcement text here..."
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 min-h-[200px] transition-all resize-none text-sm font-bold leading-relaxed shadow-inner"
                ></textarea>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select 
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value as any)}
                    className="px-8 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest outline-none appearance-none cursor-pointer shadow-sm min-w-[200px]"
                  >
                    <option value="info">General Info</option>
                    <option value="success">Success Note</option>
                    <option value="warning">Critical Alert</option>
                  </select>
                  <button type="submit" className="flex-1 bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95">Launch Broadcast</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2">
          <div className="p-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-100">🎨</div>
                <div>
                   <h4 className="text-2xl font-black text-slate-800 tracking-tight">Identity Management</h4>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Campus Customization</p>
                </div>
             </div>
             <form onSubmit={handleSaveSettings} className="space-y-10">
                <div className="flex flex-col items-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 cursor-pointer group hover:bg-indigo-50/30 hover:border-indigo-300 transition-all shadow-inner" onClick={() => logoInputRef.current?.click()}>
                   <div className="w-28 h-28 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden mb-6 group-hover:rotate-6 transition-transform border border-slate-50">
                      {tempSettings.appLogo ? <img src={tempSettings.appLogo} alt="" className="w-full h-full object-cover" /> : <span className="text-5xl">🏫</span>}
                   </div>
                   <span className="text-[10px] font-black text-indigo-600 bg-white px-6 py-2 rounded-full border border-indigo-100 uppercase tracking-[0.2em] shadow-sm">Replace Global Logo</span>
                   <input type="file" ref={logoInputRef} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setTempSettings({ ...tempSettings, appLogo: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                   }} accept="image/*" className="hidden" />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Official Institution Name</label>
                   <input 
                     type="text" 
                     value={tempSettings.appName}
                     onChange={(e) => setTempSettings({ ...tempSettings, appName: e.target.value })}
                     className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-sm"
                   />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 transition-all active:scale-95">Apply Global Branding</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: string }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all font-black text-xs uppercase tracking-[0.1em]
      ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
    `}
  >
    <span className="text-lg">{icon}</span> {label}
  </button>
);

export default AdminPanel;
