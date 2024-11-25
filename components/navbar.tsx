"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Briefcase, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useStore } from '../pages/api/store'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter()
  const user = useStore((state:any) => state.user)
  const removeUser = useStore((state:any) => state.removeUser)
  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    console.log("Logging out...");
    removeUser()
    router.push('/login')
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-8">
            <NavigationMenuItem className="flex items-center ml-10">
              <Link href="/home" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive("/home")}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/profile" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/jobs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive("/jobs")}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Jobs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/applications" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive("/applications")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Applications
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-600 "
        >
          <LogOut className="mr-2 ml-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}