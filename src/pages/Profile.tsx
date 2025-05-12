import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, { message: 'Bio must not exceed 500 characters' }).optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters long' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;

// Add getUserDisplayName helper function to handle user name format
const getUserDisplayName = (user: any) => {
  if (!user) return "";
  // Try different ways to get the user's name
  return user.name || 
         (user.user_metadata?.first_name ? 
          `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : 
          user.email?.split('@')[0] || '');
};

const Profile = () => {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: getUserDisplayName(currentUser) || '',
      email: currentUser?.email || '',
      phone: '',
      address: '',
      bio: '',
    },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onSecuritySubmit = async (data: SecurityFormValues) => {
    setIsUpdatingPassword(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      securityForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your password. Please try again.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and profile information
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Summary Card */}
          <Card className="md:w-1/3 h-fit">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${currentUser?.name || 'User'}`} />
                <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium text-lg">{getUserDisplayName(currentUser)}</h3>
                <p className="text-sm text-muted-foreground">{currentUser?.email || ''}</p>
                <p className="text-sm text-muted-foreground mt-1">{currentUser?.role || 'User'}</p>
              </div>
              
              <div className="w-full pt-4 border-t">
                <div className="flex justify-between text-sm py-2">
                  <span className="text-muted-foreground">Member since</span>
                  <span>May 2023</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-muted-foreground">Last login</span>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Settings Tabs */}
          <div className="md:w-2/3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isUpdatingProfile} />
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
                                <Input type="email" {...field} disabled={true} />
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
                                <Input {...field} disabled={isUpdatingProfile} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isUpdatingProfile} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea {...field} disabled={isUpdatingProfile} className="min-h-[100px]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isUpdatingProfile}>
                            {isUpdatingProfile ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...securityForm}>
                      <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                        <FormField
                          control={securityForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} disabled={isUpdatingPassword} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={securityForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} disabled={isUpdatingPassword} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={securityForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} disabled={isUpdatingPassword} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isUpdatingPassword}>
                            {isUpdatingPassword ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
