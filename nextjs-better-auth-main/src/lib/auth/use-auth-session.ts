// Custom hook to provide properly typed session with role field
// This works around better-auth's limitation where client doesn't automatically
// inherit server-side additionalFields types

import { useSession as useBaseSession } from "./client";

export interface SessionUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  username?: string | null;
  displayUsername?: string | null;
  role?: string;
  gender?: boolean;
}

export interface Session {
  user: SessionUser;
  session: {
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

interface UseSessionResult {
  data: Session | null;
  isPending: boolean;
  error: Error | null;
}

export function useSession(): UseSessionResult {
  const result = useBaseSession();

  // Add role and gender fields to the user object if they exist
  if (result.data?.user) {
    const user = result.data.user as any;
    return {
      ...result,
      data: {
        ...result.data,
        user: {
          ...result.data.user,
          role: user.role,
          gender: user.gender,
        } as SessionUser,
      } as Session,
    };
  }

  return result as UseSessionResult;
}
