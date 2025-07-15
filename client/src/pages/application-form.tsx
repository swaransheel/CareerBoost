import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Job } from "@shared/schema";

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  resumeUrl: z.string().url("Please enter a valid URL"),
  coverLetter: z.string().min(100, "Cover letter must be at least 100 characters"),
  experience: z.string().optional(),
  startDate: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplicationForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const jobId = parseInt(id || "0");

  const { data: job, isLoading: jobLoading } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      resumeUrl: "",
      coverLetter: "",
      experience: "",
      startDate: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const applicationData = {
        ...data,
        jobId,
      };
      return await apiRequest("POST", "/api/applications", applicationData);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your interest. We'll review your application and get back to you within 3-5 business days.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    mutation.mutate(data);
  };

  if (jobLoading || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Application Submitted Successfully!</h1>
            <p className="text-slate-600 mb-8">
              Thank you for your interest in the <strong>{job.title}</strong> position at <strong>{job.company}</strong>. 
              We'll review your application and get back to you within 3-5 business days.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button variant="outline">Browse More Jobs</Button>
              </Link>
              <Link href={`/jobs/${job.id}`}>
                <Button>View Job Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Apply for Position</h1>
        <p className="text-slate-600 mb-8">
          Please fill out the form below to submit your application for{" "}
          <span className="font-semibold text-primary">{job.title}</span> at{" "}
          <span className="font-semibold text-primary">{job.company}</span>.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Resume */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Resume</h2>
              <FormField
                control={form.control}
                name="resumeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume URL *</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/resume.pdf"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500 mt-1">
                      Please provide a link to your resume (PDF, Google Drive, etc.)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cover Letter */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Cover Letter</h2>
              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter *</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Tell us why you're interested in this position and what makes you a great fit for our team..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center mt-1">
                      <FormMessage />
                      <span className="text-sm text-slate-500">Minimum 100 characters</span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Additional Information</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="2-3">2-3 years</SelectItem>
                          <SelectItem value="4-5">4-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <Link href={`/jobs/${job.id}`}>
                <Button type="button" variant="ghost" className="flex items-center text-slate-600 hover:text-slate-900">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Job Details
                </Button>
              </Link>
              <div className="flex space-x-4">
                <Button type="button" variant="outline">
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-primary hover:bg-blue-700"
                >
                  {mutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
