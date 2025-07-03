'use client';

import { withAuth } from '@/components/auth/withAuth';

function SettingsPage() {
  return (
    <div className="settings-container">
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            Account Settings
          </div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Settings content */}
              <div className="settings-content">
                <h2>Account Settings</h2>
                <p>Manage your account preferences and personal information here.</p>
                {/* Add your settings form and controls here */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default withAuth(SettingsPage); 