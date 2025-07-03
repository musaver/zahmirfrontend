// app/dashboard/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('settings');
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login-register');
      return;
    }

    // Initialize user info from session
    setUserInfo({
      fullName: session.user?.name || '',
      email: session.user?.email || '',
      phone: '',
      dateOfBirth: '22/07/1990', // Default value
      profileImage: session.user?.image || ''
    });

    // Fetch user profile data
    fetchUserProfile();
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setUserInfo(prev => ({
          ...prev,
          fullName: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          profileImage: data.user.image || ''
        }));
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!userInfo.fullName.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.fullName.trim(),
          phone: userInfo.phone.trim() || null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        // Update session with new name
        if (session) {
          await fetch('/api/auth/session', { method: 'GET' });
        }
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    
  }

  if (!session) {
    return null;
  }

  const tabs = [
    { id: 'settings', label: 'Settings', active: true },
    { id: 'wishlists', label: 'Wishlists', active: false },
    { id: 'orders', label: 'Orders history', active: false },
    { id: 'password', label: 'Change password', active: false },
    { id: 'billing', label: 'Billing', active: false }
  ];

  return (
    <>
      
      {/* Breadcrumb */}
      <div className="breadcumb-wrapper" style={{backgroundImage: 'url(/assets/img/bg/breadcumb-bg.jpg)'}}>
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">My Account</h1>
            <ul className="breadcumb-menu">
              <li><Link href="/">Home</Link></li>
              <li>Account</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <section className="space-top space-extra-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12">
              <div className="dashboard-wrapper">
                
                {/* Account Header */}
                <div className="account-header mb-5">
                  <h1 className="account-title">Account</h1>
                  <div className="account-info">
                    <span className="account-name">{userInfo.fullName}</span>
                    <span className="account-separator">•</span>
                    <span className="account-email">{userInfo.email}</span>
                    <span className="account-separator">•</span>
                    <span className="account-location">Dubai, UAE</span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="account-nav mb-5">
                  <div className="nav-tabs-wrapper">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Content */}
                {activeTab === 'settings' && (
                  <div className="account-content">
                    <h2 className="content-title mb-4">Account information</h2>
                    
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="account-form">
                          
                          {/* Profile Image Section */}
                          <div className="profile-section mb-5">
                            <div className="profile-image-wrapper">
                              <div className="profile-image">
                                {userInfo.profileImage ? (
                                  <Image 
                                    src={userInfo.profileImage} 
                                    alt="Profile" 
                                    width={120} 
                                    height={120}
                                    className="rounded-circle"
                                  />
                                ) : (
                                  <div className="profile-placeholder">
                                    <i className="fas fa-user"></i>
                                  </div>
                                )}
                                <div className="change-image-overlay">
                                  <i className="fas fa-camera"></i>
                                  <span>Change image</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Form Fields */}
                          <div className="form-section">
                            <div className="form-group mb-4">
                              <label className="form-label">Full name</label>
                              <input 
                                type="text" 
                                className="form-control account-input" 
                                value={userInfo.fullName}
                                onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                              />
                            </div>

                            <div className="form-group mb-4">
                              <label className="form-label">Email</label>
                              <div className="email-input-wrapper">
                                <i className="fas fa-envelope email-icon"></i>
                                <input 
                                  type="email" 
                                  className="form-control account-input email-input" 
                                  value={userInfo.email}
                                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="form-group mb-4">
                              <label className="form-label">Phone Number</label>
                              <div className="phone-input-wrapper">
                                <i className="fas fa-phone phone-icon"></i>
                                <input 
                                  type="tel" 
                                  className="form-control account-input phone-input" 
                                  value={userInfo.phone}
                                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                                  placeholder="Enter your phone number"
                                />
                              </div>
                            </div>

                            <div className="form-group mb-4">
                              <label className="form-label">Date of birth</label>
                              <div className="date-input-wrapper">
                                <i className="fas fa-calendar date-icon"></i>
                                <input 
                                  type="text" 
                                  className="form-control account-input date-input" 
                                  value={userInfo.dateOfBirth}
                                  onChange={(e) => setUserInfo({...userInfo, dateOfBirth: e.target.value})}
                                  placeholder="DD/MM/YYYY"
                                  readOnly
                                />
                                <i className="fas fa-calendar-alt date-icon-right"></i>
                              </div>
                            </div>

                            {/* Messages */}
                            {message && (
                              <div className="alert alert-success mb-4">
                                <i className="fas fa-check-circle me-2"></i>
                                {message}
                              </div>
                            )}
                            {error && (
                              <div className="alert alert-danger mb-4">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                              </div>
                            )}

                            <div className="form-actions mt-5">
                              <button 
                                className="btn-save"
                                onClick={handleSaveProfile}
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <i className="fas fa-spinner fa-spin me-2"></i>
                                    Saving...
                                  </>
                                ) : (
                                  'Save changes'
                                )}
                              </button>
                              <button className="btn-signout" onClick={handleSignOut}>
                                Sign out
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Tab Contents */}
                {activeTab === 'wishlists' && (
                  <div className="account-content">
                    <h2 className="content-title mb-4">Wishlists</h2>
                    <p className="text-muted">Your saved services and favorites will appear here.</p>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="account-content">
                    <h2 className="content-title mb-4">Orders history</h2>
                    <div className="d-flex justify-content-center">
                      <Link href="/dashboard/orders" className="btn btn-primary">
                        <i className="fas fa-history me-2"></i>
                        View Order History
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'password' && (
                  <div className="account-content">
                    <h2 className="content-title mb-4">Change password</h2>
                    <p className="text-muted">Update your account password here.</p>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="account-content">
                    <h2 className="content-title mb-4">Billing</h2>
                    <p className="text-muted">Manage your payment methods and billing information.</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>


      <style jsx>{`
        .dashboard-wrapper {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .account-header {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 2rem;
        }

        .account-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 1rem;
        }

        .account-name {
          font-weight: 600;
          color: #1f2937;
        }

        .account-separator {
          color: #d1d5db;
        }

        .nav-tabs-wrapper {
          display: flex;
          gap: 2rem;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
          padding-bottom: 0;
        }

        .nav-tab {
          background: none;
          border: none;
          padding: 1rem 0;
          font-size: 1rem;
          color: #6b7280;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .nav-tab:hover {
          color: #374151;
        }

        .nav-tab.active {
          color: #1f2937;
          font-weight: 500;
        }

        .nav-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--theme-color, #2A07F9);
        }

        .content-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1f2937;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .profile-image-wrapper {
          position: relative;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-placeholder {
          font-size: 2rem;
          color: #9ca3af;
        }

        .change-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.2s ease;
          font-size: 0.9rem;
        }

        .profile-image:hover .change-image-overlay {
          opacity: 1;
        }

        .change-image-overlay i {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .account-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
        }

        .account-input:focus {
          outline: none;
          border-color: var(--theme-color, #2A07F9);
          box-shadow: 0 0 0 3px rgba(42, 7, 249, 0.1);
        }

        .email-input-wrapper,
        .phone-input-wrapper,
        .date-input-wrapper {
          position: relative;
        }

        .email-icon,
        .phone-icon,
        .date-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 0.9rem;
        }

        .date-icon-right {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 0.9rem;
        }

        .email-input,
        .phone-input {
          padding-left: 45px;
        }

        .date-input {
          padding-left: 45px;
          padding-right: 45px;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-save {
          background: var(--theme-color, #2A07F9);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-save:hover {
          background: #1e06d4;
        }

        .btn-signout {
          background: none;
          border: 1px solid #d1d5db;
          color: #6b7280;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-signout:hover {
          background: #f9fafb;
          color: #374151;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.9rem;
        }

        .alert-success {
          background: #d1fae5;
          border-color: #a7f3d0;
          color: #065f46;
        }

        .alert-danger {
          background: #fee2e2;
          border-color: #fecaca;
          color: #991b1b;
        }

        .btn-save:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .dashboard-wrapper {
            padding: 1rem;
          }

          .account-title {
            font-size: 2rem;
          }

          .nav-tabs-wrapper {
            gap: 1rem;
          }

          .profile-section {
            flex-direction: column;
            text-align: center;
          }

          .form-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
}
