'use client';

import React from 'react';
import { useLoading } from '../context/LoadingContext';
import PageLoader from './PageLoader';

interface GlobalLoadingWrapperProps {
  children: React.ReactNode;
}

export default function GlobalLoadingWrapper({ children }: GlobalLoadingWrapperProps) {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <>
      {children}
      {isLoading && (
        <PageLoader 
          message={loadingMessage}
          variant="spinner"
          showLogo={true}
        />
      )}
    </>
  );
} 