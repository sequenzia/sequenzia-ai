"use client";

import { motion } from "motion/react";
import { portfolioContent, type Skill } from "@/lib/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkillsProps {
  filter?: string;
}

export function Skills({ filter }: SkillsProps) {
  const skills = portfolioContent.skills;

  // Filter skills if filter is provided
  const filteredSkills = filter
    ? skills
        .map((category) => ({
          ...category,
          skills: category.skills.filter(
            (skill) =>
              skill.name.toLowerCase().includes(filter.toLowerCase()) ||
              category.name.toLowerCase().includes(filter.toLowerCase())
          ),
        }))
        .filter((category) => category.skills.length > 0)
    : skills;

  return (
    <div className="space-y-4">
      {/* Info bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <p className="text-muted-foreground text-sm">
          Technical proficiencies across different domains
        </p>
        {filter && <Badge variant="outline">Filtered: {filter}</Badge>}
      </motion.div>

      {/* Skills grid by category */}
      <div className="grid gap-4">
        {filteredSkills.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                {/* Category header */}
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CategoryIcon category={category.name} />
                  {category.name}
                </h3>

                {/* Skills */}
                <div className="grid gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <SkillRow
                      key={skill.name}
                      skill={skill}
                      index={skillIndex}
                      categoryIndex={categoryIndex}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground text-sm"
        >
          No skills found matching &quot;{filter}&quot;
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-muted-foreground"
      >
        <span>Levels:</span>
        <SkillLevelBadge level="beginner" />
        <SkillLevelBadge level="intermediate" />
        <SkillLevelBadge level="advanced" />
        <SkillLevelBadge level="expert" />
      </motion.div>
    </div>
  );
}

interface SkillRowProps {
  skill: Skill;
  index: number;
  categoryIndex: number;
}

function SkillRow({ skill, index, categoryIndex }: SkillRowProps) {
  const levelWidth = {
    beginner: "25%",
    intermediate: "50%",
    advanced: "75%",
    expert: "100%",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: categoryIndex * 0.1 + index * 0.03 + 0.1 }}
      className="flex items-center gap-3 py-1"
    >
      {/* Skill name */}
      <div className="w-24 sm:w-28 flex-shrink-0">
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: levelWidth[skill.level] }}
            transition={{
              delay: categoryIndex * 0.1 + index * 0.03 + 0.3,
              duration: 0.5,
            }}
            className={cn(
              "h-full rounded-full",
              skill.level === "beginner" && "bg-muted-foreground",
              skill.level === "intermediate" && "bg-blue-500",
              skill.level === "advanced" && "bg-green-500",
              skill.level === "expert" && "bg-amber-500"
            )}
          />
        </div>
      </div>

      {/* Level badge */}
      <div className="w-20 flex-shrink-0 text-right">
        <SkillLevelBadge level={skill.level} />
      </div>

      {/* Years */}
      {skill.yearsOfExperience && (
        <div className="w-10 flex-shrink-0 text-right text-xs text-muted-foreground">
          {skill.yearsOfExperience}y
        </div>
      )}
    </motion.div>
  );
}

function SkillLevelBadge({ level }: { level: Skill["level"] }) {
  const styles = {
    beginner: "bg-muted-foreground/20 text-muted-foreground",
    intermediate: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    advanced: "bg-green-500/20 text-green-600 dark:text-green-400",
    expert: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium capitalize",
        styles[level]
      )}
    >
      {level}
    </span>
  );
}

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, string> = {
    "Programming Languages": "💻",
    "Frontend Development": "🎨",
    "Backend & Infrastructure": "⚙️",
    "AI & Machine Learning": "🤖",
  };
  return <span>{icons[category] || "📚"}</span>;
}
