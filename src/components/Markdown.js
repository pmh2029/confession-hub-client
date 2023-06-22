import { Typography } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";

import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you
import "./markdown.css";

const Markdown = ({ content }) => {
  const disallowed = ["Image"];

  return (
    <Typography component="span">
      <ReactMarkdown
        className="markdown"
        style={{ "&p": { margin: 0 } }}
        disallowedElements={disallowed}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        skipHtml={false}
        children={content}
        components={{
          img: ({ node, ...props }) => (
            <img style={{ maxWidth: "450px", margin: "5px" }} {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre
              style={{
                backgroundColor: "#DCDCDC",
                maxWidth: "450px",
                margin: "5px",
              }}
              {...props}
            />
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "js";
            return (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, "")}
                style={monokaiSublime}
                showLineNumbers={true}
                customStyle={{
                  fontSize: "10px",
                }}
                language={language}
                PreTag="div"
              />
            );
          },
          p: ({ node, ...props }) => (
            <p
              style={{
                wordBreak: "break-word",
                maxWidth: "450px",
                margin: "5px",
              }}
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              target="_blank"
              style={{
                color: "#1976d2",
                cursor: "pointer",
              }}
              {...props}
            />
          ),
        }}
      />
    </Typography>
  );
};

export default Markdown;
