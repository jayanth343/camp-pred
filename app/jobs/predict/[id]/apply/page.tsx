"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { JobHeader } from "@/components/jobs/job-header";
import { ProfileSection } from "@/components/jobs/profile-section";
import { ApplicationForm } from "@/components/jobs/application-form";
import type { Job } from "@/types/job";
import type { Profile } from "@/types/profile";
import { useStore } from "@/pages/api/store";
import React from "react";
import { Navbar } from "@/components/navbar";
import { SkillsSection } from "@/components/jobs/skills-section";
import { Skill } from "@/types/skill";
// Mock data - in a real app, fetch this based on the ID


  export default  function ApplyPage({ params }: { params: Promise<{ id: string }>}) {
  
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const job:Job = JSON.parse(localStorage?.getItem('selectedJob') || '{}');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<any[]>([]);  
  const { id } = React.use(params);
  const user = useStore((state:any) => state.user);
  if (Object.keys(job).length === 0) {
    return (
    
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Job not found</h1>
          <Button onClick={() => router.back()} className="mt-4">
            Back
          </Button>
        </div>
      </div>
    );
  }
  const getProfile = async (userid: string) => {
    const res = await fetch(`/api/proapply`, {
      method: 'POST',
      body: JSON.stringify({ userid }),
    });
    const data = await res.json();
    setProfile(data?.profile);
    setSkills(data?.skills);
  };
  
  useEffect(() => {
    if(!profile){
      getProfile(user?.userid);
    }
  }, [user?.userid, profile]);

  if (!job || !profile || !skills) {
    return (
      <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-black rounded-md w-1/3 mb-4"></div>
            <div className="h-4 bg-black rounded-md w-1/2 mb-2"></div>
            <div className="h-4 bg-black rounded-md w-2/3 mb-8"></div>
            <div className="h-10 bg-black rounded-md w-full mb-4"></div>
            <div className="h-32 bg-black rounded-md w-full mb-4"></div>
            <div className="h-10 bg-black rounded-md w-1/2"></div>
          </div>
        </div>
      </div>
      </>
    );

  }
  const handleSubmit = async (data:any) => {
    setIsSubmitting(true);
    console.log("DATA:: \n", data);
    try {
      const res = await fetch(`/api/apply`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if(response?.status === 200){
      console.log("DATA:: \n", response);
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application Submitted",
        description: `Your application for ${job?.title} at ${job?.company_name} has been submitted successfully.`,
      });
      
      //router.push("/applications");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 bg-white text-black hover:bg-white/80"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-6">
          <JobHeader job={job} />
          {profile && (
          <ProfileSection
              profile={profile}
              onUpdateProfile={() => router.push("/profile")}
            />
          )}
          {skills && (
          <SkillsSection
              skills={skills}
              onUpdateSkills={() => router.push("/profile")}
            />
          )}
          <ApplicationForm
            isSubmitting={isSubmitting}
            profile={profile}
            skills={skills}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
    </>
  );
}