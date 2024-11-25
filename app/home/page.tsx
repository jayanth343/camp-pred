"use client";
import { Navbar } from "../../components/navbar";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
  Clock,
  Search,
} from "lucide-react";
import { User } from "@nextui-org/user";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useStore } from "../../pages/api/store";
import { Skeleton } from "@mui/material";



const HomeSkeleton = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 bg-black">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width={300} height={20} />
                  </div>
                  <Skeleton variant="rectangular" width={100} height={40} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <Skeleton variant="circular" width={20} height={20} />
                          <div>
                            <Skeleton variant="text" width={40} height={30} />
                            <Skeleton variant="text" width={100} height={20} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black">
              <CardHeader>
                <Skeleton variant="text" width={100} height={30} />
                <Skeleton variant="text" width={150} height={20} />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-40 overflow-y-scroll pr-2">
                    <Skeleton variant="rectangular" height={160} />
                  </div>
                  <Skeleton variant="rectangular" height={40} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="rectangular" width={200} height={40} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow bg-black">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-4">
                        <div>
                          <Skeleton variant="text" width={200} height={30} />
                          <div className="flex items-center gap-2 mt-1">
                            <Skeleton variant="circular" width={16} height={16} />
                            <Skeleton variant="text" width={100} height={20} />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Skeleton variant="rectangular" width={100} height={30} />
                          <Skeleton variant="rectangular" width={100} height={30} />
                        </div>

                        <div className="space-y-2">
                          <Skeleton variant="text" width={120} height={20} />
                          <div className="flex flex-wrap gap-2">
                            {[...Array(3)].map((_, index) => (
                              <Skeleton key={index} variant="rectangular" width={80} height={30} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="text-right">
                          <Skeleton variant="text" width={100} height={30} />
                        </div>
                        <Skeleton variant="rectangular" width={120} height={40} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const user = useStore((state: any) => state.user);
  const setJob = useStore((state: any) => state.setJob);
  const [skills, setSkills] = useState<any>(null);
  const [avg_success, setAvgSuccess] = useState(0);
  const [jobs, setJobs] = useState<any>(null);
  const [SKcount, setSKcount] = useState(0);
  const router = useRouter();
  useEffect(() => {
    if (!skills && !jobs) {
      getHomeData()
    }
  }, []);

  const getHomeData = async () => {
    try {
      const res = await fetch(`/api/gethomedata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: user?.userid }),
      });
      const data = await res.json();
      console.log(data);
      if (data.res && data.res.some((item: any) => item.Phone === null)) {
        console.log('Some Phone values are null');
        router.push('/profile/complete');
      }
      let j = data.jobs;
      j.forEach((job:any) => {
        job.required_skills = job.required_skills.split(',').map((skill:any) => skill.trim());
      });
      console.log('avg_success: ',data?.avg_success);
      setAvgSuccess(data?.avg_success);
      setSKcount(data.res[0].skill_count);
      setSkills(data.skills);
      setJobs(data.jobs);
    } catch (err) {
      console.log(err);
    }
  };
  const filteredJobs = jobs ? jobs.filter(
    (job:any) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (!skills || !jobs) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 bg-black">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>
                      Track your job applications and skill matches
                    </CardDescription>
                  </div>
                  <Button asChild className="bg-white text-black">
                    <a href="/profile" className="flex items-center gap-2">
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">
                            {jobs.length}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Available Jobs
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">{SKcount}</p>
                          <p className="text-sm text-muted-foreground">
                            Skills Added
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">{Math.round(avg_success)}%</p>
                          <p className="text-sm text-muted-foreground">
                            Average Success Rate
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black">
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
                <CardDescription>Recently added skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div
                    className="h-40 overflow-y-scroll pr-2"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {skills.map((skill: any, index: any) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mt-2 bg-zinc-900 bg-secondary/50 p-2 rounded-md "
                      >
                        <span>{skill.skillname}</span>
                        <Badge
                          variant={
                            skill.skill_level === "Expert"
                              ? "default"
                              : skill.skill_level === "Intermediate"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            skill.skill_level === "Expert"
                              ? "bg-white text-black"
                              : skill.skill_level === "Intermediate"
                              ? "bg-zinc-700 text-white"
                              : skill.skill_level === "Beginner"
                              ? "bg-zinc-900 text-white"
                              : skill.skill_level === "Advanced"
                              ? "bg-black border border-white text-white"
                              : ""
                          }
                        >
                          {skill.skill_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-5 bg-white text-black"  onClick={() => router.push('/skills')}>
                    
                      <Sparkles className="h-4 w-4" />
                      Manage Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold">Available Positions</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 ">
              {filteredJobs.map((job:any) => (
                <Card
                  key={job.job_id}
                  className="hover:shadow-lg transition-shadow bg-black"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-semibold">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1 ">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company_name}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-zinc-900 text-white"
                          >
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-zinc-900 text-white"
                          >
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium mb-2">
                            Required Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills.map((skill:any, index:any) => (
                              <Badge
                                key={index}
                                className="bg-white text-black"
                                
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary">
                            <em>
                            $ {(job?.salary || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </em>
                          </p>
                          
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedJob(job)}
                              className=" mt-4 border border-white"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{job.title}</DialogTitle>
                              <DialogDescription className="text-muted-foreground text-zinc-400 mt-2">
                                {job.company_name} - <em className="text-zinc-400">{job.location}</em>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-muted-foreground text-zinc-400">
                                {job.description}
                              </p>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Required Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.required_skills.map((skill:any, index:any) => (
                                    <Badge
                                      key={index}
                                      
                                      className="bg-white text-black"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center">
                                <Button variant="outline"  className=" text-white hover:bg-zinc-800" onClick={() => {setJob(job); router.push(`/jobs/predict/${job.job_id}`)}}>
                                    View Success Rate
                                    <ExternalLink className=" ml-2 h-4 w-4 mb-" />
                                </Button>
                                <Button  className="bg-white text-black hover:bg-zinc-300" onClick={() => { router.push(`/jobs`)}}>
                                  Apply Now
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No jobs found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
