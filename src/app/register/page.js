"use client";
import React from 'react';
import RegisterComponent from '@/components/auth/login/RegisterComponent';
import LoginPageWrapper from '@/components/wrappers/LoginPageWrapper';

export default function Login() {
  return (<LoginPageWrapper>
    <RegisterComponent />
  </LoginPageWrapper>);
}
