"use client";

import { motion } from "motion/react";
import { portfolioContent } from "@/lib/portfolio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExperienceProps {
  filter?: string;
  highlightId?: string;
}

export function Experience({ filter, highlightId }: ExperienceProps) {
  const allExperience = portfolioContent.experience;

  // Filter experience if filter is provided
  const experience = allExperience.filter((exp) => {
    if (!filter) return true;
    const filterLower = filter.toLowerCase();
    return (
      exp.company.toLowerCase().includes(filterLower) ||
      exp.role.toLowerCase().includes(filterLower) ||
      exp.technologies.some((t) => t.toLowerCase().includes(filterLower)) ||
      exp.description.toLowerCase().includes(filterLower)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filter badge if applicable */}
      {filter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <Badge variant="outline">Filtered: {filter}</Badge>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

        {/* Experience items */}
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={cn(
                "relative pl-8",
                highlightId === exp.id &&
                  "ring-2 ring-primary rounded-lg p-3 -ml-3 pl-11 bg-primary/5"
              )}
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-1.5 w-3 h-3 rounded-full border-2 border-background",
                  index === 0 ? "bg-primary" : "bg-muted-foreground/40"
                )}
              />

              {/* Content */}
              <div className="bg-card rounded-lg shadow-sm border border-border p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-primary font-medium text-sm">{exp.company}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>
                      {exp.startDate} - {exp.endDate}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span>{exp.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground/80 text-sm mb-3">{exp.description}</p>

                {/* Achievements */}
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-foreground mb-1.5">
                    Key Achievements
                  </h4>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + i * 0.03 + 0.2 }}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs px-1.5 py-0">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {experience.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground text-sm"
        >
          No experience found matching &quot;{filter}&quot;
        </motion.div>
      )}
    </div>
  );
}
