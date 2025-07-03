import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Wait for session check
      
      if (!session) {
        // Redirect to login if not authenticated
        router.replace('/login-register');
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return (
        <div className="tf-loading-auth">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    // Only render the protected component if authenticated
    return session ? <WrappedComponent {...props} /> : null;
  };
} 