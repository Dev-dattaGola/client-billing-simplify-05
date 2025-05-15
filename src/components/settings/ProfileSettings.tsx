
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from '@/backend/settings-api';
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, PenLine } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileSettingsProps {
  profile: UserProfile | null;
  isLoading: boolean;
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, isLoading, onUpdate }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [title, setTitle] = useState(profile?.title || '');
  const [barNumber, setBarNumber] = useState(profile?.barNumber || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update form when profile changes
  React.useEffect(() => {
    if (profile) {
      setName(profile.name || currentUser?.name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setBio(profile.bio || '');
      
      // Set appropriate title based on role
      if (currentUser) {
        if (currentUser.role === 'attorney') {
          setTitle('Attorney');
        } else if (currentUser.role === 'admin') {
          setTitle('System Administrator');
        } else if (currentUser.role === 'client') {
          setTitle('Client');
        } else {
          setTitle(profile.title || '');
        }
      } else {
        setTitle(profile.title || '');
      }
      
      setBarNumber(profile.barNumber || '');
      setAvatarPreview(null);
    }
  }, [profile, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setIsSaving(true);
    try {
      await onUpdate({
        name,
        phone,
        address,
        bio,
        title,
        barNumber,
        // If we have a preview, it means the user uploaded a new avatar
        avatar: avatarPreview || profile.avatar
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For this demo, we'll just create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get name initials for avatar fallback
  const getNameInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return profile?.name 
      ? profile.name.split(' ').map(part => part[0]).join('').toUpperCase()
      : 'US';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={profile?.avatar || `https://i.pravatar.cc/150?u=${profile?.userId}`} />
                  <AvatarFallback className="text-2xl bg-purple-600 text-white">
                    {getNameInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={handleAvatarClick}>
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{currentUser?.name || profile?.name || 'User Name'}</h3>
                <p className="text-muted-foreground">{title || 'No title set'}</p>
                <p className="text-sm text-muted-foreground">{currentUser?.email || profile?.email || `${profile?.userId}@example.com`}</p>
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <PenLine className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p>{profile?.phone || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Bar Number</p>
              <p>{profile?.barNumber || 'Not provided'}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{profile?.address || 'Not provided'}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Bio</p>
              <p className="whitespace-pre-line">{profile?.bio || 'No bio provided'}</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={avatarPreview || profile?.avatar || `https://i.pravatar.cc/150?u=${profile?.userId}`} />
                <AvatarFallback className="text-2xl bg-purple-600 text-white">
                  {getNameInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={handleAvatarClick}>
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Profile Photo</h3>
              <p className="text-sm text-muted-foreground">Click on the avatar to upload a new image</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Attorney, Paralegal, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barNumber">Bar Number (if applicable)</Label>
              <Input
                id="barNumber"
                value={barNumber}
                onChange={(e) => setBarNumber(e.target.value)}
                placeholder="Enter your bar number"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your expertise"
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;
