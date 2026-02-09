
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout.tsx';
import StudentModal from './components/StudentModal.tsx';
import HomeworkModal from './components/HomeworkModal.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import AttendancePanel from './components/AttendancePanel.tsx';
import TeacherPanel from './components/TeacherPanel.tsx';
import StudentFormModal from './components/StudentFormModal.tsx';
import TeacherFormModal from './components/TeacherFormModal.tsx';
import NotificationModal from './components/NotificationModal.tsx';
import Login from './components/Login.tsx';
import { MOCK_STUDENTS, MOCK_TEACHERS } from './constants.ts';
import { Student, Teacher, AttendanceRecord, AppNotification, AppSettings, Homework } from './types.ts';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [homeworks, setHomeworks] = useState<Homework[]>([
    {
      id: 'h1',
      className: 'KG-1',
      title: 'Mathematics Homework - Addition',
      description: 'Please complete the addition table from page 24 of your Math Workbook. Upload a photo of your work here tomorrow.',
      date: new Date().toLocaleDateString(),
      imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'h2',
      className: 'Play',
      title: 'Alphabet Drawing',
      description: 'Draw and color the letter "A" and "B" in your drawing book. Use bright colors and make sure it fills the entire page.',
      date: new Date().toLocaleDateString(),
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400'
    }
  ]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', text: "Welcome to EduPulse Academy Dashboard", time: "Just now", type: 'info', isRead: false },
  ]);
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appName: 'EduPulse Academy',
    appLogo: ''
  });
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTeacherFormOpen, setIsTeacherFormOpen] = useState(false);
  const [filterClass, setFilterClass] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const SCHOOL_CLASSES = ['All', 'Play', 'Nursery', 'KG-1', 'KG-2', 'KG-3', 'KG-4', 'KG-5'];

  const filteredHomeworks = useMemo(() => {
    if (filterClass === 'All') return homeworks;
    return homeworks.filter(h => h.className === filterClass);
  }, [homeworks, filterClass]);

  const stats = useMemo(() => {
    const total = students.length;
    const avgGpa = total > 0 ? students.reduce((acc, curr) => acc + curr.gpa, 0) / total : 0;
    const todayAttendance = attendanceRecords.filter(r => r.date === selectedDate && r.status === 'Present').length;
    return {
      total,
      avgGpa: avgGpa.toFixed(2),
      attendanceRate: total > 0 ? `${Math.round((todayAttendance / total) * 100)}%` : '0%',
      totalTeachers: teachers.length
    };
  }, [students, teachers, attendanceRecords, selectedDate]);

  const handleAddNotification = (text: string, type: 'info' | 'warning' | 'success') => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      time: "Just now",
      type,
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handlePostHomework = (homework: Homework) => {
    setHomeworks(prev => [homework, ...prev]);
    handleAddNotification(`New Homework posted for Class ${homework.className}`, 'success');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setSelectedNotification(notif);
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
  };

  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    } else {
      setStudents(prev => [student, ...prev]);
    }
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleBulkUploadStudents = (newStudents: Student[]) => {
    setStudents(prev => [...newStudents, ...prev]);
  };

  const handleSaveTeacher = (teacher: Teacher) => {
    if (editingTeacher) {
      setTeachers(prev => prev.map(t => t.id === teacher.id ? teacher : t));
    } else {
      setTeachers(prev => [teacher, ...prev]);
    }
    setIsTeacherFormOpen(false);
    setEditingTeacher(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Delete student record?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleDeleteAllStudents = () => {
    if (confirm('Delete all records?')) {
      setStudents([]);
    }
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm('Delete teacher?')) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleToggleAttendance = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendanceRecords(prev => {
      const existing = prev.find(r => r.studentId === studentId && r.date === selectedDate);
      if (existing) {
        return prev.map(r => (r.studentId === studentId && r.date === selectedDate) ? { ...r, status } : r);
      }
      return [...prev, { studentId, date: selectedDate, status }];
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if ((currentView === 'admin' || currentView === 'teachers') && !isAuthenticated) {
      return (
        <Login 
          onLogin={() => setIsAuthenticated(true)} 
          onCancel={() => setCurrentView('dashboard')} 
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            {/* Responsive Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              <StatCard label="Students" value={stats.total.toString()} icon="👥" trend="Active" color="bg-blue-600" />
              <StatCard label="Faculty" value={stats.totalTeachers.toString()} icon="👨‍🏫" trend="Teachers" color="bg-purple-600" />
              <StatCard label="Avg GPA" value={stats.avgGpa} icon="⭐" trend="Academic" color="bg-indigo-600" />
              <StatCard label="Attendance" value={stats.attendanceRate} icon="✅" trend="Today" color="bg-emerald-600" />
            </div>

            {/* Responsive Class Navigation */}
            <div className="bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 sm:mb-12 overflow-hidden">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Class Dashboard</h3>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
                  {SCHOOL_CLASSES.map(c => (
                    <button 
                      key={c}
                      onClick={() => setFilterClass(c)}
                      className={`px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 shrink-0 ${
                        filterClass === c 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 -translate-y-1' 
                          : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      {c === 'All' ? '🏠 Overview' : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Home Work Feed Grid */}
            <div className="space-y-6 sm:space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl sm:text-3xl font-black shadow-lg shadow-indigo-100">📝</div>
                  <div>
                    <h3 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">
                      {filterClass === 'All' ? 'Latest Homework' : `Class ${filterClass}`}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Academic tasks and assignments feed</p>
                  </div>
                </div>
              </div>

              {filteredHomeworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {filteredHomeworks.map(hw => (
                    <HomeworkCard key={hw.id} hw={hw} onReview={setSelectedHomework} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-12 sm:p-24 text-center border-2 border-dashed border-slate-100">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-6">📭</div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">No Assignments Found</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto font-medium">Tasks for Class {filterClass} will appear here once published.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <AdminPanel 
              students={students} 
              homeworks={homeworks}
              onPostHomework={handlePostHomework}
              appSettings={appSettings}
              onUpdateSettings={setAppSettings}
              onAdd={() => { setEditingStudent(null); setIsFormOpen(true); }}
              onEdit={(s) => { setEditingStudent(s); setIsFormOpen(true); }}
              onDelete={handleDeleteStudent}
              onDeleteAll={handleDeleteAllStudents}
              onBulkUpload={handleBulkUploadStudents}
              onPostAnnouncement={handleAddNotification}
            />
          </div>
        );
      case 'teachers':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <TeacherPanel 
              teachers={teachers}
              onAdd={() => { setEditingTeacher(null); setIsTeacherFormOpen(true); }}
              onEdit={(t) => { setEditingTeacher(t); setIsTeacherFormOpen(true); }}
              onDelete={handleDeleteTeacher}
            />
          </div>
        );
      case 'attendance':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <AttendancePanel 
              students={students}
              attendanceRecords={attendanceRecords}
              onToggleAttendance={handleToggleAttendance}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      notifications={notifications}
      appSettings={appSettings}
      onMarkRead={markAllRead}
      onNotificationClick={handleNotificationClick}
    >
      {renderContent()}

      <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      <HomeworkModal homework={selectedHomework} onClose={() => setSelectedHomework(null)} />
      
      {selectedNotification && (
        <NotificationModal 
          notification={selectedNotification} 
          onClose={() => setSelectedNotification(null)} 
        />
      )}

      {isFormOpen && (
        <StudentFormModal 
          student={editingStudent}
          onClose={() => { setIsFormOpen(false); setEditingStudent(null); }}
          onSave={handleSaveStudent}
        />
      )}

      {isTeacherFormOpen && (
        <TeacherFormModal 
          teacher={editingTeacher}
          onClose={() => { setIsTeacherFormOpen(false); setEditingTeacher(null); }}
          onSave={handleSaveTeacher}
        />
      )}

      {isAuthenticated && (currentView === 'admin' || currentView === 'teachers') && (
        <button 
          onClick={handleLogout}
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-2xl transition-all z-50 group hover:scale-110 active:scale-95 flex items-center justify-center"
        >
          <span className="text-xl">🚪</span>
        </button>
      )}
    </Layout>
  );
};

interface HomeworkCardProps {
  hw: Homework;
  onReview: (hw: Homework) => void;
}

const HomeworkCard: React.FC<HomeworkCardProps> = ({ hw, onReview }) => (
  <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group border-b-4 border-b-indigo-500 flex flex-col h-full hover:-translate-y-1 duration-300">
    {hw.imageUrl && (
      <div className="h-44 sm:h-56 overflow-hidden relative cursor-pointer" onClick={() => onReview(hw)}>
        <img src={hw.imageUrl} alt={hw.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-indigo-600 shadow-sm border border-white/50">Task</div>
        <div className="absolute bottom-4 left-4">
           <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">{hw.className}</span>
        </div>
      </div>
    )}
    <div className="p-6 sm:p-8 flex flex-col flex-1">
      {!hw.imageUrl && (
        <div className="flex items-center gap-2 mb-4">
           <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">{hw.className}</span>
        </div>
      )}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
        <span>📅 {hw.date}</span>
      </div>
      <h4 className="text-lg sm:text-xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight cursor-pointer line-clamp-2" onClick={() => onReview(hw)}>{hw.title}</h4>
      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 flex-1 line-clamp-3 font-medium">{hw.description}</p>
      
      <div className="flex justify-between items-center pt-5 sm:pt-6 border-t border-slate-50 mt-auto">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] shadow-sm">👤</div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] text-indigo-600 font-bold shadow-sm">S</div>
        </div>
        <button 
          onClick={() => onReview(hw)}
          className="text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
        >
          Details View
        </button>
      </div>
    </div>
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, color }) => (
  <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start justify-between hover:shadow-xl hover:-translate-y-1 transition-all group gap-3 sm:gap-0">
    <div className="min-w-0 text-center sm:text-left">
      <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
      <h3 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 sm:mt-3">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <p className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{trend}</p>
      </div>
    </div>
    <div className={`w-10 h-10 sm:w-14 sm:h-14 shrink-0 ${color} rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl text-white shadow-lg group-hover:rotate-12 transition-transform`}>
      {icon}
    </div>
  </div>
);

export default App;
