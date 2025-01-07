'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfileImage({ size = 'md', className = '' }) {
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setImageUrl(data.image);
          }
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
    };

    fetchImageUrl();

    // Add this event listener
    const handleProfileUpdate = () => fetchImageUrl();
    window.addEventListener('profile-image-update', handleProfileUpdate);
    return () => window.removeEventListener('profile-image-update', handleProfileUpdate);
  }, [session?.user?.id]);

  const dimensions = size === 'sm' ? 'w-8 h-8' : 'w-24 h-24';

  if (!imageUrl) {
    return (
      <div className={`${dimensions} rounded-full bg-primary flex items-center justify-center ${className}`}>
        <span className={`font-bold text-text ${size === 'sm' ? 'text-sm' : 'text-4xl'}`}>
          {session?.user?.name?.[0]?.toUpperCase() || '?'}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={session?.user?.name || 'Profile'} 
      className={`${dimensions} rounded-full object-cover ${className}`}
    />
  );
}
