
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProfileForm() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        phoneNumber,
        updatedAt: new Date(),
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          type="tel"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
