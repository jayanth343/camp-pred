"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  CornerDownLeft,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useStore } from "../../pages/api/store";
interface Requirement {
  requirements: string;
  met: boolean;
  explanation: string;
}

interface PredictionResult {
  requirements: any;
  success_probability: number;
  analysis: Requirement[];
  strengths: string[];
  improvements: string[];
  otherjobsuggestions: string[];
  gen_at: string;
}

export function JobPrediction({ id }: { id: string }) {
  const user = useStore((state: any) => state.user);
  const job = useStore((state: any) => state.job);
  const router = useRouter();
  const parseRequirements = (requirements: string): string[] => {
    const cleanedRequirements = requirements
      ?.replace(/\[|\]/g, "") // Remove square brackets
      .split(",") // Split on comma
      .map((item: string) => item.trim()) // Trim whitespace
      .filter((item: string) => item !== ""); // Remove empty strings

    return cleanedRequirements;
  };
  const parsetoJSON = (data: string) => {
    // Replace single quotes with double quotes
    const validJsonString = data
      .replace(/([{,])(\w+):/g, '$1"$2":') // Enclose keys with double quotes
      .replace(/:([^,"\]\}]+)/g, ':"$1"') // Enclose unquoted string values with double quotes
      .replace(/:"(\d+)"/g, ":$1") // Remove quotes around numeric values
      .replace(/," /g, ', "') // Ensure space after commas doesn't break parsing
      .replace(/:\s*"/g, ': "'); // Remove quotes around numbers
    return JSON.parse(validJsonString);
  };

  const deletepred = async () => {
    const res = await fetch(`/api/delpred`, {
      method: "POST",
      body: JSON.stringify({ userid: user?.userid, jobid: job?.job_id }),
    });
    const data = await res.json();
    if (data.status == 200) {
      setPrediction(null);
      router.refresh();
    }
  };

  const updatepred = async (pred: any) => {
    if (
      !pred ||
      Object.values(pred).some(
        (value) =>
          value === null || (Array.isArray(value) && value.length === 0)
      )
    ) {
      console.error("Error: Prediction object contains null or empty values");
      return { message: "Null prediction data", status: 400 };
    }
    try {
      const res = await fetch(`/api/uppred`, {
        method: "POST",
        body: JSON.stringify({
          userid: user?.userid,
          jobid: job?.job_id,
          pred: pred,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return { message: error, status: 500 };
    }
  };

  const fetchdbpred = async () => {
    const fetchpred = await fetch(`/api/getdbpred`, {
      method: "POST",
      body: JSON.stringify({ userid: user?.userid, jobid: job?.job_id }),
    });
    const res = await fetchpred.json();
    if (res.status == 200) {
      let ppred = res?.response;
      ppred.strengths = parseRequirements(ppred.strengths);
      ppred.success_probability = Number(ppred.success_probability);
      ppred.improvements = parseRequirements(ppred.improvements);
      ppred.otherjobsuggestions = parseRequirements(ppred.otherjobsuggestions);
      ppred.analysis = parsetoJSON(ppred.analysis);
      ppred.gen_at = new Date(ppred.gen_at).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      console.log("Parsed Fetched pred", ppred);
      setPrediction(ppred);
    } else if (res.status == 404) {
      await getpred();
    }
  };

  const getpred = async () => {
    try {
      const pred = await fetch(`/api/getpred`, {
        method: "POST",
        body: JSON.stringify({ userid: user?.userid, job: job }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await pred.json();
      const rd = await updatepred(data.response);
      console.log("PLS:: ", rd);
      if (rd?.status == 200) {
        setPrediction(data.response);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  useEffect(() => {
    if (!prediction) {
      fetchdbpred();
    }
  }, [id]);
  const chartData = [
    { name: "Success Rate", value: prediction?.success_probability ?? 0 },
    {
      name: "Gap",
      value: prediction?.success_probability
        ? 100 - prediction?.success_probability
        : 0,
    },
  ];

  const COLORS = ["#2196F3", "#FFC107"];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        {!prediction ? (
          <div className="flex flex-col justify-center items-center h-screen space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Analyzing your profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we generate your personalized job match
                report.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <CircularProgress
                size={100}
                thickness={4}
                className="text-primary"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end">
              <p className=" text-gray-500 dark:text-gray-400 ">
                Generated on: {prediction?.gen_at}
              </p>
            </div>
            <div className="mb-8">
              <Button
                variant="ghost"
                className="mb-6 text-white hover:bg-zinc-800"
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeft className="h-4 w-4 " />
                Back
              </Button>

              <div className="text-center mb-12">
                <Briefcase className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Success Prediction
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Analysis of your fit for this position
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Overall Match Score</CardTitle>
                  <CardDescription>
                    Your compatibility with the role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold">
                      {prediction?.success_probability}%
                    </p>
                    <p className="text-sm text-muted-foreground">Match Rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Requirements Analysis</CardTitle>
                  <CardDescription>
                    How you meet the job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prediction?.analysis?.map((req: any, index: any) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {req.met ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span>{req.name}</span>
                        </div>
                        <Badge
                          variant={req.met ? "default" : "destructive"}
                          className={`${
                            req.met
                              ? "bg-white text-black"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {req.met ? "Met" : "Not Met"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Your Strengths</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Areas where you excel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prediction?.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Suggested enhancements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prediction?.improvements?.map((improvement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5 text-primary" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card className="bg-zinc-900">
                <CardHeader>
                  <CardTitle>Other Job Suggestions</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Jobs that may be a good fit for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prediction?.otherjobsuggestions?.map(
                      (suggestion, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-primary" />
                          <span>{suggestion}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="hover:bg-zinc-800 text-white border mr-2"
                onClick={() => {
                  router.push(`/jobs/predict/${id}/apply`);
                }}
              >
                Apply for Position <CornerDownLeft className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                className="hover:bg-zinc-300 text-black bg-white ml-2 "
                onClick={() => {
                  router.push(`/jobs`);
                }}
              >
                Regenerate Score
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
