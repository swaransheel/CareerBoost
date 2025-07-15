import { Link } from "wouter";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { Job } from "@shared/schema";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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

  const formatDate = (date: Date | null) => {
    if (!date) return "Recently";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-slate-900 mb-2">{job.title}</h4>
          <p className="text-primary font-medium mb-1">{job.company}</p>
          <div className="flex items-center text-slate-600 mb-3">
            <MapPin size={16} className="mr-2" />
            <span>{job.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${getTypeColor(job.type)}`}>
            {job.type}
          </span>
          <div className="flex items-center text-slate-500 text-sm">
            <Clock size={14} className="mr-1" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>
      </div>
      
      <p className="text-slate-600 mb-4 line-clamp-2">
        {job.description.substring(0, 150)}...
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {job.skills?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
        <Link href={`/jobs/${job.id}`}>
          <button className="text-primary hover:text-blue-700 font-medium flex items-center">
            View Details <ArrowRight size={16} className="ml-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}
