import { useQuery } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@shared/schema";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = jobType === "all" || job.type.toLowerCase() === jobType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Jobs</h2>
          <p className="text-slate-600">
            Unable to load job listings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Find Your Dream Job</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover opportunities that match your skills and grow your career with top companies.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="All Job Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button className="w-full bg-primary hover:bg-blue-700">
              <Search size={16} className="mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-slate-900 mb-6">
          {filteredJobs?.length === 0 ? "No jobs found" : "Latest Opportunities"}
        </h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              No jobs match your search criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs?.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
