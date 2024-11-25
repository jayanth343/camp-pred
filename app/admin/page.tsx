"use client";

import { useState } from "react";
import { Shield, Plus, PenLine, Trash2, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { TableDialog } from "@/components/admin/table-dialog";
import { useToast } from "@/components/ui/use-toast";

// Mock database schema and data
const tables = {
  users: {
    columns: ["id", "fullName", "email", "role", "createdAt"],
    data: [
      { id: 1, fullName: "John Doe", email: "john@example.com", role: "student", createdAt: "2024-03-15" },
      { id: 2, fullName: "Jane Smith", email: "jane@example.com", role: "admin", createdAt: "2024-03-14" },
    ],
  },
  jobs: {
    columns: ["id", "title", "company", "location", "type", "postedDate"],
    data: [
      { id: 1, title: "Software Engineer", company: "TechCorp", location: "San Francisco", type: "Full-time", postedDate: "2024-03-15" },
      { id: 2, title: "Data Scientist", company: "DataTech", location: "Remote", type: "Full-time", postedDate: "2024-03-14" },
    ],
  },
  applications: {
    columns: ["id", "userId", "jobId", "status", "appliedDate"],
    data: [
      { id: 1, userId: 1, jobId: 1, status: "pending", appliedDate: "2024-03-15" },
      { id: 2, userId: 2, jobId: 2, status: "accepted", appliedDate: "2024-03-14" },
    ],
  },
};

export default function AdminPage() {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState<keyof typeof tables>("users");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  const handleAdd = () => {
    setEditingRow(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setIsDialogOpen(true);
  };

  const handleDelete = (row: any) => {
    // In a real app, you would call an API to delete the row
    toast({
      title: "Row Deleted",
      description: `Successfully deleted row from ${selectedTable} table.`,
    });
  };

  const handleSave = (data: any) => {
    // In a real app, you would call an API to save the data
    toast({
      title: editingRow ? "Row Updated" : "Row Added",
      description: `Successfully ${editingRow ? "updated" : "added"} row in ${selectedTable} table.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage database tables and records
          </p>
        </div>

        <Card className="bg-black">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Database Management</CardTitle>
                <CardDescription>
                  View and manage database records
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={selectedTable}
                  onValueChange={(value: keyof typeof tables) => setSelectedTable(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <Database className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(tables).map((table) => (
                      <SelectItem key={table} value={table}>
                        {table.charAt(0).toUpperCase() + table.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent  >
            <DataTable
              columns={tables[selectedTable].columns}
              data={tables[selectedTable].data}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <TableDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          columns={tables[selectedTable].columns}
          data={editingRow}
          onSave={handleSave}
          tableName={selectedTable}
        />
      </div>
    </div>
  );
}