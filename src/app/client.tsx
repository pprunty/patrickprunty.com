'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ClientSideScrollRestorer = dynamic(
  () => import('@/modules/common/components/ClientSideScrollRestorer'),
  {
    ssr: false,
  },
);

const Footer = dynamic(() => import('./footer'), { ssr: false });
const ToastClient = dynamic(() => import('./toast'), { ssr: false });
const JsonLdScript = dynamic(() => import('./json-ld'), { ssr: false });

export default function ClientComponents() {
  return (
    <>
      <Suspense fallback={null}>
        <ClientSideScrollRestorer />
      </Suspense>
      <Footer />
      <ToastClient />
      <JsonLdScript />
    </>
  );
}
