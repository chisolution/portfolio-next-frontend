import Head from "next/head";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    structuredData?: object;
    author?: string;
}

export default function SEO({
    title = "Portfolio | Software Developer",
    description = "Full scale software solutions specializing in modern web technologies. View my projects, experience, and get in touch.",
    keywords = ["software developer", "web development", "full-stack", "portfolio", "react", "next.js", "django", "python"],
    ogImage = "/images/og/default.png",
    ogType = "website",
    canonicalUrl,
    structuredData,
    author = "Muluh Dilane"
}: SEOProps) {
    const siteUrl = "https://portfolio-mct.netlify.app";
    const fullTitle = title.includes("|") ? title : `${title} | Portfolio`;
    const fullCanonicalUrl = canonicalUrl || siteUrl;
    const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(", ")} />
            <meta name="author" content={author} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#00ff9d" />
            <link rel="canonical" href={fullCanonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:site_name" content="Portfolio" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullCanonicalUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullOgImage} />

            {/* Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
            )}
        </Head>
    );
}
