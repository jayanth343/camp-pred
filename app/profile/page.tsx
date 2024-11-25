"use client";

import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/app/skills/new/page";

interface ResumeScannerProps {
  onSkillsDetected: (skills: Skill[]) => void;
  onAddSkill: (skill: Skill) => void;
  scannedSkills: Skill[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function ResumeScanner({ 
  onSkillsDetected, 
  onAddSkill, 
  scannedSkills 
}: ResumeScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setError("File must be a PDF or Word document");
      return;
    }

    setFile(selectedFile);
    await scanResume(selectedFile);
  };

  const scanResume = async (file: File) => {
    setScanning(true);
    try {
      // Here you would typically:
      // 1. Convert the file to text (using PDF.js or similar)
      // 2. Send the text to your Gemini API endpoint
      // 3. Process the response to extract skills

      // For demo purposes, simulating API response
      const mockSkills: Skill[] = [
        { name: "JavaScript", level: "Expert" },
        { name: "React", level: "Intermediate" },
        { name: "Node.js", level: "Intermediate" },
        { name: "Python", level: "Beginner" },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSkillsDetected(mockSkills);
    } catch (error) {
      setError("Failed to scan resume. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
        <label
          htmlFor="resume-upload"
          className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Upload className="h-4 w-4" />
          Choose Resume
        </label>
        {file && (
          <p className="mt-2 text-sm text-muted-foreground">{file.name}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scanning && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Scanning resume for skills...
        </div>
      )}

      {scannedSkills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Detected Skills</h3>
          <div className="space-y-2">
            {scannedSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-secondary/50 p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span>{skill.name}</span>
                  <Badge variant="secondary">{skill.level}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddSkill(skill)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}