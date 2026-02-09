
import React from 'react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onViewDetails: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <img 
          src={student.avatar} 
          alt={student.name} 
          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-50"
        />
        <div className="text-right">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-1">
            Roll: {student.rollNumber}
          </span>
          <p className="text-xs text-slate-400 font-medium">Class: {student.className}</p>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
          {student.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
          <span className="text-xs">👤</span> s/o {student.fatherName}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Result (GPA)</p>
          <p className="text-lg font-bold text-slate-800">{student.gpa.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Attendance</p>
          <p className="text-lg font-bold text-emerald-600">{student.attendance}</p>
        </div>
      </div>

      <button 
        onClick={() => onViewDetails(student)}
        className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 font-semibold text-sm transition-all border border-slate-100"
      >
        View Details
      </button>
    </div>
  );
};

export default StudentCard;
