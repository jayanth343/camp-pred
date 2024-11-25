

import { useState } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";
import {Button} from "@nextui-org/react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/app/skills/new/page";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { useStore } from "../../pages/api/store";
interface ResumeScannerProps {
  onSkillsDetected: (skills: Skill[]) => void;
  onAddSkill: (skill: Skill) => void;
  scannedSkills: Skill[];
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export function ResumeScanner({ 
  onSkillsDetected, 
  onAddSkill, 
  scannedSkills 
}: ResumeScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [resume, setResume] = useState<Blob | null>(null);
  const user = useStore((state:any) => state.user);
  const getResume = async () => {
    console.log("Getting resume",user?.userid);
    setLoading(true);
    setScanning(true);
    try{
    const res = await fetch("/api/getresume", {
      method: "POST",
      body: user?.userid,
    });
    const data = await res.json();
    if(res.status === 200){
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(data.skills);
      onSkillsDetected(data.skills.skills);
    }else{
      return null;
    }
  }catch(error){
    setError("Failed to get resume. Please try again.");
  }finally {
    setScanning(false);
    setLoading(false);

  }
  }
  const onDelete = (index: number) => {
    const updatedSkills = scannedSkills.filter((_, i) => i !== index);
    onSkillsDetected(updatedSkills);
  };

  
  return (
    <div className="space-y-4">
      <div>
        <Button
          className="hidden"
          variant='bordered'
          id="resume-upload"
        />
        {!scanning && !loading ? (
          <Button onClick={getResume} className="w-full border rounded-md">Scan Resume</Button>
        ) : (
          <Button isLoading  className="w-full border rounded-md text-sm text-muted-foreground animate-pulse" spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }>Scanning For Skills...</Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}



      {scannedSkills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Detected Skills</h3>
          <div className="space-y-2">
            {scannedSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-zinc-900 p-2 rounded-md bg-secondary/50"
              >
                <div className="flex items-center gap-2">
                  <span>{skill.name}</span>
                  <Badge variant="secondary" className="bg-zinc-900 border-white">{skill.level}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddSkill(skill)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(index)}
                    className="text-destructive hover:text-destructive/90 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}