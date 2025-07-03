'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import AccountEdit from "@/components/othersPages/dashboard/AccountEdit";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login-register');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Account Settings</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <AccountEdit />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 