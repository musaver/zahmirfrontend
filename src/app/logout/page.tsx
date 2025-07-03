'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await signOut({ redirect: false });
      router.push('/login-register');
    };

    logout();
  }, [router]);

  return <p>Logging out...</p>;
}
