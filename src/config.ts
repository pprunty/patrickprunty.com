// config.ts
import configData from '../samwise.config.json';

export const PRODUCTION_URL = configData.PRODUCTION_URL;

export const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : PRODUCTION_URL;

export const AUTHOR = {
  ...configData.AUTHOR,
  url: `${PRODUCTION_URL}/about`,
};

export const USE_LOGO_IN_NAVBAR = configData.USE_LOGO_IN_NAVBAR;

export const SOCIAL_URLS = configData.SOCIAL_URLS;

export const GA_MEASUREMENT_ID = configData.GA_MEASUREMENT_ID;
export const VERCEL_ANALYTICS = configData.VERCEL_ANALYTICS;
export const DEFAULT_KEYWORDS = configData.DEFAULT_KEYWORDS;
export const DEFAULT_COUNTER_ID = configData.DEFAULT_COUNTER_ID; // Include this line
export const IS_BLOG_USER_CONFIGURED =
  configData.IS_BLOG_USER_CONFIGURED || true;

export const USE_LOGO_FOR_HEADSHOT = configData.USE_LOGO_FOR_HEADSHOT;
export const USE_ARCHIVE = configData.USE_ARCHIVE;
export const ARCHIVE_ITEMS_TO_SHOW = configData.ARCHIVE_ITEMS_TO_SHOW;
export const CTA_SOCIAL_PLATFORM = configData.CTA_SOCIAL_PLATFORM;

const config = {
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://tmplate.xyz',
  companyName: 'tmplate.xyz',
  companyDescription:
    'Your company description goes here. This is a great place to introduce your business and its mission.',
  socials: {
    twitter: 'https://x.com/pprunty_',
    strava: 'https://www.strava.com/athletes/72636452',
    github: 'https://github.com/pprunty',
    linkedin: 'https://www.linkedin.com/in/patrickprunty/',
    reddit: '',
    tiktok: '',
    instagram: 'https://www.instagram.com/pprunty97/',
    youtube: 'https://www.youtube.com/@patrickprunty?sub_confirmation=1',
    email: '',
  },
  AUTH: {
    API_BASE_URL:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:9000'
        : 'https://api.tmplate.xyz',
  },
};

export default config;
