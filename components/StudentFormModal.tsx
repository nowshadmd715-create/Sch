
import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types.ts';

interface StudentFormModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (student: Student) => void;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ student, onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const SCHOOL_CLASSES = ['Play', 'Nursery', 'KG-1', 'KG-2', 'KG-3', 'KG-4', 'KG-5'];
  
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    fatherName: '',
    className: 'Play',
    rollNumber: '',
    gpa: 0,
    attendance: '90%',
    contact: '',
    dateOfBirth: '',
    avatar: '',
    subjects: []
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        name: '',
        fatherName: '',
        className: 'Play',
        rollNumber: '',
        gpa: 0,
        attendance: '90%',
        contact: '',
        dateOfBirth: '2018-01-01',
        avatar: '',
        subjects: [
          { name: 'Bangla', grade: 'A', score: 85 },
          { name: 'English', grade: 'A', score: 82 },
          { name: 'Math', grade: 'A', score: 80 }
        ]
      });
    }
  }, [student]);

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

  const handleAddSubject = () => {
    const newSubjects = [...(formData.subjects || []), { name: '', grade: '', score: 0 }];
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleRemoveSubject = (index: number) => {
    const newSubjects = (formData.subjects || []).filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubjectChange = (index: number, field: string, value: string | number) => {
    const newSubjects = (formData.subjects || []).map((s, i) => {
      if (i === index) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      ...formData as Student,
      id: student?.id || Math.random().toString(36).substr(2, 9),
      avatar: formData.avatar || `https://picsum.photos/seed/${formData.name || 'default'}/200`,
      subjects: formData.subjects || []
    };
    onSave(newStudent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-all duration-300" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.15)] flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        <div className="bg-[#0f172a] p-6 text-white flex justify-between items-center sticky top-0 z-10 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black tracking-tight">{student ? 'Modify Profile' : 'Student Enrollment'}</h2>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-0.5">Campus Registry v2.6</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto no-scrollbar">
          {/* Section 1: Identity */}
          <section>
             <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">01</span>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Personal Identity</h3>
             </div>
             
             <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <span className="text-4xl block mb-1">📷</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Add Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={(val) => setFormData({...formData, name: val})} 
                    placeholder="Student's Name" 
                  />
                  <FormInput 
                    label="Guardian Name" 
                    value={formData.fatherName} 
                    onChange={(val) => setFormData({...formData, fatherName: val})} 
                    placeholder="Father/Mother" 
                  />
                  <FormInput 
                    label="Date of Birth" 
                    type="date" 
                    value={formData.dateOfBirth} 
                    onChange={(val) => setFormData({...formData, dateOfBirth: val})} 
                  />
                  <FormInput 
                    label="Contact No" 
                    value={formData.contact} 
                    onChange={(val) => setFormData({...formData, contact: val})} 
                    placeholder="+880 1XXX-XXXXXX" 
                  />
                </div>
             </div>
          </section>

          {/* Section 2: Academic Placement */}
          <section className="pt-8 border-t border-slate-100">
             <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">02</span>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Academic Placement</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Select Class</label>
                  <select 
                    value={formData.className} 
                    onChange={(e) => setFormData({...formData, className: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <FormInput 
                  label="Roll Number" 
                  value={formData.rollNumber} 
                  onChange={(val) => setFormData({...formData, rollNumber: val})} 
                  placeholder="e.g. 101" 
                />
                 <FormInput 
                  label="Avg Attendance %" 
                  value={formData.attendance} 
                  onChange={(val) => setFormData({...formData, attendance: val})} 
                  placeholder="95%" 
                />
             </div>
          </section>

          {/* Section 3: Performance Records */}
          <section className="pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs">03</span>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Academic Results</h3>
              </div>
              <button type="button" onClick={handleAddSubject} className="text-[10px] bg-indigo-600 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:shadow-lg transition-all">+ Add Subject</button>
            </div>
            
            <div className="space-y-3">
              {(formData.subjects || []).map((subject, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex items-end gap-3 border border-slate-100 group">
                  <div className="flex-1">
                    <input 
                      required
                      type="text" 
                      placeholder="Subject Name"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <div className="w-20">
                    <input 
                      required
                      type="text" 
                      placeholder="Gr."
                      value={subject.grade}
                      onChange={(e) => handleSubjectChange(idx, 'grade', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-center outline-none"
                    />
                  </div>
                  <div className="w-24">
                    <input 
                      required
                      type="number" 
                      value={subject.score}
                      onChange={(e) => handleSubjectChange(idx, 'score', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-center outline-none"
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveSubject(idx)} className="p-2.5 text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                </div>
              ))}
            </div>
          </section>
          
          <div className="flex justify-end gap-3 pt-10 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Discard</button>
            <button type="submit" className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
              {student ? 'Save Changes' : 'Enroll Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: any; onChange: (val: string) => void; placeholder?: string; type?: string }) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <input 
      required
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
    />
  </div>
);

export default StudentFormModal;
