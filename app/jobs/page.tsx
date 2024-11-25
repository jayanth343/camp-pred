"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/pages/api/store";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
interface Job {
  job_id: string;
  title: string;
  company_name: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  det_desc: string;
  required_skills: string;
  required_skills_list: string[];
  requirements: string[];
  post_date: string;
  app_deadline: string;
}

export default function JobsPage() {
  const router = useRouter();
  const user = useStore((state: any) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" ||
      job?.type?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });
  const parseRequirements = (requirements: string): string[] => {
    const cleanedRequirements = requirements
      .replace(/\[|\]/g, "") // Remove square brackets
      .split(",") // Split on comma
      .map((item) => item.trim()) // Trim whitespace
      .filter((item) => item !== ""); // Remove empty strings

    return cleanedRequirements;
  };

  const handleFetchJobs = async () => {
    console.log("userid", user?.userid);
    if(user?.userid){
    const response = await fetch(`/api/getjobpage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.status === 200) {
      console.log("jobs fetched", data.jobs);
      let jobs = data?.jobs;
      jobs.forEach((job: Job) => {
        job.post_date = new Date(job?.post_date).toISOString().split("T")[0];
        job.app_deadline = new Date(job?.app_deadline)
          .toISOString()
          .split("T")[0];
        job.post_date = new Date(job?.post_date).toISOString().split("T")[0];
        job.requirements = parseRequirements(job?.det_desc);
        job.required_skills_list = parseRequirements(job?.required_skills);
        console.log(job.requirements);
      });   
      setJobs(jobs);
    }}
  };

  useEffect(() => {
    if (jobs.length === 0) {
      console.log("fetching jobs");
      handleFetchJobs();
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Briefcase className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Job Listings
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore and apply for available positions
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.job_id}
                className="hover:shadow-lg transition-shadow bg-black"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Building2 className="h-4 w-4 text-zinc-300" />
                          <span className="text-zinc-300">
                            {job.company_name}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-white text-black"
                        >
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-white text-black"
                        >
                          <Clock className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-white text-black"
                        >
                          <Calendar className="h-3 w-3" />
                          Apply by{" "}
                          {new Date(job.app_deadline).toLocaleDateString()}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground">{job.description}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-lg font-semibold text-primary">
                        <em>
                          ${" "}
                          {(job?.salary || 0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </em>
                      </p>
                      <div className="space-y-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedJob(job)}
                              className="border border-white text-white mt-3"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{job.title}</DialogTitle>
                              <DialogDescription className="text-zinc-300">
                                <em>
                                  {job.company_name} - {job.type} <br />
                                </em>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Requirements
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {job.requirements.map((req, index) => (
                                    <li key={index} className="text-zinc-200">
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                                <h4 className="font-semibold mb-2 mt-4">
                                  Skills Required:
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {job?.required_skills_list.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="mr-2 mb-2  text-white">
                                      {skill}
                                    </Badge>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex gap-2 text-zinc-300">
                                <Badge
                                  variant="secondary"
                                  className="items-center gap-1 bg-white text-black"
                                >
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </Badge>

                                <Badge
                                  variant="secondary"
                                  className="items-center gap-1 bg-white text-black"
                                >
                                  <Calendar className="h-3 w-3" />
                                  Post Date: {new Date(job.post_date).toLocaleDateString()}
                                </Badge>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center">
                                <Button variant="outline" onClick={() => {
                                  router.push(`/jobs/predict/${job.job_id}`)
                                }}>
                                  
                                    View Success Rate
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button className="bg-white text-black hover:bg-zinc-300" onClick={() => {
                                  localStorage.setItem('selectedJob', JSON.stringify(job));
                                  router.push(`/jobs/predict/${job.job_id}/apply`)
                                }}>
                                  Apply Now
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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
    </>
  );
}
