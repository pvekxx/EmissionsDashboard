"use client";


import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 루트 레이아웃 컴포넌트 TanStack Query와 Jotai를 위한 프로바이더 설정
import { Provider as JotaiProvider } from 'jotai';
import React from 'react';

// 앱 전체에서 사용할 단일 QueryClient 인스턴스 생성
const queryClient = new QueryClient();

// RootLayout 컴포넌트가 받는 props 타입을 정의
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            {children}
          </JotaiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}