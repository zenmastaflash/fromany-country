import { getServerSession } from 'next-auth';
import { authConfig } from './auth.config';

export const auth = () => getServerSession(authConfig);

export type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type Session = {
  user: AuthUser;
  expires: string;
};