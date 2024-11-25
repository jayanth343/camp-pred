"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Profile } from "@/types/profile";

interface ProfileSectionProps {
  profile: Profile;
  onUpdateProfile: (profile: Profile) => void;
}


export function ProfileSection({ profile, onUpdateProfile }: ProfileSectionProps) {
  return (
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription className="text-zinc-400">Review your profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input value={profile.Name} readOnly />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={profile.Email} readOnly />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input value={profile.Phone} readOnly />
          </div>
          <div>
            <label className="text-sm font-medium">Date of Birth</label>
            <Input value={new Date(profile.DOB).toLocaleDateString()} readOnly />
          </div>
        </div>
        <Button
          variant="default"
          className="mt-4 bg-white text-black hover:bg-white/80"
          onClick={() => onUpdateProfile(profile)}
        >
          Update Profile
        </Button>
      </CardContent>
    </Card>
  );
}