'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    location: '',
    visibility: 'private',
    socialLinks: ['']
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfile({
              displayName: data.displayName || '',
              bio: data.bio || '',
              location: data.location || '',
              visibility: data.visibility || 'private',
              socialLinks: data.socialLinks?.length ? data.socialLinks : ['']
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [session, status]);

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
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen text-text">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="flex justify-center items-center min-h-screen text-text">Please sign in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-text">Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-text">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Display Name</div>
              <Input
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                placeholder="How you want to be known"
                className="max-w-md bg-background text-text placeholder-text/50"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Bio</div>
              <Input
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="max-w-md bg-background text-text placeholder-text/50"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Location</div>
              <Input
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Current location"
                className="max-w-md bg-background text-text placeholder-text/50"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text">Profile Visibility</div>
              <select 
                value={profile.visibility}
                onChange={(e) => setProfile({ ...profile, visibility: e.target.value })}
                className="block w-full max-w-md rounded-md bg-background text-text border-border px-3 py-2"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-text">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.socialLinks.map((link, index) => (
              <div key={index}>
                <Input
                  value={link}
                  onChange={(e) => {
                    const newLinks = [...profile.socialLinks];
                    newLinks[index] = e.target.value;
                    setProfile({ ...profile, socialLinks: newLinks });
                  }}
                  placeholder="https://"
                  className="max-w-md bg-background text-text placeholder-text/50"
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => setProfile({
                ...profile,
                socialLinks: [...profile.socialLinks, '']
              })}
              className="btn-secondary"
            >
              Add Social Link
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="btn-primary">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
