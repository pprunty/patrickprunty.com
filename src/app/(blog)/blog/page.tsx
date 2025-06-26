import { allMdxPages, type MdxPage } from 'contentlayer/generated';
import { format } from 'date-fns';
import { Mdx } from '@/components/mdx-components';
import UniqueViewers from '@/components/unique-viewers';
import AnimatedSection from '@/components/animated-section';

export const dynamic = 'force-static';
export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function PostsPage() {
  // Filter and sort blog posts
  const blogPosts = allMdxPages
    .filter((post: MdxPage) => post.slug.startsWith('blog/'))
    .sort((a: MdxPage, b: MdxPage) => {
      const dateA = a.dateFromFilename || a.published;
      const dateB = b.dateFromFilename || b.published;
      if (!dateA || !dateB) return 0;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <div className="py-8">
      <UniqueViewers />
      
      <div>
        <div className="list-none space-y-12">
          {blogPosts.map((post: MdxPage, index: number) => {
            const displayDate = post.dateFromFilename || post.published;
            
            const ArticleContent = (
              <article className={`relative ${index > 0 ? "before:mx-auto before:content-[''] before:border-t before:border-gray-300 dark:before:border-[#444] before:block before:w-2/3 before:mb-8" : ""}`}>
                {/* Date positioned to the left */}
                {displayDate && (
                  <time 
                    dateTime={displayDate}
                    className={`absolute -left-32 ${index > 0 ? 'top-9' : 'top-1'} text-muted-foreground text-lg whitespace-nowrap hidden xl:block border-r-[5px] border-r-muted-foreground pr-4`}
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {format(new Date(displayDate), 'MMM d, yyyy')}
                  </time>
                )}
                
                {/* Mobile date */}
                {displayDate && (
                  <time 
                    dateTime={displayDate}
                    className="block xl:hidden text-muted-foreground text-lg mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {format(new Date(displayDate), 'MMMM d, yyyy')}
                  </time>
                )}
                
                <div className={`space-y-4 ${index > 0 ? 'mt-8' : ''}`}>
                  {post.title && (
                    <h3 className="text-3xl font-light leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                      {post.title}
                    </h3>
                  )}
                  
                  <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                    <Mdx code={post.body.code} />
                  </div>
                </div>
              </article>
            );

            return index < 3 ? (
              <AnimatedSection key={post.slug} delay={index * 150}>
                {ArticleContent}
              </AnimatedSection>
            ) : ArticleContent;
          })}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
