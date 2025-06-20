import { ReactNode, Children } from 'react';

// Link SVG icon component
const LinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71" />
  </svg>
);

export function withHeadingId(children: ReactNode): ReactNode {
  return Children.map(children, (el) => {
    // Check if `el` is a string
    if (typeof el === 'string') {
      const re = /\[#([^\]]+)\]\s*$/m;
      const match = el.match(re);

      if (match && match[1]?.length) {
        return (
          <span className="relative group">
            <a
              className={`
                absolute
                -left-[1.5rem]
                top-[0.125rem]
                opacity-0
                group-hover:opacity-100
                text-gray-400
                hover:text-gray-600
                dark:text-gray-500
                dark:hover:text-gray-400
                transition-opacity
                duration-200
                flex
                items-center
                justify-center
                w-5
                h-5
              `}
              href={`#${match[1]}`}
              aria-label={`Link to ${match[1]}`}
            >
              <LinkIcon />
            </a>
            <a
              id={match[1]}
              className={`
              absolute
              -top-[20px]
            `}
            />
            {el.substring(0, match.index)} {/* Remove matched part */}
          </span>
        );
      }
    }

    // Return the element as-is if it's not a string or doesn't match the pattern
    return el;
  });
}
