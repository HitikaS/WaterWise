import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaterReportSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { RecentReports } from "@/components/recent-reports";

const reportFormSchema = insertWaterReportSchema.extend({
  userName: z.string().optional()
});

export default function ReportIssue() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      issueType: "",
      severity: "",
      location: "",
      description: "",
      userName: "John Doe"
    }
  });

  const reportMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reportFormSchema>) => {
      return apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Water issue report submitted successfully! Thank you for helping improve water management in your area."
      });
      form.reset({
        issueType: "",
        severity: "",
        location: "",
        description: "",
        userName: "John Doe"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: z.infer<typeof reportFormSchema>) => {
    reportMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Report Water Issue" onMenuClick={() => {}} />
      
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Water Issue Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="issueType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select issue type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Low Water Pressure">Low Water Pressure</SelectItem>
                              <SelectItem value="No Water Supply">No Water Supply</SelectItem>
                              <SelectItem value="Water Quality Issues">Water Quality Issues</SelectItem>
                              <SelectItem value="Pipe Leakage">Pipe Leakage</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address or area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the water issue in detail..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={reportMutation.isPending}
                  >
                    {reportMutation.isPending ? "Submitting..." : "Submit Report"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <RecentReports />
        </div>
      </main>
    </div>
  );
}
