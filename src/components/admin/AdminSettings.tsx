import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, RefreshCw, Shield, Bell, Database } from "lucide-react";

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    feedbackPeriod: 'semester',
    anonymousFeedback: true,
    emailNotifications: true,
    autoReminders: false,
    ratingScale: '10',
    minimumFeedback: '5',
    systemName: 'Faculty Feedback System',
    contactEmail: 'admin@college.edu',
    maintenanceMode: false,
    backupFrequency: 'daily'
  });

  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/database
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully."
    });
  };

  const handleResetSettings = () => {
    setSettings({
      feedbackPeriod: 'semester',
      anonymousFeedback: true,
      emailNotifications: true,
      autoReminders: false,
      ratingScale: '10',
      minimumFeedback: '5',
      systemName: 'Faculty Feedback System',
      contactEmail: 'admin@college.edu',
      maintenanceMode: false,
      backupFrequency: 'daily'
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <div>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage feedback system settings and preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => setSettings({...settings, systemName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Academic Period</Label>
                <Select 
                  value={settings.feedbackPeriod} 
                  onValueChange={(value) => setSettings({...settings, feedbackPeriod: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">Per Semester</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable the system for maintenance</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rating Scale</Label>
                  <Select 
                    value={settings.ratingScale} 
                    onValueChange={(value) => setSettings({...settings, ratingScale: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">1-5 Scale</SelectItem>
                      <SelectItem value="10">1-10 Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimumFeedback">Minimum Feedback Required</Label>
                  <Input
                    id="minimumFeedback"
                    type="number"
                    value={settings.minimumFeedback}
                    onChange={(e) => setSettings({...settings, minimumFeedback: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Anonymous Feedback</Label>
                  <p className="text-sm text-muted-foreground">Allow students to submit feedback anonymously</p>
                </div>
                <Switch
                  checked={settings.anonymousFeedback}
                  onCheckedChange={(checked) => setSettings({...settings, anonymousFeedback: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Auto Reminders</Label>
                  <p className="text-sm text-muted-foreground">Automatically send feedback reminders to students</p>
                </div>
                <Switch
                  checked={settings.autoReminders}
                  onCheckedChange={(checked) => setSettings({...settings, autoReminders: checked})}
                />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4" />
                <h3 className="font-semibold">Notification Settings</h3>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>New Feedback Notifications</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Low Rating Alerts</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-4 h-4" />
                <h3 className="font-semibold">System Management</h3>
              </div>

              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select 
                  value={settings.backupFrequency} 
                  onValueChange={(value) => setSettings({...settings, backupFrequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Change Admin Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Security Logs
                  </Button>
                  <Button variant="outline" className="w-full">
                    Manage User Sessions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    Clear Old Feedback (6+ months)
                  </Button>
                  <Button variant="outline" className="w-full text-destructive">
                    Reset System Data
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6 border-t">
            <Button onClick={handleSaveSettings} className="flex-1 bg-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};