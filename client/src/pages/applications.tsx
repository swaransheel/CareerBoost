import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Building, Mail, Phone, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Application, Job } from "@shared/schema";

interface ApplicationWithJob extends Application {
  job: Job;
}

export default function Applications() {
  const { data: applications, isLoading, error } = useQuery<ApplicationWithJob[]>({
    queryKey: ["/api/applications"],
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-600">
          Track the status of your job applications and manage your submissions.
        </p>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : applications?.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Applications Yet</h3>
            <p className="text-slate-600 mb-6">
              You haven't submitted any job applications yet. Start browsing jobs to find your next opportunity!
            </p>
            <Button className="bg-primary hover:bg-blue-700">
              Browse Jobs
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications?.map((application) => (
            <div key={application.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {application.job?.title || "Job Title Not Available"}
                  </h3>
                  <div className="flex items-center text-slate-600 mb-2">
                    <Building size={16} className="mr-2" />
                    <span className="font-medium text-primary">
                      {application.job?.company || "Company Not Available"}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MapPin size={16} className="mr-2" />
                    <span>{application.job?.location || "Location Not Available"}</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  Under Review
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

              {application.experience && (
                <div className="mb-4">
                  <span className="text-sm text-slate-600">
                    Experience: <span className="font-medium">{application.experience}</span>
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-4">
                  {application.resumeUrl && (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View Resume
                    </a>
                  )}
                  <span className="text-sm text-slate-500">
                    ID: #{application.id}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Withdraw
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Application
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {applications && applications.length > 0 && (
        <div className="mt-12 bg-slate-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Application Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{applications.length}</div>
              <div className="text-sm text-slate-600">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{applications.length}</div>
              <div className="text-sm text-slate-600">Under Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">0</div>
              <div className="text-sm text-slate-600">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">0</div>
              <div className="text-sm text-slate-600">Responses</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}