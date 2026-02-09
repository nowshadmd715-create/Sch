
import React, { useState, useEffect } from 'react';
import { Student } from '../types.ts';
import { getStudentInsight } from '../services/geminiService.ts';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    if (!student) {
      setInsight(null);
      return;
    }
  }, [student]);

  if (!student) return null;

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const result = await getStudentInsight(student);
    setInsight(result);
    setLoadingInsight(false);
  };

  const handleDownloadResult = () => {
    const reportContent = `
=========================================
      EDUPULSE ACADEMIC REPORT
=========================================
STUDENT PROFILE
Name: ${student.name}
Father's Name: ${student.fatherName}
Roll Number: ${student.rollNumber}
Class: ${student.className}
Date of Birth: ${student.dateOfBirth}

ACADEMIC SUMMARY
Overall GPA: ${student.gpa.toFixed(2)}
Overall Attendance: ${student.attendance}

SUBJECT-WISE PERFORMANCE
${student.subjects.map(s => `${s.name.padEnd(20)} | Grade: ${s.grade.padEnd(3)} | Score: ${s.score}%`).join('\n')}

REMARKS
${insight ? `AI Insight: ${insight}` : 'Official faculty review pending.'}

Generated on: ${new Date().toLocaleDateString()}
=========================================
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${student.rollNumber}_${student.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-indigo-950 p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <span className="text-2xl">✕</span>
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={student.avatar} 
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/30" 
              alt={student.name} 
            />
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2 text-indigo-200 text-sm">
                <span>Roll: {student.rollNumber}</span>
                <span>•</span>
                <span>Class: {student.className}</span>
                <span>•</span>
                <span>GPA: {student.gpa}</span>
              </div>
              <div className="mt-4 flex justify-center md:justify-start">
                <button 
                  onClick={handleDownloadResult}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/40"
                >
                  📥 Download Report Card
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-8 bg-slate-50 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">General Information</h3>
              <div className="space-y-4">
                <InfoItem label="Father's Name" value={student.fatherName} icon="👤" />
                <InfoItem label="Date of Birth" value={student.dateOfBirth} icon="📅" />
                <InfoItem label="Contact Number" value={student.contact} icon="📞" />
                <InfoItem label="Attendance Rate" value={student.attendance} icon="📈" />
              </div>
            </div>

            {/* Subject Performance */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Academic Record</h3>
              <div className="space-y-3">
                {student.subjects.map((subject, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{subject.name}</p>
                      <div className="w-full max-w-[150px] h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${subject.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-indigo-600 font-bold ml-4">{subject.grade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h3 className="font-bold text-slate-800">AI Performance Insight</h3>
                </div>
                {!insight && (
                  <button 
                    onClick={handleGenerateInsight}
                    disabled={loadingInsight}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {loadingInsight ? 'Generating...' : 'Generate Insight'}
                  </button>
                )}
              </div>
              
              {insight ? (
                <div className="text-sm text-slate-600 italic leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-50">
                  "{insight}"
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {loadingInsight 
                    ? "Our AI is analyzing academic performance data... This takes a few seconds." 
                    : "Click the button to generate an AI-powered summary of this student's performance."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  </div>
);

export default StudentModal;
