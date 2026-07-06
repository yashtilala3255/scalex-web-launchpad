import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestPayload {
  action: "subscribe" | "confirm" | "get-preferences" | "update-preferences" | "unsubscribe" | "send-campaign";
  email?: string;
  name?: string;
  token?: string;
  topics?: string[];
  frequency?: string;
  reason?: string;
  campaignId?: string;
}

serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const origin = req.headers.get("origin") || "https://scalexweb.tech";

    // Handle GET requests (open tracking pixel and click redirect tracking)
    if (req.method === "GET") {
      const url = new URL(req.url);
      const action = url.searchParams.get("action") || "";
      const logId = url.searchParams.get("logId") || "";
      const destinationUrl = url.searchParams.get("url") || "";

      if (action === "track-open" && logId) {
        // Mark as opened in send logs
        const { data: logData } = await supabase
          .from("newsletter_send_logs")
          .update({ opened_at: new Date().toISOString() })
          .eq("id", logId)
          .is("opened_at", null)
          .select("campaign_id")
          .maybeSingle();

        if (logData?.campaign_id) {
          // Increment campaign open_count
          const { data: camp } = await supabase
            .from("newsletter_campaigns")
            .select("open_count")
            .eq("id", logData.campaign_id)
            .single();
          if (camp) {
            await supabase
              .from("newsletter_campaigns")
              .update({ open_count: camp.open_count + 1 })
              .eq("id", logData.campaign_id);
          }
        }

        // Return 1x1 transparent tracking GIF
        const transparentGif = new Uint8Array([
          0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
          0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00,
          0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
          0x00, 0x02, 0x02, 0x4c, 0x01, 0x00, 0x3b
        ]);
        return new Response(transparentGif, {
          headers: {
            "Content-Type": "image/gif",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            ...corsHeaders,
          },
        });
      }

      if (action === "track-click" && logId && destinationUrl) {
        // Mark as clicked in send logs
        const { data: logData } = await supabase
          .from("newsletter_send_logs")
          .update({ clicked_at: new Date().toISOString() })
          .eq("id", logId)
          .is("clicked_at", null)
          .select("campaign_id")
          .maybeSingle();

        if (logData?.campaign_id) {
          // Increment campaign click_count
          const { data: camp } = await supabase
            .from("newsletter_campaigns")
            .select("click_count")
            .eq("id", logData.campaign_id)
            .single();
          if (camp) {
            await supabase
              .from("newsletter_campaigns")
              .update({ click_count: camp.click_count + 1 })
              .eq("id", logData.campaign_id);
          }
        }

        // Redirect to target URL
        return new Response(null, {
          status: 302,
          headers: {
            Location: destinationUrl,
            ...corsHeaders,
          },
        });
      }

      return new Response(JSON.stringify({ error: "Invalid GET endpoint parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // POST Requests
    const body: RequestPayload = await req.json();
    const { action, email, name, token, topics, frequency, reason, campaignId } = body;

    const cleanEmail = email ? email.trim().toLowerCase() : "";

    // Helper to send email via Resend
    const sendEmail = async (to: string, subject: string, html: string) => {
      if (!resendApiKey) {
        console.warn("RESEND_API_KEY is not configured. Logged: ", { to, subject });
        return true;
      }
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "ScaleXWeb Solutions <info@scalexweb.tech>",
          to: [to],
          reply_to: "scalexwebsolution@gmail.com",
          subject: subject,
          html: html,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend send failure: ${errText}`);
      }
      return true;
    };

    switch (action) {
      case "subscribe": {
        if (!cleanEmail) throw new Error("Email is required");
        const secureToken = crypto.randomUUID();

        const { data: existing, error: fetchErr } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existing) {
          if (existing.status === "confirmed") {
            return new Response(JSON.stringify({ error: "This email is already subscribed." }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            });
          }

          const { error: updateErr } = await supabase
            .from("newsletter_subscribers")
            .update({
              name: name || existing.name,
              status: "confirmed",
              token: secureToken,
              topics: topics || existing.topics,
              frequency: frequency || existing.frequency,
              confirmed_at: new Date().toISOString()
            })
            .eq("id", existing.id);

          if (updateErr) throw updateErr;
        } else {
          const { error: insertErr } = await supabase
            .from("newsletter_subscribers")
            .insert({
              email: cleanEmail,
              name: name || null,
              status: "confirmed",
              token: secureToken,
              topics: topics || ["jobs", "company-news", "product-updates"],
              frequency: frequency || "weekly",
              confirmed_at: new Date().toISOString()
            });

          if (insertErr) throw insertErr;
        }

        const preferencesLink = `${origin}/newsletter/preferences?token=${secureToken}&email=${encodeURIComponent(cleanEmail)}`;
        const unsubscribeLink = `${origin}/newsletter/unsubscribe?token=${secureToken}&email=${encodeURIComponent(cleanEmail)}`;
        
        const welcomeHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <h2 style="color: #4f46e5; margin-bottom: 5px; font-weight: 800;">ScaleXWeb Solutions</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">Welcome to our community</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
            <p style="font-size: 15px; color: #334155; line-height: 1.6;">Hello${name ? ` <strong>${name}</strong>` : ""},</p>
            <p style="font-size: 15px; color: #334155; line-height: 1.6;">Your subscription is now active! We are thrilled to have you join our newsletter community.</p>
            <p style="font-size: 15px; color: #334155; line-height: 1.6;">You'll start receiving web development strategies, SaaS product launching tips, and case studies to help your business scale efficiently.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${preferencesLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 30px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                Manage Preferences Center
              </a>
            </div>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;"/>
            <div style="color: #94a3b8; font-size: 11px; line-height: 1.6; text-align: center;">
              ScaleXWeb Solutions, Ahmedabad, Gujarat, India. <br/>
              Want to stop receiving these? <a href="${unsubscribeLink}" style="color: #4f46e5; text-decoration: underline;">Unsubscribe</a> instantly.
            </div>
          </div>
        `;

        await sendEmail(cleanEmail, "Welcome to ScaleXWeb Solutions Newsletter!", welcomeHtml);

        return new Response(JSON.stringify({ message: "Subscribed successfully!" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      case "confirm": {
        if (!token || !cleanEmail) throw new Error("Verification parameters are required");

        const { data: sub, error: fetchErr } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .eq("email", cleanEmail)
          .eq("token", token)
          .maybeSingle();

        if (fetchErr) throw fetchErr;
        if (!sub) {
          return new Response(JSON.stringify({ error: "Invalid token or email address." }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        if (sub.status !== "confirmed") {
          const { error: confirmErr } = await supabase
            .from("newsletter_subscribers")
            .update({
              status: "confirmed",
              confirmed_at: new Date().toISOString(),
            })
            .eq("id", sub.id);

          if (confirmErr) throw confirmErr;

          const preferencesLink = `${origin}/newsletter/preferences?token=${token}&email=${encodeURIComponent(cleanEmail)}`;
          const unsubscribeLink = `${origin}/newsletter/unsubscribe?token=${token}&email=${encodeURIComponent(cleanEmail)}`;
          
          const welcomeHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
              <h2 style="color: #4f46e5; margin-bottom: 5px; font-weight: 800;">ScaleXWeb Solutions</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 0;">Welcome to our community</p>
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
              <p style="font-size: 15px; color: #334155; line-height: 1.6;">Hello${sub.name ? ` <strong>${sub.name}</strong>` : ""},</p>
              <p style="font-size: 15px; color: #334155; line-height: 1.6;">Your subscription is now active! We are thrilled to have you join our newsletter community.</p>
              <p style="font-size: 15px; color: #334155; line-height: 1.6;">You'll start receiving web development strategies, SaaS product launching tips, and case studies to help your business scale efficiently.</p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${preferencesLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 30px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                  Manage Preferences Center
                </a>
              </div>
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;"/>
              <div style="color: #94a3b8; font-size: 11px; line-height: 1.6; text-align: center;">
                ScaleXWeb Solutions, Ahmedabad, Gujarat, India. <br/>
                Want to stop receiving these? <a href="${unsubscribeLink}" style="color: #4f46e5; text-decoration: underline;">Unsubscribe</a> instantly.
              </div>
            </div>
          `;

          await sendEmail(cleanEmail, "Welcome to ScaleXWeb Solutions Newsletter!", welcomeHtml);
        }

        return new Response(JSON.stringify({ message: "Subscription confirmed successfully!" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      case "get-preferences": {
        if (!token || !cleanEmail) throw new Error("Security credentials are required");

        const { data: sub, error: fetchErr } = await supabase
          .from("newsletter_subscribers")
          .select("name, email, topics, frequency, status")
          .eq("email", cleanEmail)
          .eq("token", token)
          .maybeSingle();

        if (fetchErr) throw fetchErr;
        if (!sub) {
          return new Response(JSON.stringify({ error: "Invalid token or email address." }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        return new Response(JSON.stringify({ preferences: sub }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      case "update-preferences": {
        if (!token || !cleanEmail) throw new Error("Security credentials are required");
        if (!topics || !frequency) throw new Error("Topics and frequency are required");

        const { data: sub, error: fetchErr } = await supabase
          .from("newsletter_subscribers")
          .select("id")
          .eq("email", cleanEmail)
          .eq("token", token)
          .maybeSingle();

        if (fetchErr) throw fetchErr;
        if (!sub) {
          return new Response(JSON.stringify({ error: "Invalid token or email address." }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const { error: updateErr } = await supabase
          .from("newsletter_subscribers")
          .update({
            name: name || null,
            topics: topics,
            frequency: frequency,
            status: 'confirmed'
          })
          .eq("id", sub.id);

        if (updateErr) throw updateErr;

        return new Response(JSON.stringify({ message: "Preferences updated successfully!" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      case "unsubscribe": {
        if (!token || !cleanEmail) throw new Error("Security credentials are required");

        const { data: sub, error: fetchErr } = await supabase
          .from("newsletter_subscribers")
          .select("id")
          .eq("email", cleanEmail)
          .eq("token", token)
          .maybeSingle();

        if (fetchErr) throw fetchErr;
        if (!sub) {
          return new Response(JSON.stringify({ error: "Invalid token or email address." }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const { error: unsubErr } = await supabase
          .from("newsletter_subscribers")
          .update({
            status: "unsubscribed",
            unsubscribed_at: new Date().toISOString(),
            unsubscribed_reason: reason || "No feedback left"
          })
          .eq("id", sub.id);

        if (unsubErr) throw unsubErr;

        // If unsubscribed from a specific campaign link, increment its unsubscribe count
        const urlObj = new URL(req.url);
        const refCampaignId = urlObj.searchParams.get("campaignId") || campaignId;
        if (refCampaignId) {
          const { data: camp } = await supabase
            .from("newsletter_campaigns")
            .select("unsubscribe_count")
            .eq("id", refCampaignId)
            .single();
          if (camp) {
            await supabase
              .from("newsletter_campaigns")
              .update({ unsubscribe_count: camp.unsubscribe_count + 1 })
              .eq("id", refCampaignId);
          }
        }

        return new Response(JSON.stringify({ message: "Unsubscribed successfully!" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      case "send-campaign": {
        if (!campaignId) throw new Error("Campaign ID is required");

        // 1. Get campaign details
        const { data: camp, error: campErr } = await supabase
          .from("newsletter_campaigns")
          .select("*")
          .eq("id", campaignId)
          .single();

        if (campErr) throw campErr;
        if (!camp) throw new Error("Campaign not found");

        // 2. Fetch target confirmed subscribers
        const { data: subs, error: subsErr } = await supabase
          .from("newsletter_subscribers")
          .select("id, email, name, token, topics")
          .eq("status", "confirmed");

        if (subsErr) throw subsErr;

        // Filter subscribers in Deno that overlap with segment_topics
        const targets = (subs || []).filter((s) => {
          const subTopics = s.topics || [];
          const campTopics = camp.segment_topics || [];
          return campTopics.some((t: string) => subTopics.includes(t));
        });

        if (targets.length === 0) {
          // Update campaign status
          await supabase
            .from("newsletter_campaigns")
            .update({ status: "sent", sent_count: 0, sent_at: new Date().toISOString() })
            .eq("id", campaignId);

          return new Response(JSON.stringify({ message: "No subscribers matched this segment." }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        // 3. Batch dispatch to avoid timeouts and rate limits (10 emails/second chunking)
        const batchSize = 10;
        let successfulSends = 0;

        for (let i = 0; i < targets.length; i += batchSize) {
          const chunk = targets.slice(i, i + batchSize);

          await Promise.all(
            chunk.map(async (sub) => {
              try {
                // Insert a send log row to get a unique tracker ID
                const { data: logRow, error: logErr } = await supabase
                  .from("newsletter_send_logs")
                  .insert({
                    campaign_id: campaignId,
                    subscriber_id: sub.id,
                  })
                  .select("id")
                  .single();

                if (logErr) throw logErr;

                const logId = logRow.id;

                // Setup customized email links
                const unsubscribeLink = `${origin}/newsletter/unsubscribe?token=${sub.token}&email=${encodeURIComponent(sub.email)}&campaignId=${campaignId}`;
                const preferencesLink = `${origin}/newsletter/preferences?token=${sub.token}&email=${encodeURIComponent(sub.email)}`;
                const openPixel = `${origin}/functions/v1/newsletter-emails?action=track-open&logId=${logId}`;

                // Regex wrap all external links inside content for click tracking
                const wrapLinks = (htmlContent: string) => {
                  const hrefRegex = /href="([^"]+)"/g;
                  return htmlContent.replace(hrefRegex, (match, url) => {
                    if (
                      url.includes("/newsletter/unsubscribe") ||
                      url.includes("/newsletter/preferences") ||
                      url.startsWith("#") ||
                      url.startsWith("mailto:")
                    ) {
                      return match;
                    }
                    return `href="${origin}/functions/v1/newsletter-emails?action=track-click&logId=${logId}&url=${encodeURIComponent(url)}"`;
                  });
                };

                const trackedBody = wrapLinks(camp.content);

                // Build full modern email layout
                const emailHtml = `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                    <!-- Branding Header -->
                    <div style="text-align: center; margin-bottom: 20px;">
                      <h2 style="color: #4f46e5; margin: 0; font-weight: 800; letter-spacing: -0.025em;">ScaleXWeb Solutions</h2>
                      <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">Engineering Newsletter</span>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 25px;"/>
                    
                    <!-- Content -->
                    <div style="font-size: 15px; color: #334155; line-height: 1.6;">
                      ${trackedBody}
                    </div>

                    <!-- Modern Footer -->
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 30px; margin-bottom: 20px;"/>
                    <div style="color: #94a3b8; font-size: 11px; line-height: 1.6; text-align: center;">
                      ScaleXWeb Solutions, Ahmedabad, Gujarat, India. <br/>
                      You received this email because you subscribed to our digital strategy newsletter. <br/>
                      <a href="${preferencesLink}" style="color: #4f46e5; text-decoration: underline; font-weight: bold;">Manage Preferences</a> &bull; 
                      <a href="${unsubscribeLink}" style="color: #4f46e5; text-decoration: underline; font-weight: bold;">Unsubscribe Instantly</a>
                    </div>
                    <!-- Open tracking pixel -->
                    <img src="${openPixel}" width="1" height="1" style="display: none !important;" />
                  </div>
                `;

                await sendEmail(sub.email, camp.subject, emailHtml);
                successfulSends++;
              } catch (sendErr) {
                console.error(`Failed sending to ${sub.email}:`, sendErr);
              }
            })
          );

          // Rate-limiting delay of 1 second between chunks
          if (i + batchSize < targets.length) {
            await new Promise((r) => setTimeout(r, 1000));
          }
        }

        // 4. Update campaign execution stats
        await supabase
          .from("newsletter_campaigns")
          .update({
            status: "sent",
            sent_count: successfulSends,
            sent_at: new Date().toISOString(),
          })
          .eq("id", campaignId);

        return new Response(JSON.stringify({ message: `Campaign sent to ${successfulSends} subscribers.` }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action type" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }
  } catch (err: any) {
    console.error("Newsletter API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
