
export interface Student {
  id: string;
  name: string;
  fatherName: string;
  className: string;
  rollNumber: string;
  gpa: number;
  attendance: string;
  avatar: string;
  subjects: {
    name: string;
    grade: string;
    score: number;
  }[];
  dateOfBirth: string;
  contact: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  subject: string;
  joiningDate: string;
  contact: string;
  email: string;
  avatar: string;
  education: string;
}

export interface Homework {
  id: string;
  className: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface AppNotification {
  id: string;
  text: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  isRead: boolean;
}

export interface AppSettings {
  appName: string;
  appLogo: string;
}

export interface DashboardStats {
  totalStudents: number;
  averageGPA: number;
  attendanceRate: string;
  topPerformers: number;
}
