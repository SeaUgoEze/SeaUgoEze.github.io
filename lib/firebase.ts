import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export interface PortfolioData {
  hero: {
    name: string;
    firstName: string;
    lastName: string;
    tagline: string;
    pills: string[];
    imageUrl: string;
  };
  about: {
    paragraphs: string[];
    asciiArt: string;
  };
  projects: {
    id: string;
    title: string;
    category: string;
    description: string;
    languages: string[];
    imageUrl: string;
    videoUrl: string;
    githubUrl: string;
    highlights: string[];
  }[];
  experience: {
    id: string;
    org: string;
    role: string;
    description: string;
    startDate: string;
    endDate: string;
  }[];
  skills: {
    id: string;
    name: string;
    category: string;
    icon: string;
  }[];
  leadership: {
    id: string;
    org: string;
    role: string;
    description: string;
  }[];
  contact: {
    email: string;
    github: string;
    githubUsername: string;
    linkedin: string;
    linkedinUsername: string;
    chips: string[];
  };
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const defaultData: PortfolioData = {
    hero: {
      name: "Sean Ezeocha",
      firstName: "Sean",
      lastName: "Ezeocha",
      tagline: "Computer Science Student · Queen's University",
      pills: ["Artificial Intelligence", "Backend Engineering", "Cybersecurity", "Full-Stack Dev"],
      imageUrl: "",
    },
    about: {
      paragraphs: [
        "I'm a first-year Bachelor of Computing student at Queen's University with a strong interest in artificial intelligence, backend systems, cybersecurity, and scalable software development.",
        "I enjoy building projects that combine technical problem-solving with real-world impact. My work ranges from AI-powered systems to interactive educational tools and collaborative hackathon projects.",
        "Beyond coding, I've been actively involved in student leadership through COMPSA, contributing to marketing and equity-focused programs within the computing community.",
        "I'm especially drawn to how technology can improve safety, accessibility, and human connection while remaining reliable and thoughtfully designed.",
      ],
      asciiArt: "",
    },
    projects: [
      {
        id: "1",
        title: "VigilDrive AI",
        category: "AI / ML",
        description: "An AI-powered driver vigilance system that analyzes behavioral patterns and improves road safety through intelligent real-time alert systems.",
        languages: ["Python", "AI / ML", "Data Analysis"],
        imageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/SeaUgoEze",
        highlights: ["94.2% testing accuracy achieved", "Reduced false alerts by 25%", "Python · ML pipeline · behavioral data"],
      },
      {
        id: "2",
        title: "SafeSpace",
        category: "Backend",
        description: "A collaborative anonymous support platform built at HackHer 2026, focused on mental health accessibility and secure peer communication.",
        languages: ["JavaScript", "APIs", "Backend"],
        imageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/SeaUgoEze",
        highlights: ["Full backend architecture and REST APIs", "Git-based collaborative development", "Secure anonymous session handling"],
      },
      {
        id: "3",
        title: "Binary Search Visualizer",
        category: "Algorithms",
        description: "An interactive educational tool that demonstrates binary search algorithms visually — built for learning, debugging intuition, and accessibility.",
        languages: ["Java", "Algorithms", "Visualization"],
        imageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/SeaUgoEze",
        highlights: ["Real-time step-by-step visualization", "Accessible educational UI/UX", "Built entirely in Java from scratch"],
      },
    ],
    experience: [
      { id: "1", org: "Queen's University · COMPSA", role: "Marketing Intern", description: "Supported digital outreach and student engagement initiatives for the Queen's computing community.", startDate: "", endDate: "" },
      { id: "2", org: "Queen's University · COMPSA", role: "EDII Intern", description: "Contributed to equity, diversity, inclusion, and accessibility initiatives shaping COMPSA's culture.", startDate: "", endDate: "" },
      { id: "3", org: "Saint John High School", role: "Founder — Better You Club", description: "Created a student-led initiative focused on personal growth, leadership, and mental health awareness.", startDate: "", endDate: "" },
    ],
    skills: [
      { id: "1", name: "Python", category: "Languages", icon: "🌿" },
      { id: "2", name: "AI / ML", category: "Technologies", icon: "🧠" },
      { id: "3", name: "JavaScript", category: "Languages", icon: "◈" },
      { id: "4", name: "Java", category: "Languages", icon: "⬡" },
      { id: "5", name: "Cybersecurity", category: "Domains", icon: "◉" },
      { id: "6", name: "Backend", category: "Technologies", icon: "⊕" },
      { id: "7", name: "Full-Stack", category: "Technologies", icon: "🌱" },
      { id: "8", name: "Git / GitHub", category: "Tools", icon: "✦" },
      { id: "9", name: "Data Analysis", category: "Technologies", icon: "◎" },
      { id: "10", name: "Leadership", category: "Soft Skills", icon: "✦" },
      { id: "11", name: "Outreach", category: "Soft Skills", icon: "◈" },
    ],
    leadership: [
      { id: "1", org: "Community", role: "YMCA Youth Soccer Volunteer", description: "Mentored youth athletes and promoted teamwork, confidence, and resilience on the field." },
      { id: "2", org: "Community", role: "Imperial Theatre Youth Corps", description: "Supported event coordination and audience operations during live theatre productions." },
    ],
    contact: {
      email: "seanezeocha@gmail.com",
      github: "https://github.com/SeaUgoEze",
      githubUsername: "github.com/SeaUgoEze",
      linkedin: "https://linkedin.com/in/seanezeocha",
      linkedinUsername: "linkedin.com/in/seanezeocha",
      chips: ["Internships", "Research Opportunities", "Startup Projects", "AI Collaboration", "Software Engineering"],
    },
  };

  try {
    const heroDoc = await getDoc(doc(db, "portfolio", "hero"));
    const aboutDoc = await getDoc(doc(db, "portfolio", "about"));
    const projectsDoc = await getDoc(doc(db, "portfolio", "projects"));
    const experienceDoc = await getDoc(doc(db, "portfolio", "experience"));
    const skillsDoc = await getDoc(doc(db, "portfolio", "skills"));
    const leadershipDoc = await getDoc(doc(db, "portfolio", "leadership"));
    const contactDoc = await getDoc(doc(db, "portfolio", "contact"));

    if (heroDoc.exists()) defaultData.hero = { ...defaultData.hero, ...heroDoc.data() };
    if (aboutDoc.exists()) defaultData.about = { ...defaultData.about, ...aboutDoc.data() };
    if (projectsDoc.exists()) defaultData.projects = projectsDoc.data().items || defaultData.projects;
    if (experienceDoc.exists()) defaultData.experience = experienceDoc.data().items || defaultData.experience;
    if (skillsDoc.exists()) defaultData.skills = skillsDoc.data().items || defaultData.skills;
    if (leadershipDoc.exists()) defaultData.leadership = leadershipDoc.data().items || defaultData.leadership;
    if (contactDoc.exists()) defaultData.contact = { ...defaultData.contact, ...contactDoc.data() };
  } catch (error) {
    console.log("Using default portfolio data (Firebase not configured or unreachable)");
  }

  return defaultData;
}

export { db };
