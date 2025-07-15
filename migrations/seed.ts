import { db } from "../server/db";
import { jobs } from "./0000_initial";

export async function seed() {
  const seedJobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      skills: ["React", "TypeScript", "Node.js"],
      description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies. We're looking for a passionate developer who can create exceptional user experiences and collaborate effectively with cross-functional teams.\n\nKey Responsibilities:\n• Develop responsive web applications using React and TypeScript\n• Collaborate with UI/UX designers to implement pixel-perfect designs\n• Optimize application performance and user experience\n• Write clean, maintainable, and well-documented code\n• Participate in code reviews and contribute to technical discussions\n\nRequirements:\n• 5+ years of experience in frontend development\n• Strong proficiency in React, TypeScript, and modern JavaScript\n• Experience with state management libraries (Redux, Context API)\n• Knowledge of RESTful APIs and GraphQL\n• Familiarity with testing frameworks (Jest, React Testing Library)"
    },
    {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Remote",
      salary: "$100k - $140k",
      skills: ["MongoDB", "Express.js", "React"],
      description: "Build scalable web applications from frontend to backend. Work with MongoDB, Express.js, React, and Node.js in a fast-paced startup environment.\n\nKey Responsibilities:\n• Design and develop full-stack web applications\n• Work with RESTful APIs and database design\n• Collaborate with product team on new features\n• Maintain code quality and best practices\n\nRequirements:\n• 3+ years of full-stack development experience\n• Proficiency in JavaScript, Node.js, and React\n• Experience with MongoDB and Express.js\n• Strong problem-solving skills\n• Ability to work independently in a remote environment"
    },
    {
      title: "Backend Developer",
      company: "DataFlow Solutions",
      location: "New York, NY",
      type: "Part-time",
      salary: "$80k - $100k",
      skills: ["PostgreSQL", "Python", "AWS"],
      description: "Develop robust APIs and database solutions using PostgreSQL, Python, and cloud technologies. Join our team working on data-intensive applications.\n\nKey Responsibilities:\n• Design and implement RESTful APIs\n• Optimize database queries and performance\n• Deploy and maintain applications on AWS\n• Collaborate with frontend developers\n\nRequirements:\n• 4+ years of backend development experience\n• Strong knowledge of PostgreSQL and Python\n• Experience with AWS cloud services\n• Understanding of API design principles\n• Experience with containerization (Docker)"
    }
  ];

  try {
    for (const jobData of seedJobs) {
      await db.insert(jobs).values(jobData);
    }
    console.log("✅ Seed data created successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

// Allow running from command line
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
