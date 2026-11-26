import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://boardprep.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/syllabus", "/sprint", "/games", "/login", "/register"],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/dashboard",
          "/planner",
          "/exams",
          "/mistakes",
          "/parent",
          "/onboarding",
        ],
      },
      // Prevent aggressive/malicious AI scrapers from indexing private routes
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "Anthropic-ai"],
        disallow: ["/api/*", "/admin/*", "/dashboard/*"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
