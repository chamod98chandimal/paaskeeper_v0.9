'use client';

import { LitDebug } from '@/components/LitDebug';

export default function DebugPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lit Protocol Debug Page</h1>
      <p>This page helps debug Lit Protocol issues and test the complete encryption/decryption flow.</p>
      <LitDebug />
    </div>
  );
} 