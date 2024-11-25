"use client";

import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Skill } from "@/app/skills/new/page";

interface SkillListProps {
  skills: Skill[];
  onDelete: (index: number) => void;
}

export function SkillList({ skills, onDelete }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-4">
        No skills added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-zinc-900 p-2 rounded-md bg-secondary/50"
        >
          <div className="flex items-center gap-2 ">
            <span>{skill.name}</span>
            <Badge
              variant={
                skill.level === "Expert"
                  ? "default"
                  : skill.level === "Intermediate"
                  ? "secondary"
                  : "outline"
              }
              className="bg-zinc-900 border-white"
            >
              {skill.level}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(index)}
            className="text-destructive hover:text-destructive/90 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}