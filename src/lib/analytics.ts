const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-9KBGB4TYB1";

// Declare gtag types on window
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    [key: string]: any;
  }
}

export const isAnalyticsLoaded = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

export const loadGoogleAnalytics = () => {
  if (typeof window === "undefined") return;

  // Check if already loaded
  if (isAnalyticsLoaded()) return;

  // Check if we are in production
  const isProd = import.meta.env.PROD || import.meta.env.NODE_ENV === "production";
  if (!isProd) {
    console.log("[Analytics] Disabled in non-production mode.");
    return;
  }

  try {
    // Explicitly enable tracking (in case it was disabled previously)
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

    // Inject Google Tag script tag
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize datalayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Configure GA4
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false // We trigger page_view manually on client-side route changes
    });

    console.log(`[Analytics] Google Analytics (${GA_MEASUREMENT_ID}) initialized successfully.`);
  } catch (err) {
    console.error("[Analytics] Error loading GA4:", err);
  }
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window === "undefined") return;

  if (isAnalyticsLoaded()) {
    window.gtag("event", eventName, params);
  } else {
    // If not loaded, we can queue or log to console in dev mode
    if (!import.meta.env.PROD) {
      console.log(`[Analytics Mock] Event tracked: ${eventName}`, params);
    }
  }
};

export const disableGoogleAnalytics = () => {
  if (typeof window === "undefined") return;

  // Set the disable flag
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  
  // Clear GA cookies
  try {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      if (name.startsWith("_ga") || name === "_gid") {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Also clear domain variants
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname + ";";
      }
    }
    console.log(`[Analytics] Google Analytics (${GA_MEASUREMENT_ID}) disabled and cookies cleared.`);
  } catch (err) {
    console.error("[Analytics] Error disabling GA4:", err);
  }
};
