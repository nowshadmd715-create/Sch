
import React from 'react';
import { Student, AttendanceRecord } from '../types';

interface AttendancePanelProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onToggleAttendance: (studentId: string, status: 'Present' | 'Absent') => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const AttendancePanel: React.FC<AttendancePanelProps> = ({ 
  students, 
  attendanceRecords, 
  onToggleAttendance, 
  selectedDate,
  onDateChange
}) => {
  const getStatus = (studentId: string) => {
    return attendanceRecords.find(r => r.studentId === studentId && r.date === selectedDate)?.status || 'Absent';
  };

  const presentCount = students.filter(s => getStatus(s.id) === 'Present').length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Attendance Header with Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Select Date</p>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="text-lg font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
            />
          </div>
          <div className="text-3xl">📅</div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Present Students</p>
            <h3 className="text-3xl font-black text-emerald-800 tracking-tight">{presentCount}</h3>
          </div>
          <div className="text-3xl">✅</div>
        </div>
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Absent Students</p>
            <h3 className="text-3xl font-black text-red-800 tracking-tight">{absentCount}</h3>
          </div>
          <div className="text-3xl">❌</div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Daily Attendance Log</h3>
          <p className="text-sm text-slate-500">Mark students as present or absent for {new Date(selectedDate).toLocaleDateString()}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const status = getStatus(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} className="w-10 h-10 rounded-lg object-cover ring-2 ring-white shadow-sm" alt="" />
                        <div>
                          <p className="font-bold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500">Roll: {student.rollNumber} • Class: {student.className}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight ${
                        status === 'Present' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onToggleAttendance(student.id, 'Present')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            status === 'Present' 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => onToggleAttendance(student.id, 'Absent')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            status === 'Absent' 
                              ? 'bg-red-600 text-white shadow-lg shadow-red-100' 
                              : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePanel;
