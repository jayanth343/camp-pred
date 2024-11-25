"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types/profile";
import { Skill } from "@/types/skill";
import { CircularProgress } from "@mui/material";

interface ApplicationFormProps {
  isSubmitting: boolean;
  onSubmit: (data: { coverLetter: string; resumeFile: File }) => void;
  skills: Skill[] | null;
  profile: Profile | null;
}

export function ApplicationForm({
  isSubmitting,
  onSubmit,
  profile,
  skills,
}: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<boolean | null>(false);
  const [resumeFileData, setResumeFileData] = useState<Buffer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = () => {
    if (coverLetter.trim()) {
      console.log(coverLetter);
      onSubmit({ coverLetter,profile,skills });
    }
  };
  const handleResumeFile = () => {
    if (profile?.Resume) {
      setResumeFileData(profile.Resume);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setResumeFile(true);
    }
  };

  return (
    <>
      <Card className="bg-black">
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            Provide your resume and cover letter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Resume</label>
              <div className="flex items-center gap-4">
                {!resumeFile && !loading && !resumeFileData ? (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={handleResumeFile}
                >
                  <Upload className="h-4 w-4" />
                  Get from Database
                  </Button>
                ) : (
                  <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    
                    Resume.pdf
                  </Button>
                  </>
                )}
                {loading && (
                  <>
                    <CircularProgress size={20} /> Generating Resume...
                  </>
                )}

                  
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Cover Letter
              </label>
              <Textarea
                placeholder="Write a brief cover letter explaining why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="h-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">

        <Button
          onClick={handleSubmit}
          disabled={!coverLetter.trim() || !resumeFile}
          className="bg-white w-full text-black hover:bg-white/80"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </>
  );
}
