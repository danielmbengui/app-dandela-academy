"use client";
import React from 'react';
import LoginPageWrapper from '@/components/wrappers/LoginPageWrapper';
import RegisterComponent from '@/components/login/RegisterComponent';

export default function Login() {
  return (<LoginPageWrapper>
    <RegisterComponent />
  </LoginPageWrapper>);
}
