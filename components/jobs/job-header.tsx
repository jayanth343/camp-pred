"use client";

import { MapPin, Clock, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription><em>{job.company_name}</em></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary" className="flex items-center gap-1 bg-white text-black ">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 bg-white text-black ">
            <Clock className="h-3 w-3" />
            {job.type}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 bg-white text-black ">
            <Calendar className="h-3 w-3" />
            Apply by {new Date(job.app_deadline).toLocaleDateString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}