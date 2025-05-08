
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Mail, Shield, Database, Cloud } from "lucide-react";

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'LAW ERP 500',
    adminEmail: 'superadmin@lawerp.com',
    maintenanceMode: false,
    allowNewFirmRegistrations: true
  });
  
  const [emailSettings, setEmailSettings] = useState({
    emailProvider: 'SMTP',
    smtpHost: 'smtp.yourdomain.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    senderEmail: 'noreply@lawerp.com',
    senderName: 'LAW ERP 500'
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    requireStrongPasswords: true,
    sessionTimeout: '120',
    enableTwoFactor: false,
    allowPasswordReset: true,
    maxLoginAttempts: '5'
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    databaseType: 'MongoDB',
    connectionString: 'mongodb://localhost:27017/lawerp',
    backupEnabled: true,
    backupFrequency: 'daily',
    backupRetention: '30'
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDatabaseSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDatabaseSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    // This would be replaced with an actual API call to MongoDB
    toast({
      title: 'Settings Saved',
      description: 'Your system settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings and behaviors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input 
                    id="systemName" 
                    name="systemName" 
                    value={generalSettings.systemName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input 
                    id="adminEmail" 
                    name="adminEmail" 
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable access for all users except super admins</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowNewFirmRegistrations">Allow New Firm Registrations</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable new law firm registrations</p>
                </div>
                <Switch
                  id="allowNewFirmRegistrations"
                  name="allowNewFirmRegistrations"
                  checked={generalSettings.allowNewFirmRegistrations}
                  onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, allowNewFirmRegistrations: checked }))}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email server and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Input 
                    id="emailProvider" 
                    name="emailProvider" 
                    value={emailSettings.emailProvider}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input 
                    id="senderEmail" 
                    name="senderEmail" 
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input 
                    id="smtpHost" 
                    name="smtpHost" 
                    value={emailSettings.smtpHost}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input 
                    id="smtpPort" 
                    name="smtpPort" 
                    value={emailSettings.smtpPort}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input 
                    id="smtpUsername" 
                    name="smtpUsername" 
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input 
                    id="smtpPassword" 
                    name="smtpPassword" 
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailSettingsChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input 
                  id="senderName" 
                  name="senderName" 
                  value={emailSettings.senderName}
                  onChange={handleEmailSettingsChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireStrongPasswords">Require Strong Passwords</Label>
                  <p className="text-sm text-muted-foreground">Enforce strong password policies for all users</p>
                </div>
                <Switch
                  id="requireStrongPasswords"
                  name="requireStrongPasswords"
                  checked={securitySettings.requireStrongPasswords}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireStrongPasswords: checked }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input 
                  id="sessionTimeout" 
                  name="sessionTimeout" 
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecuritySettingsChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security with 2FA</p>
                </div>
                <Switch
                  id="enableTwoFactor"
                  name="enableTwoFactor"
                  checked={securitySettings.enableTwoFactor}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowPasswordReset">Allow Password Reset</Label>
                  <p className="text-sm text-muted-foreground">Enable users to reset their passwords</p>
                </div>
                <Switch
                  id="allowPasswordReset"
                  name="allowPasswordReset"
                  checked={securitySettings.allowPasswordReset}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, allowPasswordReset: checked }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input 
                  id="maxLoginAttempts" 
                  name="maxLoginAttempts" 
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={handleSecuritySettingsChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>Configure database connection and backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="databaseType">Database Type</Label>
                  <Input 
                    id="databaseType" 
                    name="databaseType" 
                    value={databaseSettings.databaseType}
                    onChange={handleDatabaseSettingsChange}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connectionString">Connection String</Label>
                  <Input 
                    id="connectionString" 
                    name="connectionString" 
                    value={databaseSettings.connectionString}
                    onChange={handleDatabaseSettingsChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="backupEnabled">Enable Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup the database</p>
                </div>
                <Switch
                  id="backupEnabled"
                  name="backupEnabled"
                  checked={databaseSettings.backupEnabled}
                  onCheckedChange={(checked) => setDatabaseSettings(prev => ({ ...prev, backupEnabled: checked }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Input 
                    id="backupFrequency" 
                    name="backupFrequency" 
                    value={databaseSettings.backupFrequency}
                    onChange={handleDatabaseSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                  <Input 
                    id="backupRetention" 
                    name="backupRetention" 
                    value={databaseSettings.backupRetention}
                    onChange={handleDatabaseSettingsChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
