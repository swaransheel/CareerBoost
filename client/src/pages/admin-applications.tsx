import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, MapPin, Building, Mail, Phone, ExternalLink, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { ApplicationWithJob, ApplicationStatus } from "@shared/schema";

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: applications, isLoading, error } = useQuery<ApplicationWithJob[]>({
    queryKey: ["/api/admin/applications"],
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredApplications = applications?.filter((app) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        app.firstName.toLowerCase().includes(searchLower) ||
        app.lastName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.job.title.toLowerCase().includes(searchLower) ||
        app.job.company.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "N/A";
    
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate both admin and regular applications queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${variables.status}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Applications</h2>
          <p className="text-slate-600">
            Unable to load applications. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">
            Manage and review all job applications
          </p>
        </div>
        <div className="flex gap-4">
          <div className="w-[200px]">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            type="search"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-500">Total Applications</h3>
          <p className="text-2xl font-bold text-slate-900">{applications?.length || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-500">Pending Review</h3>
          <p className="text-2xl font-bold text-amber-600">
            {applications?.filter(a => !a.status || a.status === 'pending').length || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-500">Shortlisted</h3>
          <p className="text-2xl font-bold text-emerald-600">
            {applications?.filter(a => a.status === 'shortlisted').length || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-500">Rejected</h3>
          <p className="text-2xl font-bold text-red-600">
            {applications?.filter(a => a.status === 'rejected').length || 0}
          </p>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {isLoading ? (
          <Card className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </Card>
        ) : (
          filteredApplications?.map((application) => (
            <Card key={application.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={20} className="text-slate-400" />
                    <h3 className="text-lg font-semibold">
                      {application.firstName} {application.lastName}
                    </h3>
                  </div>
                  <div className="flex items-center text-slate-600 mb-2">
                    <Building size={16} className="mr-2" />
                    <span className="font-medium text-primary">
                      {application.job.company} - {application.job.title}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MapPin size={16} className="mr-2" />
                    <span>{application.job.location}</span>
                  </div>
                </div>
                <Badge
                  className={
                    !application.status || application.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : application.status === 'shortlisted'
                      ? 'bg-emerald-100 text-emerald-700'
                      : application.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }
                >
                  {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Pending'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-slate-600">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">
                    Applied: {formatDate(application.submittedAt)}
                  </span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Mail size={16} className="mr-2" />
                  <span className="text-sm">{application.email}</span>
                </div>
                {application.phone && (
                  <div className="flex items-center text-slate-600">
                    <Phone size={16} className="mr-2" />
                    <span className="text-sm">{application.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FileText size={16} />
                    View Cover Letter
                  </Button>
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    View Resume
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleUpdateStatus(application.id, 'rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700"
                    onClick={() => handleUpdateStatus(application.id, 'shortlisted')}
                  >
                    Shortlist
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
