"use client";
import React from 'react';
import LoginPageWrapper from '@/components/wrappers/LoginPageWrapper';
import LoginComponent from '@/components/auth/login/LoginComponent';

export default function Login() {
  return (<LoginPageWrapper>
    <LoginComponent />
  </LoginPageWrapper>);
}
