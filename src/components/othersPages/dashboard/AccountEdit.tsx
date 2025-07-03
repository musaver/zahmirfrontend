"use client";
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

export default function AccountEdit() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user) {
      const fullName = session.user.name || '';
      const nameParts = fullName.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user.email || ''
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate passwords if changing password
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        setLoading(false);
        return;
      }
    }

    try {
      const updateData: any = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      // Only include password fields if user is changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-account-content account-edit">
      <div className="">
        {message && (
          <div className="alert alert-success mb-4">
            <i className="icon icon-check-circle me-2"></i>
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mb-4">
            <i className="icon icon-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        <form
          onSubmit={handleSubmit}
          className=""
          id="form-password-change"
        >
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="firstName"
              required
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="firstName"
            >
              First name
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              required
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="lastName"
            >
              Last name
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="email"
              autoComplete="email"
              required
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="email"
            >
              Email (cannot be changed)
            </label>
          </div>
          
          
          
          <div className="mb_20">
            <button
              type="submit"
              className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
