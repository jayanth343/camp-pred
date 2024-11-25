"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillList } from "@/components/skills/skill-list";
import { ResumeScanner } from "@/components/skills/resume-scanner";
import { useStore } from "../../../pages/api/store";
const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["Beginner", "Intermediate", "Expert", "Advanced"], {
    required_error: "Please select a skill level",
  }),
});

const formSchema = z.object({
  skill: skillSchema,
});

export type Skill = z.infer<typeof skillSchema>;

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [scannedSkills, setScannedSkills] = useState<Skill[]>([]);
  const user = useStore((state:any) => state.user);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill: {
        name: "",
        level: "Beginner",
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSkills([...skills, values.skill]);
    form.reset();
  }

  const handleDeleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleScannedSkills = (newSkills: Skill[]) => {
    setScannedSkills(newSkills);
  };

  const addScannedSkill = (skill: Skill) => {
    if (!skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmitSkills = async () => {
    console.log(skills);
    try{
      const response = await fetch("/api/uploadskills", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({skills:skills, userid:user?.userid}),
      });
      const data = await response.json();
      console.log(data);
      if(data.message === 'Skills uploaded successfully'){
        router.push('/home');
      }
    }catch(error){
      console.error("Error uploading skills:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Skills Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Add your skills or let AI scan your uploaded resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black dark:bg-black shadow-md">
            <CardHeader>
              <CardTitle>Add Skills Manually</CardTitle>
              <CardDescription>
                Enter your skills and proficiency levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="skill.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skill Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., JavaScript" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="skill.level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proficiency Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue  />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900">
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>

                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full border rounded-md text-black bg-white">
                    Add Skill
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <SkillList skills={skills} onDelete={handleDeleteSkill} />
              </div>
              <Button type="submit" className="w-full mt-4 border rounded-md text-black bg-white" onClick={handleSubmitSkills}>
                Submit
              </Button>

            </CardContent>
          </Card>

          <Card className="bg-black dark:bg-black shadow-md">
            <CardHeader>
              <CardTitle>Resume Scanner</CardTitle>
              <CardDescription>
               Automatically detect your skills from your uploaded resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeScanner 
                onSkillsDetected={handleScannedSkills} 
                onAddSkill={addScannedSkill}
                scannedSkills={scannedSkills}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}