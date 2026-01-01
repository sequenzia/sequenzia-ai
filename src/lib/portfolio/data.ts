import type { PortfolioContent } from "./types";

/**
 * Pre-parsed portfolio data.
 * This is a static export that can be imported by both client and server code.
 * To update this data, edit src/content/portfolio.md and run the parse script,
 * or manually update the values below.
 */
export const portfolioContent: PortfolioContent = {
  bio: {
    name: "Alex Johnson",
    title: "Senior Full-Stack Engineer",
    location: "San Francisco, CA",
    photoUrl: "/images/profile.jpg",
    summary:
      "Passionate software engineer with 8+ years of experience building scalable web applications and AI-powered systems. I specialize in React, TypeScript, and distributed systems, with a focus on creating intuitive user experiences that delight users and drive business results.",
    highlights: [
      "Led development of AI systems processing 1M+ requests daily",
      "Open source contributor with 5k+ GitHub stars across projects",
      "Speaker at ReactConf 2024 and AI Summit 2023",
      "Expertise in system design and microservices architecture",
    ],
    socialLinks: [
      {
        platform: "Github",
        url: "https://github.com/alexjohnson",
        icon: "github",
      },
      {
        platform: "Linkedin",
        url: "https://linkedin.com/in/alexjohnson",
        icon: "linkedin",
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/alexjohnson",
        icon: "twitter",
      },
    ],
  },
  experience: [
    {
      id: "exp-1",
      company: "TechCorp AI",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "Present",
      description:
        "Leading development of AI-powered features for enterprise customers, architecting scalable inference systems that handle millions of requests.",
      achievements: [
        "Reduced inference latency by 40% through model optimization and intelligent caching strategies",
        "Architected microservices migration serving 10M daily active users with 99.9% uptime",
        "Mentored team of 5 engineers on AI/ML best practices and modern frontend development",
        "Led implementation of real-time streaming responses, improving user engagement by 25%",
      ],
      technologies: [
        "Python",
        "TypeScript",
        "React",
        "Kubernetes",
        "TensorFlow",
        "PostgreSQL",
      ],
      logoUrl: "/images/logos/techcorp.png",
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      role: "Full-Stack Engineer",
      location: "Remote",
      startDate: "2019-06",
      endDate: "2021-12",
      description:
        "Built core platform features for a B2B SaaS product from the ground up, handling everything from database design to frontend implementation.",
      achievements: [
        "Designed and implemented real-time collaboration features used by 50k+ users",
        "Reduced page load times by 60% through code splitting, lazy loading, and CDN optimization",
        "Established CI/CD pipeline reducing deployment time from hours to under 10 minutes",
        "Built analytics dashboard that increased customer retention by tracking key metrics",
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "Redis", "AWS", "Docker"],
      logoUrl: "/images/logos/startupxyz.png",
    },
    {
      id: "exp-3",
      company: "WebAgency Co",
      role: "Frontend Developer",
      location: "New York, NY",
      startDate: "2016-08",
      endDate: "2019-05",
      description:
        "Developed responsive web applications for diverse clients across e-commerce, healthcare, and finance industries.",
      achievements: [
        "Delivered 20+ client projects on time and within budget, generating $2M+ in revenue",
        "Introduced component-based architecture improving code reuse by 50%",
        "Led accessibility initiatives achieving WCAG AA compliance across all projects",
        "Trained junior developers on React best practices and modern CSS techniques",
      ],
      technologies: ["JavaScript", "React", "Vue.js", "SCSS", "Webpack", "Jest"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "AI Assistant Platform",
      description:
        "Enterprise conversational AI platform with custom training capabilities",
      longDescription:
        "Built a full-stack platform enabling enterprises to deploy custom AI assistants trained on their own data. Features include a fine-tuning interface for domain-specific training, comprehensive conversation analytics, and multi-channel deployment options (web widget, Slack, Microsoft Teams). The platform processes over 500k conversations monthly with 95% user satisfaction.",
      imageUrl: "/images/projects/ai-platform.png",
      technologies: [
        "React",
        "Python",
        "FastAPI",
        "LangChain",
        "PostgreSQL",
        "Redis",
        "Docker",
      ],
      category: "ai",
      links: {
        live: "https://aiplatform.example.com",
        github: "https://github.com/alexjohnson/ai-platform",
      },
      featured: true,
      date: "2024",
    },
    {
      id: "proj-2",
      name: "Real-time Collaboration SDK",
      description:
        "Open-source library for adding real-time collaboration to any application",
      longDescription:
        "Created a WebSocket-based SDK that provides conflict-free replicated data types (CRDTs) for building collaborative applications. The library handles complex synchronization scenarios including offline support, presence indicators, and cursor tracking. Now used by 500+ projects and has received contributions from developers at major tech companies.",
      imageUrl: "/images/projects/collab-sdk.png",
      technologies: ["TypeScript", "WebSockets", "Yjs", "Redis", "Node.js"],
      category: "open-source",
      links: {
        github: "https://github.com/alexjohnson/collab-sdk",
      },
      featured: true,
      date: "2023",
    },
    {
      id: "proj-3",
      name: "DevOps Dashboard",
      description: "Unified monitoring and deployment dashboard for microservices",
      longDescription:
        "A comprehensive dashboard integrating metrics from Kubernetes, Prometheus, and CI/CD pipelines. Provides real-time health monitoring, automated alerting, and one-click deployments with rollback capabilities. Reduced mean time to recovery (MTTR) by 40% for the engineering team.",
      imageUrl: "/images/projects/devops-dash.png",
      technologies: [
        "React",
        "Go",
        "Kubernetes",
        "Prometheus",
        "Grafana",
        "PostgreSQL",
      ],
      category: "devops",
      links: {
        live: "https://devops-demo.example.com",
      },
      featured: false,
      date: "2023",
    },
    {
      id: "proj-4",
      name: "E-commerce Mobile App",
      description: "Cross-platform mobile shopping experience with AR try-on features",
      longDescription:
        "Developed a React Native e-commerce application featuring augmented reality product visualization, personalized recommendations powered by ML, and a seamless checkout experience. The app achieved a 4.8-star rating and 100k+ downloads within the first quarter.",
      imageUrl: "/images/projects/ecommerce-app.png",
      technologies: [
        "React Native",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "ARKit",
        "TensorFlow Lite",
      ],
      category: "mobile",
      links: {
        live: "https://apps.apple.com/example",
      },
      featured: false,
      date: "2022",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science (AI Specialization)",
      startDate: "2014",
      endDate: "2016",
      honors: [
        "Research Assistant in NLP Lab",
        "Published 2 papers on neural language models",
      ],
      logoUrl: "/images/logos/stanford.png",
    },
    {
      id: "edu-2",
      institution: "UC Berkeley",
      degree: "Bachelor of Science",
      field: "Electrical Engineering and Computer Science",
      startDate: "2010",
      endDate: "2014",
      gpa: "3.8",
      honors: [
        "Magna Cum Laude",
        "Tau Beta Pi Engineering Honor Society",
        "Dean's List",
      ],
      logoUrl: "/images/logos/berkeley.png",
    },
  ],
  skills: [
    {
      name: "Programming Languages",
      skills: [
        { name: "TypeScript", level: "expert", yearsOfExperience: 6 },
        { name: "Python", level: "expert", yearsOfExperience: 8 },
        { name: "JavaScript", level: "expert", yearsOfExperience: 8 },
        { name: "Go", level: "advanced", yearsOfExperience: 3 },
        { name: "Rust", level: "intermediate", yearsOfExperience: 1 },
        { name: "SQL", level: "advanced", yearsOfExperience: 7 },
      ],
    },
    {
      name: "Frontend Development",
      skills: [
        { name: "React", level: "expert", yearsOfExperience: 6 },
        { name: "Next.js", level: "expert", yearsOfExperience: 4 },
        { name: "Tailwind CSS", level: "expert", yearsOfExperience: 3 },
        { name: "Framer Motion", level: "advanced", yearsOfExperience: 2 },
        { name: "React Native", level: "advanced", yearsOfExperience: 2 },
        { name: "Vue.js", level: "intermediate", yearsOfExperience: 2 },
      ],
    },
    {
      name: "Backend & Infrastructure",
      skills: [
        { name: "Node.js", level: "expert", yearsOfExperience: 6 },
        { name: "PostgreSQL", level: "expert", yearsOfExperience: 6 },
        { name: "Kubernetes", level: "advanced", yearsOfExperience: 4 },
        { name: "Redis", level: "advanced", yearsOfExperience: 4 },
        { name: "AWS", level: "advanced", yearsOfExperience: 5 },
        { name: "Docker", level: "expert", yearsOfExperience: 5 },
      ],
    },
    {
      name: "AI & Machine Learning",
      skills: [
        { name: "LLM Integration", level: "expert", yearsOfExperience: 2 },
        { name: "Prompt Engineering", level: "expert", yearsOfExperience: 2 },
        { name: "LangChain", level: "advanced", yearsOfExperience: 1 },
        { name: "TensorFlow", level: "intermediate", yearsOfExperience: 3 },
        { name: "PyTorch", level: "intermediate", yearsOfExperience: 2 },
        { name: "RAG Systems", level: "advanced", yearsOfExperience: 1 },
      ],
    },
  ],
  contact: {
    email: "alex@example.com",
    calendlyUrl: "https://calendly.com/alexjohnson/30min",
    formEnabled: true,
    socialLinks: [
      {
        platform: "Github",
        url: "https://github.com/alexjohnson",
        icon: "github",
      },
      {
        platform: "Linkedin",
        url: "https://linkedin.com/in/alexjohnson",
        icon: "linkedin",
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/alexjohnson",
        icon: "twitter",
      },
      {
        platform: "Email",
        url: "mailto:alex@example.com",
        icon: "mail",
      },
    ],
  },
};
