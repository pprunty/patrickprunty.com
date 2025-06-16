export const experiences = [
  {
    title: 'ar developer, departd',
    year: '‘23-‘24',
    links: 'https://departd.de',
  },
  {
    title: 'creative technologist, xorxor',
    year: '‘21-‘23',
    links: 'https://xorxor.hu',
  },
  {
    title: 'tech & research intern, ericsson',
    year: '‘19-‘20',
    links: 'https://www.ericsson.hu',
  },
];

export const projects = [
  {
    title: 'deltacomponents.dev',
    year: 'now',
    links: 'https://deltacomponents.dev/',
    img: './projects/delta-components.webp',
    media: [],
    description:
      'Open-source UI components for React, built for speed and modern design.',
  },
  {
    title: 'magikarp',
    year: 'now',
    links: 'https://github.com/pprunty/magikarp',
    img: './projects/magikarp.png',
    media: [],
    description:
      'A Go framework for building customizable, plugin-based AI agents.',
  },
  {
    title: 'tmplate.xyz',
    year: '2025',
    links: 'https://tmplate.xyz/',
    img: './img/tmplate.webp',
    media: [],
    description:
      'A modern SaaS starter kit with Next.js, FastAPI, and built-in SEO.',
  },
  {
    title: 'motormongo',
    year: '2023',
    links: 'https://motormongo.readthedocs.io/en/latest/',
    img: './projects/motormongo.png',
    media: [],
    description:
      'Async MongoDB ODM for Python, offering a familiar, non-blocking API.',
  },
];

export const writing = [
  {
    title: 'furry circuits (essays & newsletter)',
    year: '2025',
    links: 'https://pprunty.substack.com',
    img: './projects/furry-circuits.png',
    media: [
      { type: 'image', src: '/projects/furry-circuits/furry-circuits-1.png' },
    ],
    description:
      'Substack exploring artificial intelligence, cultural trends, and creative media.',
  },
];

export const youtube = [
  {
    title: 'pixel projects',
    year: 'soon',
    links:
      'https://www.youtube.com/channel/UC5OToaksgWe-pjkgqPkUZkw?sub_confirmation=1',
    img: './projects/pixel-projects.webp',
    media: [
      { type: 'youtube' as const, src: 'DcYLT37ImBY' },
      { type: 'youtube' as const, src: 'wjZofJX0v4M' },
    ],
    description:
      'Animated YouTube series making math and computer science fun and accessible.',
  },
  {
    title: 'patrick prunty',
    year: '2025',
    links: 'https://www.youtube.com/@pprunty?sub_confirmation=1',
    media: [],
    description:
      'Experimental channel remixing pop culture and media through creative edits.',
  },
];

export const socials = [
  {
    name: 'x/twitter',
    links:
      'https://x.com/intent/follow?screen_name=pprunty_&original_referer=https://patrickprunty.com/',
  },
  {
    name: 'github',
    links: 'https://github.com/pprunty',
  },
  {
    name: 'linkedin',
    links: 'https://www.linkedin.com/in/patrickprunty/',
  },
  {
    name: 'strava',
    links: 'https://www.strava.com/athletes/72636452',
  },
  {
    name: 'rss',
    links: 'https://patrickprunty.com/api/rss',
  },
];

export const sectionConfigs = {
  writing: {
    title: 'writing',
    baseDelay: 3,
    showImages: false,
    useList: false,
  },
  youtube: {
    title: 'youtube',
    baseDelay: 7,
    showImages: true,
    useList: true,
  },
  software: {
    title: 'software',
    baseDelay: 11,
    showImages: true,
    useList: true,
  },
};
