// contentlayer.config.ts
import { getHighlighter } from "@shikijs/compat";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { mdx } from "./config/app.config";

/**
 * ⚡  Single "MdxPage" type that matches ANY *.mdx file under /content
 *     No required front-matter → completely optional metadata.
 */
export const MdxPage = defineDocumentType(() => ({
  name: "MdxPage",
  contentType: "mdx",
  filePathPattern: "**/*.mdx", // <─ everything in /content
  fields: {
    title: { type: "string", required: false },
    description: { type: "string", required: false },
    published: { type: "date", required: false },
    author: { type: "string", required: false },
    image: { type: "string", required: false },
  },
  computedFields: {
    /**
     * slug ➜ used for the URL (e.g. blog/2025/hello-world)
     * slugAsParams ➜ same but without the leading folder (e.g. 2025/hello-world)
     */
    slug: { type: "string", resolve: (doc) => doc._raw.flattenedPath },
    slugAsParams: {
      type: "string",
      resolve: (doc) =>
        doc._raw.flattenedPath
          .split("/") // ['blog', '2025', 'hello-world']
          .slice(1) // drop the top-level folder ("blog")
          .join("/"), // '2025/hello-world'
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [MdxPage],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // Pre-process code blocks to preserve raw string
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") {
              return;
            }
            node.properties["__rawstring__"] = codeEl.children?.[0].value;
          }
        });
      },
      // Apply syntax highlighting
      [
        rehypePrettyCode,
        {
          getHighlighter,
          theme: mdx.codeTheme,
          keepBackground: mdx.codeHighlighting.keepBackground,
        },
      ],
      // Post-process to handle figure elements
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "figure") {
            if (!("data-rehype-pretty-code-figure" in node.properties)) {
              return;
            }
            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }
            preElement.properties["__rawstring__"] =
              node.properties["__rawstring__"];
            delete node.properties["__rawstring__"];
          }
        });
      },
    ],
  },
  onSuccess: async (allDocs) => {
    const docsArray = Array.isArray(allDocs) ? allDocs : [];
    const blogPosts = docsArray.filter((doc) => doc.slug.startsWith("blog/"));
    const otherPages = docsArray.filter((doc) => !doc.slug.startsWith("blog/"));

    console.log("📚 Contentlayer build completed:", {
      totalDocuments: docsArray.length,
      blogPosts: blogPosts.length,
      otherPages: otherPages.length,
    });
  },
});
