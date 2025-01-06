'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Edit2, Save, X, AlertTriangle, Camera } from 'lucide-react';
import ProfileImage from '@/components/ProfileImage';

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
        setProfile(prev => ({ ...prev, image: data.imageUrl }));
        setIsDirty(true);
        showNotification('success', 'Profile photo updated');
        
        // Force a refresh of all ProfileImage components
        window.dispatchEvent(new Event('profile-image-update'));
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
