
import { Student, Teacher } from './types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Alexander Pierce',
    fatherName: 'Robert Pierce',
    className: 'KG-1',
    rollNumber: '101',
    gpa: 3.92,
    attendance: '95%',
    avatar: 'https://picsum.photos/seed/alex/200',
    dateOfBirth: '2018-05-12',
    contact: '+880 1711-123456',
    subjects: [
      { name: 'Bangla', grade: 'A', score: 94 },
      { name: 'English', grade: 'A', score: 91 },
      { name: 'Math', grade: 'B+', score: 88 }
    ]
  },
  {
    id: '2',
    name: 'Sophia Rahman',
    fatherName: 'Anisur Rahman',
    className: 'Nursery',
    rollNumber: '202',
    gpa: 4.0,
    attendance: '98%',
    avatar: 'https://picsum.photos/seed/sophia/200',
    dateOfBirth: '2019-02-28',
    contact: '+880 1812-234567',
    subjects: [
      { name: 'Drawing', grade: 'A+', score: 100 },
      { name: 'Rhymes', grade: 'A+', score: 98 },
      { name: 'General Knowledge', grade: 'A', score: 96 }
    ]
  },
  {
    id: '3',
    name: 'Arif Ahmed',
    fatherName: 'Belal Ahmed',
    className: 'Play',
    rollNumber: '305',
    gpa: 3.45,
    attendance: '89%',
    avatar: 'https://picsum.photos/seed/arif/200',
    dateOfBirth: '2020-11-15',
    contact: '+880 1913-345678',
    subjects: [
      { name: 'Alphabet', grade: 'B', score: 82 },
      { name: 'Counting', grade: 'B+', score: 87 },
      { name: 'Games', grade: 'A', score: 92 }
    ]
  },
  {
    id: '4',
    name: 'Tania Akter',
    fatherName: 'Faruk Hossain',
    className: 'KG-5',
    rollNumber: '501',
    gpa: 3.85,
    attendance: '92%',
    avatar: 'https://picsum.photos/seed/tania/200',
    dateOfBirth: '2014-03-10',
    contact: '+880 1614-456789',
    subjects: [
      { name: 'Social Science', grade: 'A', score: 89 },
      { name: 'Religion', grade: 'A+', score: 95 },
      { name: 'General Science', grade: 'A-', score: 82 }
    ]
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Ms. Farhana Yesmin',
    designation: 'Senior Teacher',
    subject: 'English & Arts',
    joiningDate: '2015-08-20',
    contact: '+880 1511-987654',
    email: 'farhana.y@edupulse.edu',
    avatar: 'https://picsum.photos/seed/farhana/200',
    education: 'M.A. in English'
  },
  {
    id: 't2',
    name: 'Mr. Kamrul Hasan',
    designation: 'Mathematics Teacher',
    subject: 'Math & Logic',
    joiningDate: '2018-03-12',
    contact: '+880 1712-876543',
    email: 'kamrul.h@edupulse.edu',
    avatar: 'https://picsum.photos/seed/kamrul/200',
    education: 'B.Sc. in Mathematics'
  }
];
