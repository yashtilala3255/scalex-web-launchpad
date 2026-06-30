import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  type: "application_submitted" | "status_updated" | "interview_scheduled" | "alert_digest";
  email: string;
  name: string;
  details: {
    jobTitle?: string;
    companyName?: string;
    oldStatus?: string;
    newStatus?: string;
    scheduledAt?: string;
    mode?: string;
    locationOrLink?: string;
    notes?: string;
    matchingJobs?: Array<{ title: string; location: string; slug: string }>;
  };
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

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const body: EmailPayload = await req.json();

    const { type, email, name, details } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing recipient email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "application_submitted":
        subject = `Application Received: ${details.jobTitle} at ${details.companyName}`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 5px;">ScaleXWeb Careers</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">Application Confirmation</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for applying for the position of <strong>${details.jobTitle}</strong> with <strong>${details.companyName}</strong>. We have successfully received your profile and resume details.</p>
            <p>Our recruitment department will review your application. If your profile matches our requirements, we will get in touch with you shortly.</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px;">
              <p style="margin: 0 0 5px 0;"><strong>Role:</strong> ${details.jobTitle}</p>
              <p style="margin: 0;"><strong>Company:</strong> ${details.companyName}</p>
            </div>
            <p style="color: #94a3b8; font-size: 11px;">This is an automated notification. Please do not reply directly to this email.</p>
          </div>
        `;
        break;

      case "status_updated":
        subject = `Application Status Update: ${details.jobTitle}`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 5px;">ScaleXWeb Careers</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">Application Status Update</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
            <p>Hello <strong>${name}</strong>,</p>
            <p>There has been an update regarding your application for the <strong>${details.jobTitle}</strong> position.</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px; text-align: center;">
              <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 5px;">New Stage</span>
              <span style="font-size: 16px; font-weight: bold; color: #4f46e5; background-color: #e0e7ff; padding: 4px 12px; border-radius: 9999px; display: inline-block;">
                ${details.newStatus?.replace("_", " ").toUpperCase()}
              </span>
            </div>
            ${details.notes ? `<p><strong>Recruiter Notes:</strong> <br/><span style="color: #475569; font-style: italic;">"${details.notes}"</span></p>` : ""}
            <p>Please check your candidate tracking dashboard for further details and interview guides.</p>
            <p style="color: #94a3b8; font-size: 11px; margin-top: 30px;">This is an automated notification. Please do not reply directly to this email.</p>
          </div>
        `;
        break;

      case "interview_scheduled":
        subject = `Interview Scheduled: ${details.jobTitle} - ScaleXWeb`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 5px;">ScaleXWeb Careers</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">Interview Invitation</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
            <p>Hello <strong>${name}</strong>,</p>
            <p>We are excited to invite you to an interview for the <strong>${details.jobTitle}</strong> position. Here are your schedule details:</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px;">
              <p style="margin: 0 0 8px 0;"><strong>Date & Time:</strong> ${details.scheduledAt}</p>
              <p style="margin: 0 0 8px 0;"><strong>Interview Mode:</strong> ${details.mode === "online" ? "Online Video Call" : "In-Person Office Visit"}</p>
              <p style="margin: 0 0 8px 0;"><strong>Meeting Location/Link:</strong> <br/><a href="${details.locationOrLink}" style="color: #4f46e5; word-break: break-all;">${details.locationOrLink}</a></p>
              ${details.notes ? `<p style="margin: 8px 0 0 0;"><strong>Interviewer Notes:</strong> <br/><span style="color: #475569; font-style: italic;">"${details.notes}"</span></p>` : ""}
            </div>
            <p>Please log in to your tracker dashboard if you need to request a reschedule or leave feedback.</p>
            <p style="color: #94a3b8; font-size: 11px; margin-top: 30px;">This is an automated notification. Please do not reply directly to this email.</p>
          </div>
        `;
        break;

      case "alert_digest":
        subject = `ScaleXWeb Careers: New matching jobs found!`;
        const jobListHtml = details.matchingJobs
          ?.map(
            (j) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 13px;">
            <h4 style="margin: 0 0 5px 0; color: #1e293b;">${j.title}</h4>
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 11px;">Location: ${j.location}</p>
            <a href="https://scalexweb.com/jobs/${j.slug}" style="color: #4f46e5; text-decoration: none; font-weight: bold; font-size: 11px;">View Job Details &rarr;</a>
          </div>
        `
          )
          .join("");

        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 5px;">ScaleXWeb Careers</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">Your Job Search Digest</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Here are the latest job opportunities published on ScaleXWeb that match your active alert parameters:</p>
            <div style="margin: 20px 0;">
              ${jobListHtml}
            </div>
            <p>To modify your notification alerts or unsubscribe, visit your candidate dashboard settings.</p>
            <p style="color: #94a3b8; font-size: 11px; margin-top: 30px;">This is an automated notification. Please do not reply directly to this email.</p>
          </div>
        `;
        break;
    }

    // Call Resend Mailer API
    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "ScaleXWeb Careers <careers@scalexweb.com>",
          to: [email],
          subject: subject,
          html: htmlContent,
        }),
      });

      if (!emailResponse.ok) {
        const errText = await emailResponse.text();
        console.error("Resend API dispatch failure:", errText);
        return new Response(JSON.stringify({ error: "Failed to dispatch email", details: errText }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      console.warn("RESEND_API_KEY env key is not configured. Email logged: ", { subject, email });
    }

    return new Response(JSON.stringify({ message: "Email notification dispatched successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
