'use client';

import React, { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import './styles.css';
import LoginRegisterForm from '@/components/auth/LoginRegisterForm';

export default function LoginRegisterPage() {
  return (
    <div className="tf-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <Suspense fallback={<div>Loading...</div>}>
              <LoginRegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
