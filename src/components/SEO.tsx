import { Helmet } from "react-helmet-async";

const SITE = "https://scalexweb.lovable.app";
const DEFAULT_IMAGE = "https://scalexweb.lovable.app/logo.png";
const DEFAULT_KEYWORDS = "web development company, SaaS development company, mobile app development company, UI UX design agency, ecommerce development company, custom software development, full stack development services, digital agency Ahmedabad, ScaleXWeb Solutions";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  jsonLd?: object | object[];
  robots?: string;
  themeColor?: string;
  lang?: string;
  image?: string;
}

const SEO = ({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  path,
  jsonLd,
  robots = "index, follow",
  themeColor = "#fafafa", // Custom HSL light background color
  lang = "en",
  image = DEFAULT_IMAGE,
}: SEOProps) => {
  const url = path ? `${SITE}${path}` : SITE;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      {/* Language HTML Tag */}
      <html lang={lang} />

      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="theme-color" content={themeColor} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ScaleXWeb Solutions" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@ScaleXWeb" />
      <meta property="twitter:creator" content="@ScaleXWeb" />

      {/* JSON-LD Structured Data */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;

