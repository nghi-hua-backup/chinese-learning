import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/chinese-learning",
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname, ".."),
  outputFileTracingIncludes: {
    "/*": ["../chinese-learning/knowledge-base/**"],
  },
};

export default nextConfig;
