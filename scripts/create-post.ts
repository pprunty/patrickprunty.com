import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp'; // Import sharp for image processing
import boxen, { Options } from 'boxen'; // Import boxen for styled logs
import { AUTHOR, SITE_URL } from '../src/config'; // Import AUTHOR and SITE_URL from config

// Utility function to format post title as slug
const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -

// Function to validate date format and provide a default if invalid
const validateOrDefaultDate = (input: string): string => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Regex for YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0]; // Get today's date
  if (dateRegex.test(input)) {
    return input; // If valid date, return it
  } else {
    console.log(
      boxen(`⚠️ Invalid date provided. Defaulting to today's date: ${currentDate}`, {
        padding: 1,
        margin: 1,
        borderStyle: 'round' as Options['borderStyle'], // Cast to valid type
      })
    );
    return currentDate; // Default to current date if invalid
  }
};

// Display an initial prompt to the user to inform them about skipping inputs
console.log(
  boxen(
    '📝 Press "Enter" to skip any input (except the title).\nYou can complete it later in the generated page.mdx file!',
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round' as Options['borderStyle'], // Cast to valid type
    }
  )
);

interface PostAnswers {
  title: string;
  description: string;
  date: string;
  image: string;
  keywords: string;
  author: string;
  authorUrl: string;
}

async function createPost(): Promise<void> {
  // Get author and authorUrl from config file
  const defaultAuthor = AUTHOR.name || "Patrick Prunty";
  const defaultAuthorUrl = AUTHOR.url || "https://patrickprunty.com";

  // Prompt the user for post details
  const answers: PostAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of your post:',
      validate: (input) => input.trim() !== '' || '⚠️ Title is required', // Validate that title is not empty
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter the description of your post:',
    },
    {
      type: 'input',
      name: 'date',
      message: "Enter the date of your post (YYYY-MM-DD) [Default: Today's date]:",
      default: new Date().toISOString().split('T')[0],
      filter: validateOrDefaultDate, // Use filter to modify invalid date input
    },
    {
      type: 'input',
      name: 'image',
      message: 'Enter the image for your post (absolute path):',
      default: '_placeholders/no-image.png',
    },
    {
      type: 'input',
      name: 'keywords',
      message: 'Enter keywords for your post (comma separated):',
    },
    {
      type: 'input',
      name: 'author',
      message: `Enter the author of your post [Default: ${defaultAuthor}]:`,
      default: defaultAuthor,
    },
    {
      type: 'input',
      name: 'authorUrl',
      message: `Enter the author's URL [Default: ${defaultAuthorUrl}]:`,
      default: defaultAuthorUrl,
    },
  ]);

  // Strip leading and trailing whitespace from inputs
  const cleanedAnswers = {
    title: answers.title.trim(),
    description: answers.description.trim(),
    date: answers.date, // No need to trim since it's already validated and formatted
    image: answers.image.trim(),
    keywords: answers.keywords.trim(),
    author: answers.author.trim(),
    authorUrl: answers.authorUrl.trim(),
  };

  // Generate the slug and directory
  const slug = slugify(cleanedAnswers.title);
  const postDir = path.join(process.cwd(), 'src', 'posts', slug); // Use process.cwd() for root directory

  // Create the directory for the post
  fs.ensureDirSync(postDir);

  // If the image is not the default, convert it to .webp and copy it to the public/images/{slug} directory
let imageName = `${path.basename(cleanedAnswers.image, path.extname(cleanedAnswers.image))}.webp`; // Convert image name to .webp
const imageSlugDir = path.join(process.cwd(), 'public', 'images', slug); // Use process.cwd() for the image path
const imageDestination = path.join(imageSlugDir, imageName); // Define the destination path for the converted image

