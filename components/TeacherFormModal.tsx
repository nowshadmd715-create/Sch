
import React, { useState, useEffect, useRef } from 'react';
import { Teacher } from '../types';

interface TeacherFormModalProps {
  teacher: Teacher | null;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
}

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({ teacher, onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    designation: '',
    subject: '',
    joiningDate: new Date().toISOString().split('T')[0],
    contact: '',
    email: '',
    education: '',
    avatar: '',
  });

  useEffect(() => {
    if (teacher) {
      setFormData(teacher);
    }
  }, [teacher]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: Teacher = {
      ...formData as Teacher,
      id: teacher?.id || Math.random().toString(36).substr(2, 9),
      avatar: formData.avatar || `https://picsum.photos/seed/${formData.name || 'default'}/200`,
    };
    onSave(newTeacher);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-indigo-900 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">{teacher ? 'Edit Teacher Profile' : 'Add Faculty Member'}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-slate-300">👨‍🏫</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl text-white text-[10px] font-bold uppercase">Change</div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Designation</label>
              <input required type="text" placeholder="e.g. Senior Teacher" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expert Subject</label>
              <input required type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Joining Date</label>
              <input required type="date" value={formData.joiningDate} onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contact No</label>
              <input required type="text" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Education</label>
              <input required type="text" placeholder="e.g. M.Sc, B.Ed" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherFormModal;
