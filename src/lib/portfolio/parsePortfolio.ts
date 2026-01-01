import type {
  PortfolioContent,
  BioContent,
  ExperienceItem,
  ProjectItem,
  EducationItem,
  SkillCategory,
  Skill,
  ContactInfo,
  SocialLink,
} from "./types";

/**
 * Parse the portfolio markdown file into typed content.
 */
export function parsePortfolioMarkdown(markdown: string): PortfolioContent {
  const sections = splitIntoSections(markdown);

  return {
    bio: parseBio(sections["Bio"] || ""),
    experience: parseExperience(sections["Experience"] || ""),
    projects: parseProjects(sections["Projects"] || ""),
    education: parseEducation(sections["Education"] || ""),
    skills: parseSkills(sections["Skills"] || ""),
    contact: parseContact(sections["Contact"] || "", sections["Bio"] || ""),
  };
}

function splitIntoSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = markdown.split("\n");
  let currentSection = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    const sectionMatch = line.match(/^## (.+)$/);
    if (sectionMatch) {
      if (currentSection) {
        sections[currentSection] = currentContent.join("\n").trim();
      }
      currentSection = sectionMatch[1];
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  return sections;
}

function parseKeyValue(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = text.split("\n");

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      result[match[1]] = match[2];
    }
  }

  return result;
}

function parseListItems(text: string): string[] {
  const items: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const match = line.match(/^- (.+)$/);
    if (match) {
      items.push(match[1]);
    }
  }

  return items;
}

