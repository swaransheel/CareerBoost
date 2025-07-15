import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, MapPin, Clock, Building, Globe, Users, Briefcase, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@shared/schema";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || "0");

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h2>
          <p className="text-slate-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button variant="outline">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "bg-emerald-100 text-emerald-700";
      case "part-time":
        return "bg-amber-100 text-amber-700";
      case "remote":
        return "bg-blue-100 text-blue-700";
      case "contract":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Recently";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Recently";
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays <= 7) return `Posted ${diffDays} days ago`;
    if (diffDays <= 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Posted ${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex items-center space-x-6 mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-32 w-full mb-6" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-48 w-full mb-6" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : job ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Job Header */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{job.title}</h1>
                <div className="flex items-center space-x-6 text-slate-600 mb-4">
                  <div className="flex items-center">
                    <Building size={16} className="mr-2" />
                    <span className="font-medium text-primary">{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>{formatDate(job.postedDate)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={`px-4 py-2 ${getTypeColor(job.type)}`}>
                    {job.type}
                  </Badge>
                  {job.salary && (
                    <Badge variant="secondary" className="px-4 py-2">
                      {job.salary}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Heart size={16} className="mr-2" />
                  Save Job
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Job Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Job Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Job Description</h2>
                  <div className="prose prose-slate max-w-none">
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Ready to Apply?</h3>
                  <p className="text-slate-600 mb-4">
                    Submit your application and join our team of talented developers.
                  </p>
                  <Link href={`/jobs/${job.id}/apply`}>
                    <Button className="bg-primary hover:bg-blue-700">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-white text-slate-700 border border-slate-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Info */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">About {job.company}</h3>
                  <p className="text-slate-600 mb-4">
                    Leading technology company focused on building innovative solutions for the modern web. 
                    We value creativity, collaboration, and continuous learning.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-600">
                      <Users size={16} className="mr-3" />
                      <span>500-1000 employees</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Briefcase size={16} className="mr-3" />
                      <span>Technology</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Globe size={16} className="mr-3" />
                      <span>www.{job.company.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Job Not Found</h2>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center text-primary hover:text-blue-700">
            <ArrowLeft size={16} className="mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
}
