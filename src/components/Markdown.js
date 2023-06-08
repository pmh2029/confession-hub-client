import { Typography } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import "./markdown.css";

const Markdown = ({ content }) => {
  const disallowed = ["Image"];

  return (
    <Typography component="span">
      <ReactMarkdown
        className="markdown"
        style={{ "&p": { margin: 0 } }}
        disallowedElements={disallowed}
        skipHtml={false}
        children={content}
        components={{
          img: ({ node, ...props }) => (
            <img style={{ maxWidth: "450px" }} {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre
              style={{
                backgroundColor: "#DCDCDC",
                maxWidth: "450px",
                marginBlock: "5px",
                wordWrap: "break-word",
              }}
              {...props}
            />
          ),
          a: ({ node, ...props }) => <a target="_blank" {...props} />,
        }}
      />
    </Typography>
  );
};

export default Markdown;
