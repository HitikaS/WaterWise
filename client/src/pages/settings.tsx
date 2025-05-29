import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone,
  Mail,
  Save
} from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  location: z.string().optional(),
  phone: z.string().optional()
});

const notificationSchema = z.object({
  emailAlerts: z.boolean(),
  pushNotifications: z.boolean(),
  smsAlerts: z.boolean(),
  weeklyReports: z.boolean(),
  alertLevel: z.enum(["all", "high", "critical"])
});

export default function Settings() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "John Doe",
      email: "john@example.com",
      location: "Downtown Area",
      phone: "+1 (555) 123-4567"
    }
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      weeklyReports: true,
      alertLevel: "high"
    }
  });

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    // In a real app, this would update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated."
    });
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationSchema>) => {
    // In a real app, this would update notification preferences
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated."
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle the theme
    toast({
      title: "Theme Updated",
      description: `Switched to ${!darkMode ? "dark" : "light"} mode.`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Settings" onMenuClick={() => {}} />
      
      <main className="p-6 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Your city or area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="emailAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <FormLabel className="text-base">Email Alerts</FormLabel>
                            <p className="text-sm text-gray-500">Receive water scarcity alerts via email</p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={notificationForm.control}
                    name="pushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-gray-500" />
                          <div>
                            <FormLabel className="text-base">Push Notifications</FormLabel>
                            <p className="text-sm text-gray-500">Receive alerts in your browser</p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={notificationForm.control}
                    name="smsAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <div>
                            <FormLabel className="text-base">SMS Alerts</FormLabel>
                            <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={notificationForm.control}
                    name="weeklyReports"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <FormLabel className="text-base">Weekly Reports</FormLabel>
                            <p className="text-sm text-gray-500">Receive weekly water usage summaries</p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={notificationForm.control}
                  name="alertLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Level Threshold</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select alert level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Alerts</SelectItem>
                          <SelectItem value="high">High & Critical Only</SelectItem>
                          <SelectItem value="critical">Critical Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Appearance & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500">Toggle dark/light theme</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Sharing</p>
                  <p className="text-sm text-gray-500">Allow anonymous data sharing for research</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Location Tracking</p>
                  <p className="text-sm text-gray-500">Enable location-based water alerts</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">OpenWeatherMap API Key</label>
              <Input 
                type="password" 
                placeholder="Enter your API key"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for real-time weather data. Get your free key at openweathermap.org
              </p>
            </div>
            <Button className="w-full">
              Save API Settings
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
