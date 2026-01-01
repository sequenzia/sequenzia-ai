"use client";

import { motion } from "motion/react";
import { portfolioContent } from "@/lib/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EducationProps {
  filter?: string;
  highlightId?: string;
}

export function Education({ filter, highlightId }: EducationProps) {
  const allEducation = portfolioContent.education;

  // Filter education if filter is provided
  const education = allEducation.filter((edu) => {
    if (!filter) return true;
    const filterLower = filter.toLowerCase();
    return (
      edu.institution.toLowerCase().includes(filterLower) ||
      edu.degree.toLowerCase().includes(filterLower) ||
      edu.field.toLowerCase().includes(filterLower) ||
      (edu.honors?.some((h) => h.toLowerCase().includes(filterLower)) ?? false)
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

      {/* Education cards */}
      <div className="space-y-4">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                highlightId === edu.id && "ring-2 ring-primary"
              )}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  {/* Institution icon placeholder */}
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0">
                    🎓
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {edu.institution}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {edu.degree} in {edu.field}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>
                        {edu.startDate} - {edu.endDate}
                      </span>
                      {edu.gpa && (
                        <>
                          <span>·</span>
                          <span>GPA: {edu.gpa}</span>
                        </>
                      )}
                    </div>

                    {/* Honors */}
                    {edu.honors && edu.honors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {edu.honors.map((honor, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + i * 0.05 + 0.2 }}
                          >
                            <Badge
                              variant="secondary"
                              className="text-xs px-1.5 py-0"
                            >
                              {honor}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {education.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground text-sm"
        >
          No education found matching &quot;{filter}&quot;
        </motion.div>
      )}
    </div>
  );
}
