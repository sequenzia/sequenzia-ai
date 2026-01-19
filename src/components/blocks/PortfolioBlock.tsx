"use client";

import type { PortfolioContentData } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bio, Experience, Projects, Education, Skills, Contact } from "./portfolio";

interface PortfolioBlockProps {
  data: PortfolioContentData;
}

const viewTitles: Record<PortfolioContentData["viewType"], string> = {
  bio: "About Me",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  contact: "Contact",
};

export function PortfolioBlock({ data }: PortfolioBlockProps) {
  const renderView = () => {
    switch (data.viewType) {
      case "bio":
        return <Bio filter={data.filter} />;
      case "experience":
        return <Experience filter={data.filter} highlightId={data.highlightId} />;
      case "projects":
        return <Projects filter={data.filter} highlightId={data.highlightId} />;
      case "education":
        return <Education filter={data.filter} highlightId={data.highlightId} />;
      case "skills":
        return <Skills filter={data.filter} />;
      case "contact":
        return <Contact />;
      default:
        return null;
    }
  };

  // Bio view renders without header for cleaner presentation
  if (data.viewType === "bio") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-4">{renderView()}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{viewTitles[data.viewType]}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{renderView()}</CardContent>
    </Card>
  );
}