if (cleanedAnswers.image === '_placeholders/no-image.png') {
  // Handle default image separately
  imageName = 'no-image.webp'; // Default image name
  try {
    fs.ensureDirSync(imageSlugDir); // Ensure the slug directory exists
    // Copy the default image to the post's image directory
    fs.copySync(path.join(process.cwd(), 'public', 'images', '_placeholders/no-image.png'), path.join(imageSlugDir, imageName));

    console.log(
      boxen(
        `ℹ️ Default placeholder image has been copied to ${imageDestination}`,
        { padding: 1, margin: 1, borderStyle: 'double' as Options['borderStyle'] }
      )
    );
  } catch (err) {
    console.error(
      boxen(
        `❌ Failed to copy default image: ${(err as Error).message}`,
        { padding: 1, margin: 1, borderStyle: 'double' as Options['borderStyle'] }
      )
    );
  }
} else {
  // Process custom image
  try {
    fs.ensureDirSync(imageSlugDir); // Ensure the slug directory exists

    // Convert the image to .webp format and save it to the destination
    await sharp(cleanedAnswers.image)
      .webp({ quality: 100 }) // Convert to .webp with 80% quality
      .toFile(imageDestination);

    // Create a success message box
    const message = `✅ Image has been converted to .webp and copied to ${imageDestination}`;
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: 'double' as Options['borderStyle'], // Cast to valid type
      })
    );
  } catch (err) {
    // Create an error message box
    const errorMessage = `❌ Failed to convert and copy image: ${(err as Error).message}`;
    console.error(
      boxen(errorMessage, {
        padding: 1,
        margin: 1,
        borderStyle: 'double' as Options['borderStyle'], // Cast to valid type
      })
    );
  }
}

 if (imageName === "_placeholders/no-image.png") {
 const infoMessage = `ℹ️ Default image placeholder: 'no-image.webp' will be used since you did not specify an image.\nYou can update metadata.image.url in your page.mdx later to add a custom image.`;
     imageName = cleanedAnswers.image;
     console.log(
       boxen(infoMessage, {
         padding: 1,
         margin: 1,
         borderStyle: 'double' as Options['borderStyle'], // Cast to valid type
       })
     );
 }

  // Define the MDX content
  const mdxContent = `import { SITE_URL } from '@/config';

export const metadata = {
  title: "${cleanedAnswers.title}",
  description: "${cleanedAnswers.description}",
  image: "/images/${slug}/${imageName}",
  date: "${cleanedAnswers.date}",
  author: "${cleanedAnswers.author}",
  authorUrl: "${cleanedAnswers.authorUrl}",
  openGraph: {
    title: "${cleanedAnswers.title}",
    description: "${cleanedAnswers.description}",
    url: "/blog/${slug}",
    images: [
      {
        url: \`/images/${slug}/${imageName}\`,
        alt: "${cleanedAnswers.title}",
      },
    ],
    type: 'article',
    tags: [${cleanedAnswers.keywords.split(',').map((kw) => `"${kw.trim()}"`).join(', ')}],
  },
  twitter: {
    card: "summary_large_image",
    title: "${cleanedAnswers.title}",
    description: "${cleanedAnswers.description}",
    image: \`\${SITE_URL}/images/${slug}/${imageName}\`,
  },
  keywords: [${cleanedAnswers.keywords.split(',').map((kw) => `"${kw.trim()}"`).join(', ')}],
  slug: "${slug}",
  readingTime: 1,
  draft: true
};

Start adding your blog post content here...
`;

  // Write the MDX file
  const mdxFilePath = path.join(postDir, 'page.mdx');
  fs.writeFileSync(mdxFilePath, mdxContent, 'utf8');


  // Boxed log for post creation
const imageMessage = cleanedAnswers.image === '_placeholders/no-image.png'
  ? `⚠️  Default image 'no-image.webp' has been used since you skipped this input.\nYou can update metadata.image.url in your page.mdx later to add a custom image.`
  : `    Your image has been web-optimized and saved to:\npublic/images/${slug}/${imageName}`;

const combinedMessage = [
  `✅ Your post "${cleanedAnswers.title}" has been created successfully!`,
  ``,
  `📁 File location:`,
  `   ${mdxFilePath}`,
  ``,
  `🏞️ Image optimization:`,
  imageMessage,  // Add the conditional image message
  ``,
  `💡 Tip: Store all images for this post in the public/images/${slug}/ directory`,
  ``,
  `✏️  Next steps:`,
  `   1. Open the created file`,
  `   2. Start writing your content`,
  `   3. Add any additional images to the post's image directory`,
  ``,
  `Happy writing! 🚀`
].join('\n');

  console.log(
    boxen(combinedMessage, {
      padding: 1,
      margin: 1,
      borderStyle: 'double' as Options['borderStyle'], // Cast to valid type
    })
  );
}

// Run the function to create the post
createPost();
