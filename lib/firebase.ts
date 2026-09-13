import { initializeApp, getApps } from "firebase/app"
import { getFirestore, doc, getDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export interface PortfolioEntry {
  id: string
  title: string
  label: string
  body: string
  tags: string[]
  imageUrl: string
  url: string
  order: number
  mediaType?: "movie" | "show"
  rating?: number
}

export interface PortfolioSection {
  id: string
  title: string
  slug: string
  intro: string
  visible: boolean
  order: number
  entries: PortfolioEntry[]
}

export interface PortfolioData {
  hero: { name: string; firstName: string; lastName: string; tagline: string; pills: string[]; backgroundArt: string }
  about: { paragraphs: string[]; portraitUrl: string; quote: string }
  projects: LegacyProject[]
  experience: LegacyExperience[]
  skills: LegacySkill[]
  leadership: LegacyLeadership[]
  contact: LegacyContact
  resume: { url: string; fileName: string; updatedAt?: number }
  sections: PortfolioSection[]
}

interface LegacyProject {
  id: string; title: string; category: string; description: string; languages: string[]; imageUrl: string; videoUrl: string; githubUrl: string; highlights: string[]; location?: { x: number; y: number; region: string }
}
interface LegacyExperience { id: string; org: string; role: string; description: string; startDate: string; endDate: string }
interface LegacySkill { id: string; name: string; category: string; icon: string }
interface LegacyLeadership { id: string; org: string; role: string; description: string }
interface LegacyContact { email: string; github: string; githubUsername: string; linkedin: string; linkedinUsername: string; chips: string[] }

function entry(id: string, title: string, label: string, body: string, tags: string[], url = "", imageUrl = "", order = 0, mediaType?: "movie" | "show", rating?: number): PortfolioEntry {
  return { id, title, label, body, tags, url, imageUrl, order, mediaType, rating }
}

function legacySections(data: Omit<PortfolioData, "sections">): PortfolioSection[] {
  return [
    { id: "projects", title: "Projects", slug: "projects", intro: "Selected work shaped by curiosity, utility, and the discipline of making things clear.", visible: true, order: 1, entries: data.projects.map((p, i) => entry(p.id, p.title, p.category, p.description, p.languages, p.githubUrl, p.imageUrl, i)) },
    { id: "experience", title: "Experience", slug: "experience", intro: "Places where I have learned to work with people, constraints, and responsibility.", visible: true, order: 2, entries: data.experience.map((item, i) => entry(item.id, item.role, item.org, item.description, [item.startDate, item.endDate].filter(Boolean), "", "", i)) },
    { id: "education", title: "Education", slug: "education", intro: "The formal and informal study behind the work.", visible: true, order: 3, entries: [entry("queen's", "Bachelor of Computing", "Queen's University", "Studying computer science with a focus on artificial intelligence, backend systems, cybersecurity, and thoughtful software development.", ["Computer Science", "Artificial Intelligence"], "", "", 0)] },{ id: "research", title: "Research", slug: "research", intro: "", visible: true, order: 4, entries: [] },
    { id: "skills", title: "Skills", slug: "skills", intro: "Tools and practices I use to move an idea from question to working software.", visible: true, order: 5, entries: data.skills.map((item, i) => entry(item.id, item.name, item.category, `A working part of my toolkit across ${item.category.toLowerCase()}.`, [], "", "", i)) },
    { id: "leadership", title: "Leadership", slug: "leadership", intro: "Community work that has taught me to listen, organize, and make room for others.", visible: true, order: 6, entries: data.leadership.map((item, i) => entry(item.id, item.role, item.org, item.description, [], "", "", i)) },
    { id: "about", title: "About", slug: "about", intro: "A little context behind the person making the work.", visible: true, order: 7, entries: data.about.paragraphs.map((paragraph, i) => entry(`about-${i}`, i === 0 ? "A short introduction" : `Notes, ${i + 1}`, "About me", paragraph, [], "", i === 0 ? data.about.portraitUrl : "", i)) },
    { id: "resume", title: "Resume", slug: "resume", intro: "A current record of experience, study, and the work I am ready to take on next.", visible: true, order: 8, entries: [entry("resume", "Curriculum vitae", data.resume.fileName || "PDF resume", "", [], data.resume.url, "", 0)] },
    { id: "watchlist", title: "Watchlist", slug: "watchlist", intro: "Films and series that stayed with me, scored for the next rewatch.", visible: true, order: 9, entries: [
      entry("spirited-away", "Spirited Away", "Movie · Hayao Miyazaki", "A dreamlike coming-of-age story with an unmatched sense of wonder and detail.", ["Animation", "Fantasy"], "", "", 0, "movie", 5),
      entry("the-bear", "The Bear", "TV show · Christopher Storer", "A tense, tender study of craft, grief, and the people who make a kitchen feel like home.", ["Drama", "Comedy"], "", "", 1, "show", 4),
      entry("interstellar", "Interstellar", "Movie · Christopher Nolan", "Big questions about time, distance, and love told with spectacular ambition.", ["Science fiction", "Drama"], "", "", 2, "movie", 5),
      entry("severance", "Severance", "TV show · Dan Erickson", "A beautifully strange workplace mystery with immaculate production design and patience.", ["Mystery", "Thriller"], "", "", 3, "show", 4),
    ] },
    { id: "contact", title: "Contact", slug: "contact", intro: "For internships, research opportunities, collaborations, and good questions.", visible: true, order: 9, entries: [entry("contact", "Send a message", data.contact.email, "I am always glad to hear from people building useful things. Reach me by email or find my work online.", data.contact.chips, `mailto:${data.contact.email}`, "", 0)] },
  ]
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const data: Omit<PortfolioData, "sections"> = {
    hero: { name: "Sean Ezeocha", firstName: "Sean", lastName: "Ezeocha", tagline: "Computer Science Student · Queen's University", pills: ["Artificial Intelligence", "Backend Engineering", "Cybersecurity", "Full-Stack Dev"], backgroundArt: "" },
    about: { paragraphs: ["I'm a first-year Bachelor of Computing student at Queen's University with a strong interest in artificial intelligence, backend systems, cybersecurity, and scalable software development.", "I enjoy building projects that combine technical problem-solving with real-world impact. My work ranges from AI-powered systems to interactive educational tools and collaborative hackathon projects.", "Beyond coding, I've been actively involved in student leadership through COMPSA, contributing to marketing and equity-focused programs within the computing community."], portraitUrl: "", quote: "" },
    projects: [
      { id: "1", title: "VigilDrive AI", category: "AI / ML", description: "An AI-powered driver vigilance system that analyzes behavioral patterns and improves road safety through intelligent real-time alert systems.", languages: ["Python", "AI / ML", "Data Analysis"], imageUrl: "", videoUrl: "", githubUrl: "https://github.com/SeaUgoEze", highlights: [] },
      { id: "2", title: "SafeSpace", category: "Backend", description: "A collaborative anonymous support platform built at HackHer 2026, focused on mental health accessibility and secure peer communication.", languages: ["JavaScript", "APIs", "Backend"], imageUrl: "", videoUrl: "", githubUrl: "https://github.com/SeaUgoEze", highlights: [] },
      { id: "3", title: "Binary Search Visualizer", category: "Algorithms", description: "An interactive educational tool that demonstrates binary search algorithms visually.", languages: ["Java", "Algorithms", "Visualization"], imageUrl: "", videoUrl: "", githubUrl: "https://github.com/SeaUgoEze", highlights: [] },
    ],
    experience: [{ id: "1", org: "Queen's University · COMPSA", role: "Marketing Intern", description: "Supported digital outreach and student engagement initiatives for the Queen's computing community.", startDate: "", endDate: "" }, { id: "2", org: "Queen's University · COMPSA", role: "EDII Intern", description: "Contributed to equity, diversity, inclusion, and accessibility initiatives.", startDate: "", endDate: "" }],
    skills: ["Python", "AI / ML", "JavaScript", "Java", "Cybersecurity", "Backend", "Full-Stack", "Git / GitHub", "Data Analysis", "Leadership", "Outreach"].map((name, i) => ({ id: String(i + 1), name, category: i < 4 ? "Languages" : "Practice", icon: "" })),
    leadership: [{ id: "1", org: "Community", role: "YMCA Youth Soccer Volunteer", description: "Mentored youth athletes and promoted teamwork, confidence, and resilience." }, { id: "2", org: "Community", role: "Imperial Theatre Youth Corps", description: "Supported event coordination and audience operations during live theatre productions." }],
    contact: { email: "seanezeocha@gmail.com", github: "https://github.com/SeaUgoEze", githubUsername: "github.com/SeaUgoEze", linkedin: "https://linkedin.com/in/seanezeocha", linkedinUsername: "linkedin.com/in/seanezeocha", chips: ["Internships", "Research Opportunities", "Startup Projects", "AI Collaboration"] },
    resume: { url: "", fileName: "", updatedAt: 0 },
  }

  try {
    const sectionDoc = await getDoc(doc(db, "portfolio", "sections"))
    const names = ["hero", "about", "projects", "experience", "skills", "leadership", "contact", "resume"]
    const docs = await Promise.all(names.map((name) => getDoc(doc(db, "portfolio", name))))
    docs.forEach((snapshot, index) => {
      if (!snapshot.exists()) return
      const name = names[index]
      const value = snapshot.data()
      if (["projects", "experience", "skills", "leadership"].includes(name)) {
        ;(data as any)[name] = Array.isArray(value.items) ? value.items : (data as any)[name]
      } else {
        ;(data as any)[name] = { ...(data as any)[name], ...value }
      }
    })
    const fallbackSections = legacySections(data)
    const sections = sectionDoc.exists() && Array.isArray(sectionDoc.data().items) ? sectionDoc.data().items : fallbackSections
    const withResume = sections.some((section: PortfolioSection) => section.id === "resume")
      ? sections.map((section: PortfolioSection) => section.id === "resume" ? { ...section, entries: [fallbackSections.find((item) => item.id === "resume")!.entries[0]] } : section)
      : [...sections, fallbackSections.find((section) => section.id === "resume")!]
    const withWatchlist = withResume.some((section: PortfolioSection) => section.id === "watchlist")
      ? withResume
      : [...withResume, fallbackSections.find((section) => section.id === "watchlist")!]
    return { ...data, sections: withWatchlist.map((section: PortfolioSection, index: number) => ({ ...section, order: section.order ?? index, visible: section.visible !== false, entries: (section.entries || []).filter((item: PortfolioEntry) => !(section.id === "research" && item.id === "research-interests")).map((item: PortfolioEntry, entryIndex: number) => ({ ...item, label: item.label || "", body: item.body || "", tags: item.tags || [], imageUrl: item.imageUrl || "", url: item.url || "", order: item.order ?? entryIndex })) })).sort((a: PortfolioSection, b: PortfolioSection) => a.order - b.order) }
  } catch {
    return { ...data, sections: legacySections(data) }
  }
}

export { db }
