
import React from 'react';
import { Teacher } from '../types';

interface TeacherPanelProps {
  teachers: Teacher[];
  onAdd: () => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ teachers, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Faculty Members</h3>
          <p className="text-slate-500">Manage teacher profiles and academic roles</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
        >
          <span>➕</span> Add New Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => onEdit(teacher)} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">✏️</button>
              <button onClick={() => onDelete(teacher.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">🗑️</button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img src={teacher.avatar} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50" alt={teacher.name} />
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{teacher.name}</h4>
                <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">{teacher.designation}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Main Subject:</span>
                <span className="font-semibold text-slate-700">{teacher.subject}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Joined Date:</span>
                <span className="font-semibold text-slate-700">{teacher.joiningDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Education:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[150px]">{teacher.education}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-2">
              <a href={`mailto:${teacher.email}`} className="flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-xs font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <span>📧</span> Email
              </a>
              <a href={`tel:${teacher.contact}`} className="flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-xs font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <span>📞</span> Contact
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {teachers.length === 0 && (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">No teachers registered yet.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
