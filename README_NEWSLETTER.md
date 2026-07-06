# ScaleXWeb Solutions - Newsletter & Campaign Management System Setup

This document explains how to set up, configure, and manage the custom newsletter and campaign system.

---

## 1. Environment Variables Configuration

Make sure your Supabase Project has the following secrets configured (go to **Settings -> API -> Edge Function Secrets** or use Supabase CLI):

* **`SUPABASE_URL`**: Your project URL (e.g., `https://murtkrgltllexguvccwc.supabase.co`).
* **`SUPABASE_SERVICE_ROLE_KEY`**: Your service role key (enables database operations bypassing Row Level Security).
* **`RESEND_API_KEY`**: API Key from Resend dashboard (starts with `re_...`).

---

## 2. Setting Up Domain Verification (SPF, DKIM, DMARC)

To send campaigns successfully from `info@scalexweb.tech` instead of a generic domain, configure these DNS records in your domain provider control panel (e.g., Hostinger, GoDaddy):

### A. DKIM (DomainKeys Identified Mail)
Resend will generate 3 CNAME records during domain registration. Add them to your DNS settings:
* **Type**: `CNAME`
* **Host**: (Provided by Resend, e.g., `resend._domainkey`)
* **Value**: (Provided by Resend, e.g., `dkim.resend.com`)

### B. SPF (Sender Policy Framework)
If you do not have an existing SPF record, add this TXT record to authorize Resend to dispatch mail:
* **Type**: `TXT`
* **Host**: `@`
* **Value**: `v=spf1 include:feedback.resend.com ~all`

*If you already have an SPF record (e.g., for Google Workspace), merge the include statement:*
`v=spf1 include:_spf.google.com include:feedback.resend.com ~all`

### C. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
Protect your domain against spoofing by adding this TXT record:
* **Type**: `TXT`
* **Host**: `_dmarc`
* **Value**: `v=DMARC1; p=none; rua=mailto:dmarc-reports@scalexweb.tech`

---

## 3. Database Table Definitions & Seed Data

Ensure the migrations are applied to your database. You can run the queries in `supabase/migrations/20260710000000_newsletter.sql` directly.

### Mock Seed Data
Execute this query in the Supabase SQL Editor to seed the table with dummy subscribers and campaigns for testing:

```sql
-- Insert mock subscribers
INSERT INTO public.newsletter_subscribers (email, name, status, token, topics, frequency)
VALUES 
  ('alex.dev@gmail.com', 'Alex Miller', 'confirmed', 'seed-token-1', ARRAY['development', 'saas'], 'weekly'),
  ('sarah.growth@yahoo.com', 'Sarah Jenkins', 'confirmed', 'seed-token-2', ARRAY['ecommerce'], 'monthly'),
  ('pending.user@outlook.com', 'John Doe', 'pending', 'seed-token-3', ARRAY['news'], 'weekly');

-- Insert a mock sent campaign
INSERT INTO public.newsletter_campaigns (id, subject, content, segment_topics, status, sent_count, open_count, click_count, sent_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Boost Conversion Rates by 20%', '<h2>Hello Seeker,</h2><p>Here are 3 tips to boost conversions...</p>', ARRAY['ecommerce'], 'sent', 2, 2, 1, NOW() - INTERVAL '1 day');

-- Insert mock send logs for tracking testing
INSERT INTO public.newsletter_send_logs (campaign_id, subscriber_id, sent_at, opened_at, clicked_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.newsletter_subscribers WHERE email = 'alex.dev@gmail.com'), NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours', NOW() - INTERVAL '22 hours'),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.newsletter_subscribers WHERE email = 'sarah.growth@yahoo.com'), NOW() - INTERVAL '1 day', NOW() - INTERVAL '20 hours', NULL);
```