function extractSubsection(text: string, header: string): string {
  const regex = new RegExp(`### ${header}\\n([\\s\\S]*?)(?=\\n###|\\n---\\n|$)`);
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractSubSubsection(text: string, header: string): string {
  const regex = new RegExp(
    `#### ${header}\\n([\\s\\S]*?)(?=\\n####|\\n###|\\n---\\n|$)`
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function parseSocialLinks(text: string): SocialLink[] {
  const links: SocialLink[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const match = line.match(/^- (\w+):\s*(.+)$/);
    if (match) {
      const platform = match[1];
      const url = match[2];
      links.push({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        url,
        icon: platform.toLowerCase(),
      });
    }
  }

  return links;
}

function parseBio(section: string): BioContent {
  const kv = parseKeyValue(section);
  const summarySection = extractSubsection(section, "Summary");
  const highlightsSection = extractSubsection(section, "Highlights");
  const socialSection = extractSubsection(section, "Social Links");

  // Extract summary text (first paragraph after the header)
  const summaryLines = summarySection
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"));
  const summary = summaryLines.join(" ").trim();

  return {
    name: kv["name"] || "",
    title: kv["title"] || "",
    location: kv["location"] || "",
    photoUrl: kv["photoUrl"] || "/images/profile.jpg",
    summary,
    highlights: parseListItems(highlightsSection),
    socialLinks: parseSocialLinks(socialSection),
  };
}

function parseExperience(section: string): ExperienceItem[] {
  const items: ExperienceItem[] = [];
  const entries = section.split(/\n---\n/).filter((e) => e.trim());

  for (const entry of entries) {
    const headerMatch = entry.match(/### ([\w-]+): (.+) at (.+)\n/);
    if (!headerMatch) continue;

    const id = headerMatch[1];
    const role = headerMatch[2];
    const company = headerMatch[3];

    const kv = parseKeyValue(entry);
    const achievementsSection = extractSubSubsection(entry, "Achievements");
    const techSection = extractSubSubsection(entry, "Technologies");

    // Extract description (paragraph after metadata, before ####)
    const lines = entry.split("\n");
    const descriptionLines: string[] = [];
    let inDescription = false;

    for (const line of lines) {
      if (line.startsWith("###") || line.match(/^\w+:/)) {
        inDescription = false;
        continue;
      }
      if (line.startsWith("####")) break;
      if (line.trim() && !inDescription) {
        inDescription = true;
      }
      if (inDescription && line.trim()) {
        descriptionLines.push(line.trim());
      }
    }

    const technologies = techSection
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    items.push({
      id,
      company,
      role,
      location: kv["location"] || "",
      startDate: kv["startDate"] || "",
      endDate: kv["endDate"] || "Present",
      description: descriptionLines.join(" "),
      achievements: parseListItems(achievementsSection),
      technologies,
      logoUrl: kv["logoUrl"],
    });
  }

  return items;
}

function parseProjects(section: string): ProjectItem[] {
  const items: ProjectItem[] = [];
  const entries = section.split(/\n---\n/).filter((e) => e.trim());

  for (const entry of entries) {
    const headerMatch = entry.match(/### ([\w-]+): (.+)\n/);
    if (!headerMatch) continue;

    const id = headerMatch[1];
    const name = headerMatch[2];

    const kv = parseKeyValue(entry);
    const techSection = extractSubSubsection(entry, "Technologies");

    // Extract description and long description
    const lines = entry.split("\n");
    let shortDesc = "";
    let longDesc = "";
    let foundFirstPara = false;
    let foundSecondPara = false;

    for (const line of lines) {
      if (
        line.startsWith("###") ||
        line.startsWith("####") ||
        line.match(/^\w+:/)
      ) {
        continue;
      }
      if (line.trim()) {
        if (!foundFirstPara) {
          shortDesc = line.trim();
          foundFirstPara = true;
        } else if (!foundSecondPara) {
          longDesc = line.trim();
          foundSecondPara = true;
          break;
        }
      }
    }

    const technologies = techSection
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    items.push({
      id,
      name,
      description: shortDesc,
      longDescription: longDesc || shortDesc,
      imageUrl: kv["imageUrl"] || "",
      technologies,
      category: kv["category"] || "",
      links: {
        live: kv["liveUrl"],
        github: kv["githubUrl"],
      },
      featured: kv["featured"] === "true",
      date: kv["date"] || "",
    });
  }

  return items;
}

function parseEducation(section: string): EducationItem[] {
  const items: EducationItem[] = [];
  const entries = section.split(/\n---\n/).filter((e) => e.trim());

  for (const entry of entries) {
    const headerMatch = entry.match(/### ([\w-]+): (.+)\n/);
    if (!headerMatch) continue;

    const id = headerMatch[1];
    const institution = headerMatch[2];

    const kv = parseKeyValue(entry);
    const honorsSection = extractSubSubsection(entry, "Honors");

    items.push({
      id,
      institution,
      degree: kv["degree"] || "",
      field: kv["field"] || "",
      startDate: kv["startDate"] || "",
      endDate: kv["endDate"] || "",
      gpa: kv["gpa"],
      honors: parseListItems(honorsSection),
      logoUrl: kv["logoUrl"],
    });
  }

  return items;
}

function parseSkills(section: string): SkillCategory[] {
  const categories: SkillCategory[] = [];
  const entries = section.split(/\n### /).filter((e) => e.trim());

  for (const entry of entries) {
    const lines = entry.split("\n");
    const categoryName = lines[0]?.trim();
    if (!categoryName) continue;

    const skills: Skill[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^- (.+):\s*(\w+),\s*(\d+)\s*years?$/);
      if (match) {
        skills.push({
          name: match[1],
          level: match[2] as Skill["level"],
          yearsOfExperience: parseInt(match[3], 10),
        });
      }
    }

    if (skills.length > 0) {
      categories.push({ name: categoryName, skills });
    }
  }

  return categories;
}

function parseContact(section: string, bioSection: string): ContactInfo {
  const kv = parseKeyValue(section);
  const socialSection = extractSubsection(section, "Social Links");
  const socialLinks = parseSocialLinks(socialSection);

  // If no social links in contact section, try bio section
  if (socialLinks.length === 0) {
    const bioSocialSection = extractSubsection(bioSection, "Social Links");
    const bioLinks = parseSocialLinks(bioSocialSection);
    socialLinks.push(...bioLinks);
  }

  // Add email as a social link if not already present
  const hasEmail = socialLinks.some(
    (l) => l.platform.toLowerCase() === "email"
  );
  if (!hasEmail && kv["email"]) {
    socialLinks.push({
      platform: "Email",
      url: `mailto:${kv["email"]}`,
      icon: "mail",
    });
  }

  return {
    email: kv["email"] || "",
    calendlyUrl: kv["calendlyUrl"],
    formEnabled: kv["formEnabled"] === "true",
    socialLinks,
  };
}
