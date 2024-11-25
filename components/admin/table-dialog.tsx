"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: string[];
  data: any;
  onSave: (data: any) => void;
  tableName: string;
}

export function TableDialog({
  open,
  onOpenChange,
  columns,
  data,
  onSave,
  tableName,
}: TableDialogProps) {
  // Dynamically create schema based on columns and table name
  const schemaObj: { [key: string]: any } = {};
  
  if (tableName === "users") {
    schemaObj.name = z.string().min(2, "Name must be at least 2 characters");
    schemaObj.email = z.string().email("Invalid email address");
    schemaObj.username = z.string().min(3, "Username must be at least 3 characters");
    schemaObj.type = z.enum(["User", "Admin"]);
    schemaObj.password = data ? z.string().optional() : z.string().min(6, "Password must be at least 6 characters");
  } else {
    columns.forEach((column) => {
      if (column === "id") return;
      if (column.includes("Date")) {
        schemaObj[column] = z.string().min(1, `${column} is required`);
      } else if (column === "email") {
        schemaObj[column] = z.string().email("Invalid email address");
      } else if (column === "status") {
        schemaObj[column] = z.enum(["pending", "accepted", "rejected"]);
      } else if (column === "role") {
        schemaObj[column] = z.enum(["admin", "student"]);
      } else if (column === "type") {
        schemaObj[column] = z.enum(["Full-time", "Part-time", "Internship"]);
      } else {
        schemaObj[column] = z.string().min(1, `${column} is required`);
      }
    });
  }

  const formSchema = z.object(schemaObj);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {},
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
  };

  const renderFormFields = () => {
    if (tableName === "users") {
      return (
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
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
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{data ? "New Password (optional)" : "Password"}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder={data ? "Enter new password" : "Enter password"}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    }

    return columns.map((column) => {
      if (column === "id") return null;

      if (column === "status") {
        return (
          <FormField
            key={column}
            control={form.control}
            name={column}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{column.charAt(0).toUpperCase() + column.slice(1)}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${column}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      if (column === "role") {
        return (
          <FormField
            key={column}
            control={form.control}
            name={column}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{column.charAt(0).toUpperCase() + column.slice(1)}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${column}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      if (column === "type") {
        return (
          <FormField
            key={column}
            control={form.control}
            name={column}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{column.charAt(0).toUpperCase() + column.slice(1)}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${column}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      return (
        <FormField
          key={column}
          control={form.control}
          name={column}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{column.charAt(0).toUpperCase() + column.slice(1)}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type={column.includes("Date") ? "date" : "text"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit" : "Add"} {tableName.slice(0, -1)}
          </DialogTitle>
          <DialogDescription>
            {data ? "Edit the" : "Add a new"} record in the {tableName} table
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderFormFields()}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}