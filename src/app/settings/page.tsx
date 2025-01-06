'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Edit2, Save, X, AlertTriangle, Camera } from 'lucide-react';

// Types for our profile data
type Profile = {
  displayName: string;
  bio: string;
  location: string;
  visibility: 'public' | 'private';
  socialLinks: string[];
  notificationPreferences: {
    documentExpiry: boolean;
    travelReminders: boolean;
    securityAlerts: boolean;
    newsletter: boolean;
  };
  primaryCurrency: string;
  taxResidency: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  } | null;
  preferredLanguage: string;
  image: string | null;
};

type NotificationType = {
  type: 'success' | 'error';
  message: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Initial profile state
  const [profile, setProfile] = useState<Profile>({
    displayName: '',
    bio: '',
    location: '',
    visibility: 'private',
    socialLinks: [''],
    notificationPreferences: {
      documentExpiry: true,
      travelReminders: true,
      securityAlerts: true,
      newsletter: false
    },
    primaryCurrency: 'USD',
    taxResidency: '',
    emergencyContact: null,
    preferredLanguage: 'en',
    image: null
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfile({
              ...profile,
              ...data,
              notificationPreferences: data.notificationPreferences || profile.notificationPreferences,
              emergencyContact: data.emergencyContact || null
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          showNotification('error', 'Failed to load profile data');
        }
      }
    };

    fetchProfile();
  }, [session, status]);

  // Handle profile updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/user/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setIsEditing(false);
        setIsDirty(false);
        showNotification('success', 'Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile');
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        // Remove the page reload and just update the profile
        setProfile(prev => ({ ...prev, image: data.imageUrl }));
        setIsDirty(true); // Enable save button
        showNotification('success', 'Profile photo updated');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showNotification('error', 'Failed to upload profile photo');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return;
    
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/user/${session.user.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('error', 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen text-text">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="flex justify-center items-center min-h-screen text-text">Please sign in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Edit/Save buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-text">Profile Settings</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={() => {
                setIsEditing(false);
                setIsDirty(false);
              }} variant="secondary" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex items-center gap-2"
                disabled={!isDirty}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-primary' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Photo Card */}
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-text">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <div className="relative">
              {profile.image ? (
                <img 
                  src={profile.image} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                  <span className="text-4xl text-text">
                    {profile.displayName?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer">
                  <Camera className="h-4 w-4 text-text" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information Card */}
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-text">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Display Name</div>
              {isEditing ? (
                <Input
                  value={profile.displayName}
                  onChange={(e) => {
                    setProfile({ ...profile, displayName: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="How you want to be known"
                  className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
                />
              ) : (
                <div className="px-3 py-2 bg-background rounded-md text-text">
                  {profile.displayName || 'Not set'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Bio</div>
              {isEditing ? (
                <Input
                  value={profile.bio}
                  onChange={(e) => {
                    setProfile({ ...profile, bio: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="Tell us about yourself"
                  className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
                />
              ) : (
                <div className="px-3 py-2 bg-background rounded-md text-text">
                  {profile.bio || 'No bio added'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Location</div>
              {isEditing ? (
                <Input
                  value={profile.location}
                  onChange={(e) => {
                    setProfile({ ...profile, location: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="Current location"
                  className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
                />
              ) : (
                <div className="px-3 py-2 bg-background rounded-md text-text">
                  {profile.location || 'No location set'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Profile Visibility</div>
              {isEditing ? (
                <select 
                  value={profile.visibility}
                  onChange={(e) => {
                    setProfile({ ...profile, visibility: e.target.value as 'public' | 'private' });
                    setIsDirty(true);
                  }}
                  className="rounded-md border-border bg-secondary text-text shadow-sm focus:border-primary focus:ring-primary w-full"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              ) : (
                <div className="px-3 py-2 bg-background rounded-md text-text capitalize">
                  {profile.visibility}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences Card */}
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-text">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(profile.notificationPreferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-text capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        notificationPreferences: {
                          ...profile.notificationPreferences,
                          [key]: e.target.checked
                        }
                      });
                      setIsDirty(true);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                ) : (
                  <span className={value ? 'text-primary' : 'text-gray-500'}>
                    {value ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-text">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Input
                  value={profile.emergencyContact?.name || ''}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      emergencyContact: {
                        ...profile.emergencyContact || {},
                        name: e.target.value
                      } as Profile['emergencyContact']
                    });
                    setIsDirty(true);
                  }}
                  placeholder="Contact Name"
                  className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
                />
                <Input
                  value={profile.emergencyContact?.phone || ''}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      emergencyContact: {
                        ...profile.emergencyContact || {},
                        phone: e.target.value
                      } as Profile['emergencyContact']
                    });
                    setIsDirty(true);
                  }}
                  placeholder="Phone Number"
                  className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
                />
                <Input
                  value={profile.emergencyContact?.email || ''}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      emergencyContact: {
                        ...profile.emergencyContact || {},
                        email: e.target.value
                      } as Profile['emergencyContact']
                    });
                    setIsDirty(true);
                  }}
                  placeholder="Email Address"
                  className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
                />
                <Input
                  value={profile.emergencyContact?.relationship || ''}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      emergencyContact: {
                        ...profile.emergencyContact || {},
                        relationship: e.target.value
                      } as Profile['emergencyContact']
                    });
                    setIsDirty(true);
                  }}
                  placeholder="Relationship"
                  className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
                />
              </>
            ) : (
              profile.emergencyContact ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-background rounded-md text-text">
                    <div>Name: {profile.emergencyContact.name}</div>
                    <div>Phone: {profile.emergencyContact.phone}</div>
                    <div>Email: {profile.emergencyContact.email}</div>
                    <div>Relationship: {profile.emergencyContact.relationship}</div>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 bg-background rounded-md text-text">
                  No emergency contact set
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Delete Account Section */}
        <Card className="bg-secondary border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDeleteAccount}
              variant="primary"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
