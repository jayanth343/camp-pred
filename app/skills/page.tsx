  "use client";

import { useEffect, useState } from "react";
import { Sparkles, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Typography, Snackbar, Alert } from '@mui/material'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useStore } from "../../pages/api/store";
import { useForm } from "react-hook-form";
interface Skill {
  skill_id: string;
  skillname: string;
  skill_level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}



export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [editLevel, setEditLevel] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [openSnackbarNoChanges, setOpenSnackbarNoChanges] = useState(false)
  const [editSkills, setEditSkills] = useState<Skill[]>([]);
  const [delSkills, setDelSkills] = useState<Skill[]>([]);
  const [addSkills, setAddSkills] = useState<Skill[]>([]);
  const user = useStore((state:any) => state.user);
  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setEditLevel(skill.skill_level);
  };
  const router = useRouter();

  useEffect(() => {
    if(skills.length === 0){
      getSkills();
    }
  }, []);

  const form = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    setSkills([...skills, { skill_id: String(skills.length + 1), skillname: data.skill.name, skill_level: data.skill.level }]);
    setAddSkills([...addSkills, { skill_id: String(skills.length + 1), skillname: data.skill.name, skill_level: data.skill.level }]);
  }
  
  const getSkills = async () => {
    console.log(user);
    try {
    const res = await fetch('/api/getskills', {
      method: 'POST',
      body: JSON.stringify({ userid: user?.userid }),
    });
    const data = await res.json();
    if(res.ok){
        console.log(data.skills);
      setSkills(data.skills);
    }
  } catch(err){
    console.log(err);
  }
  }
  const handleSaveSkill = () => {
    console.log(selectedSkill, editLevel);
    if (selectedSkill && editLevel) {
      setEditSkills([...editSkills, { ...selectedSkill, skill_level: editLevel as "Beginner" | "Intermediate" | "Advanced" | "Expert" }]);
      console.log(editSkills);
      const updatedSkills = skills.map((skill) =>
        skill.skill_id === selectedSkill.skill_id
          ? { ...skill, skill_level: editLevel as "Beginner" | "Intermediate" | "Advanced" | "Expert" }
          : skill
      );
      setSkills(updatedSkills); // Update the skills state with the modified skill levels
      setSelectedSkill(null);
      setEditLevel("");
    }
  };

  const handleDeleteSkill = (skill: Skill) => {
    setDelSkills([...delSkills, skill]);
  };

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-white text-black";
      case "Intermediate":
        return "bg-zinc-700 text-white";
      case "Beginner":
        return "bg-zinc-900 text-white";
      case "Advanced":
        return "bg-black border border-white text-white";
      default:
        return "outline";
    }
  };

  const handleSubmit = async () => {
    if(editSkills.length === 0 && delSkills.length === 0 && addSkills.length === 0){
        console.log('No changes made');
        setOpenSnackbarNoChanges(true)
      
    } else {    
    try{
    const res = await fetch('/api/updateskills', {
      method: 'POST',
      body: JSON.stringify({ editSkills, delSkills,addSkills,userid:user?.userid }),
    });
    const data = await res.json();
    if(res.status === 200){
      console.log(data.message);
      setOpenSnackbar(true);
    }
  } catch(err){
    console.log(err);
  }
  }
}

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Skills
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            View and manage your skills and proficiency levels
          </p>
        </div>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black p-8 shadow-xl">
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>
              Your current skills and proficiency levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <Card key={index} className="bg-secondary/50 dark:bg-black dark:text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium mb-2">{skill.skillname}</h3>
                        <Badge className={getBadgeVariant(skill.skill_level)}>
                          {skill.skill_level}
                        </Badge>
                      </div>
                      <Dialog>
                        <div className="flex space-x-2 justify-end">
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSkill(skill)}
                            >
                              <Pencil className="h-4 w-4  " />
                            </Button>
                          </DialogTrigger>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSkill(skill)}><Trash2 className={`h-4 w-4 ${delSkills.includes(skill) ? 'text-red-500 ' : 'text-white'}`}  /></Button>
                        </div>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Skill Level</DialogTitle>
                            <DialogDescription>
                              Update your proficiency level for {skill.skillname}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Proficiency Level
                              </label>
                              <Select
                                value={editLevel}
                                onValueChange={setEditLevel}
                              >
                                <SelectTrigger >
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-zinc-900">
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">
                                    Intermediate
                                  </SelectItem>
                                  <SelectItem value="Advanced">Advanced</SelectItem>
                                  <SelectItem value="Expert">Expert</SelectItem>
                                  
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className=" border border-white bg-white text-black"
                              onClick={handleSaveSkill}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="border border-white bg-white text-black w-full mt-10" onClick={handleSubmit}>Submit</Button>
          </CardContent>
        </Card>
      <Card className="bg-black dark:bg-black shadow-md mt-10">
        <CardHeader>
          <CardTitle>Add New Skills</CardTitle>
          <CardDescription>
            Add new skills to your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="skill.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter skill" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skill.level"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Skill Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
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
              <Button type="submit" className="w-full border rounded-md text-black bg-white">
                Add Skill
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={1500} anchorOrigin={{vertical:'top',horizontal:'left'}} onClose={() => {setOpenSnackbar(false);router.push('/home')}}>
        <Alert severity="success">Skills updated successfully</Alert>
      </Snackbar>
      <Snackbar open={openSnackbarNoChanges} autoHideDuration={2000} anchorOrigin={{vertical:'top',horizontal:'left'}} onClose={() => {setOpenSnackbarNoChanges(false); router.push('/home')}}>
        <Alert severity="warning">No changes made!</Alert>
      </Snackbar>
    </div>
    </>
  );
}