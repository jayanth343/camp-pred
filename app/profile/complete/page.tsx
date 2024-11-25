"use client";
import { useEffect, useState } from "react";
import { useStore } from "../../../pages/api/store";
import { Input } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserCircle, Upload, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution name is required"),
  startYear: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  endYear: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  major: z.string().min(3, "Invalid Major"),
  grade: z.string().min(1, "Grade Percentage/CGPA is required"),
});

const formSchema = z.object({
  fullName: z.string().optional(),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().optional(),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  education: z
    .array(educationSchema)
    .min(1, "At least one education entry is required"),
});

export default function ProfileComplete() {
  const user = useStore((state: any) => state.user);
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [gradeType, setGradeType] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fuid = user?.userid;
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: profile?.Name || "",
      dob: "",
      email: profile?.Email || "",
      phone: "",
      education: [
        {
          degree: "",
          institution: "",
          major: "",
          startYear: "",
          endYear: "",
          grade: "",
        },
      ],
    },
  });

  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 20MB");
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError("File must be a PDF or Word document");
      return;
    }

    setResumeFile(file);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!resumeFile) {
      setFileError("Please upload your resume");
      return;
    }
    console.log("Form submitted!");
    console.log("Form values:", values);
    console.log("Resume file:", resumeFile);

    try {
      const formData = new FormData();
      formData.append("userid", user?.userid);
      formData.append("fullName", values.fullName || "");
      formData.append("email", values.email || "");
      formData.append("phone", values.phone);
      formData.append("dob", values.dob);
      formData.append("education", JSON.stringify(values.education));
      formData.append("resume", resumeFile);
      const response = await fetch("/api/completeprof", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === 200) {
        setSuccessMsg(data.message);
        onOpen();
      } else {
        setSuccessMsg(data.message);
        onOpen();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update profile");
    }
  }



  const fetchProfile = async () => {
    const res = await fetch("/api/getprofile", {
      method: "POST",
      body: JSON.stringify({ userid: user?.userid }),
    });
    const data = await res.json();
    if (res.status === 200) {
      setProfile(data.profile);
      console.log(data.profile);
      const date = new Date(data.profile?.DOB).toISOString().split("T")[0];
      form.setValue("fullName", data.profile?.Name || "");
      form.setValue("email", data.profile?.Email || "");
      form.setValue("phone", data.profile?.Phone || "");
      form.setValue("dob", date);
    } else {
      setSuccessMsg(data.message);
      onOpen();
    }
  };

  const checkNullValues = () => {
    if (profile) {
      const nullValues = Object.entries(profile)
        .filter(([key, value]) => value === null)
        .map(([key, value]) => key);

      if (nullValues.length > 0) {
        console.log("Null values found in profile:", nullValues);
      } else {
        console.log("No null values found in profile");
      }
    }
  };

  useEffect(() => {
    checkNullValues();
  }, [profile]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <UserCircle className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Student Profile
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Complete your profile to enhance your placement opportunities
            </p>
          </div>

          <Card className="bg-black">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Provide your details for a complete profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="border border-gray-400 rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              {...field}
                              className="border rounded-lg border-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      disabled={profile?.Phone ? true : false}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                profile?.Phone
                                  ? profile?.Phone
                                  : "Your phone number"
                              }
                              {...field}
                              className={`border rounded-lg border-gray-400 ${
                                profile?.Phone ? "text-white" : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      disabled={profile?.DOB ? true : false}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder={
                                profile?.DOB
                                  ? profile?.DOB
                                  : "Your date of birth"
                              }
                              {...field}
                              className={`border rounded-lg border-gray-400 ${
                                profile?.DOB ? "text-white" : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-8" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Education</h3>
                      <Button
                        type="button"
                        variant="outline"
                        className="border border-gray-400 rounded-lg"
                        size="sm"
                        onClick={() => {
                          const currentEducation = form.getValues("education");
                          form.setValue("education", [
                            ...currentEducation,
                            {
                              degree: "",
                              institution: "",
                              startYear: "",
                              endYear: "",
                              major: "",
                              grade: "",
                            },
                          ]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>

                    {form.watch("education")?.map((_, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name={`education.${index}.degree`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Degree/Course</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="B.Tech"
                                      {...field}
                                      className={`border rounded-lg border-gray-400`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`education.${index}.institution`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Institution</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Institution name"
                                      {...field}
                                      className={`border rounded-lg border-gray-400`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`education.${index}.startYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="2020"
                                      {...field}
                                      className={`border rounded-lg border-gray-400`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`education.${index}.endYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="2024"
                                      {...field}
                                      className={`border rounded-lg border-gray-400`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`education.${index}.major`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Major</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter Major"
                                      {...field}
                                      className={`border rounded-lg border-gray-400`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`education.${index}.grade`}
                              render={({ field }) => (
                                <>
                                  <FormItem>
                                    <div className="flex items-center justify-between">
                                      <FormLabel>Grade</FormLabel>
                                      <Select
                                        value={gradeType}
                                        onValueChange={setGradeType}
                                      >
                                        <SelectTrigger className="w-[180px] bg-background">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background">
                                          <SelectItem value="cgpa">
                                            CGPA
                                          </SelectItem>
                                          <SelectItem value="percentage">
                                            Percentage
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex items-center mt-2"></div>
                                    <FormMessage />
                                  </FormItem>
                                  <FormItem>
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder={
                                          gradeType === "cgpa"
                                            ? "Enter CGPA"
                                            : "Enter Percentage"
                                        }
                                        {...field}
                                        className={`border rounded-lg border-gray-400`}
                                      />
                                    </FormControl>
                                  </FormItem>
                                </>
                              )}
                            />
                          </div>

                          {index > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="mt-4 border border-gray-400 rounded-lg text-red-500"
                              onClick={() => {
                                const currentEducation =
                                  form.getValues("education");
                                form.setValue(
                                  "education",
                                  currentEducation.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                              Remove
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Resume</h3>
                      <div className="flex items-center gap-4">
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
                          Choose File
                        </label>
                        {resumeFile && (
                          <em className="text-sm text-gray-600 dark:text-gray-300">
                            {resumeFile.name}
                          </em>
                        )}
                      </div>
                      {fileError && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{fileError}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button
                      type="submit"
                      className="bg-primary text-white border border-gray-400 rounded-lg"
                    >
                      Save Profile
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        backdrop={"opaque"}
        className="rounded-lg"
      >
        <ModalContent className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 shadow-xl">
          <ModalHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile Update Status
            </h1>
          </ModalHeader>
          <ModalBody className="py-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {successMsg}
            </p>
          </ModalBody>
          <ModalFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button
              onClick={() => {
                onOpenChange();
                setSuccessMsg(null);
                router.push("/skills/new");
              }}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
