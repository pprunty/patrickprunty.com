'use client';

import { Analytics as AnalyticsComponent } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GA_MEASUREMENT_ID, VERCEL_ANALYTICS } from '@/config';
import { GoogleAnalytics } from '@next/third-parties/google';

export function Analytics() {
  return (
    <>
      <AnalyticsComponent />
      <SpeedInsights />
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </>
  );
}
