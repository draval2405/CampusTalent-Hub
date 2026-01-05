
import { StudentProfile, ExperienceLevel } from './types';

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun.s@iitb.ac.in',
    university: 'IIT Bombay',
    headline: 'Full Stack Developer | Competitive Programmer',
    skills: ['React', 'Node.js', 'MongoDB', 'Docker', 'Python'],
    experience_level: ExperienceLevel.ADVANCED,
    projects: [
      { title: 'DeFi Wallet', description: 'A secure crypto wallet with swap features.' },
      { title: 'Campus Social', description: 'Internal networking app for B-school students.' }
    ],
    availability: 'Looking for Teammates',
    avatar: 'https://picsum.photos/seed/arjun/200'
  },
  {
    id: '2',
    name: 'Priya Iyer',
    email: 'priya.iyer@bits-pilani.ac.in',
    university: 'BITS Pilani',
    headline: 'ML Engineer | Open Source Contributor',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'NLP', 'FastAPI'],
    experience_level: ExperienceLevel.ADVANCED,
    projects: [
      { title: 'Hate Speech Detection', description: 'Real-time multi-lingual classifier.' },
      { title: 'HealthAI', description: 'Diagnostic assistant for rural clinics.' }
    ],
    availability: 'Available',
    avatar: 'https://picsum.photos/seed/priya/200'
  },
  {
    id: '3',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@mitmanipal.edu',
    university: 'MIT Manipal',
    headline: 'UI/UX Designer | Frontend Enthusiast',
    skills: ['Figma', 'Adobe XD', 'Tailwind CSS', 'Framer Motion'],
    experience_level: ExperienceLevel.INTERMEDIATE,
    projects: [
      { title: 'E-Learning Platform', description: 'Minimalist LMS design system.' }
    ],
    availability: 'Busy',
    avatar: 'https://picsum.photos/seed/rohan/200'
  },
  {
    id: '4',
    name: 'Ananya Gupta',
    email: 'ananya.g@vit.ac.in',
    university: 'VIT Vellore',
    headline: 'Backend Architect | Cloud Computing',
    skills: ['Java', 'Spring Boot', 'AWS', 'PostgreSQL', 'Redis'],
    experience_level: ExperienceLevel.ADVANCED,
    projects: [
      { title: 'ScaleHub', description: 'Auto-scaling load balancer for microservices.' }
    ],
    availability: 'Looking for Teammates',
    avatar: 'https://picsum.photos/seed/ananya/200'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.s@iiit.ac.in',
    university: 'IIIT Hyderabad',
    headline: 'Mobile Dev | Flutter & React Native',
    skills: ['Dart', 'Flutter', 'Firebase', 'GraphQL'],
    experience_level: ExperienceLevel.INTERMEDIATE,
    projects: [
      { title: 'FitTrack', description: 'Fitness monitoring app with gamification.' }
    ],
    availability: 'Available',
    avatar: 'https://picsum.photos/seed/vikram/200'
  }
];

export const UNIVERSITY_LIST = [
  'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad', 'VIT Vellore', 'MIT Manipal', 'SRM University', 'Delhi Technological University'
];
