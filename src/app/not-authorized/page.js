"use client";
import React from 'react';
import NotAuthorizedComponent from '@/components/auth/NotAuthorizedComponent';
import OtherPageWrapper from '@/components/wrappers/OtherPageWrapper';


export default function NotAuthorizedPage() {
  return(<OtherPageWrapper>
    <NotAuthorizedComponent />
  </OtherPageWrapper>)
}
