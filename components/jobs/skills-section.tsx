"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { Skill } from "@/types/skill";

interface SkillsSectionProps {
  skills: Skill[];
  onUpdateSkills: (skills: Skill[]) => void;
}

export function SkillsSection({ skills, onUpdateSkills }: SkillsSectionProps) {
    return (
      <Card className="bg-black">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription className="text-zinc-400">Your Applied Skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills.map((skill) => (
              <Badge key={skill.skillname} variant="default" className="mr-2 mb-2 bg-zinc-400 text-zinc-800">
                {skill.skillname}
              </Badge>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => onUpdateSkills(skills)}
          >
            Update Skills
          </Button>
        </CardContent>
      </Card>
    );

    }