-- 1. Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    token TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    topics TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    frequency TEXT DEFAULT 'weekly' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_reason TEXT
);

-- 2. Create newsletter_campaigns table
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    segment_tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    segment_topics TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sent_count INTEGER DEFAULT 0 NOT NULL,
    open_count INTEGER DEFAULT 0 NOT NULL,
    click_count INTEGER DEFAULT 0 NOT NULL,
    unsubscribe_count INTEGER DEFAULT 0 NOT NULL
);

-- 3. Create newsletter_send_logs table
CREATE TABLE IF NOT EXISTS public.newsletter_send_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID NOT NULL REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced BOOLEAN DEFAULT false NOT NULL,
    bounce_reason TEXT
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_send_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Allow anyone to signup
DROP POLICY IF EXISTS "Allow public insert subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow public insert subscribers" ON public.newsletter_subscribers 
    FOR INSERT WITH CHECK (true);

-- Allow admins full control over subscribers
DROP POLICY IF EXISTS "Allow admin manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow admin manage subscribers" ON public.newsletter_subscribers 
    FOR ALL USING (public.is_admin());

-- Allow admins full control over campaigns
DROP POLICY IF EXISTS "Allow admin manage campaigns" ON public.newsletter_campaigns;
CREATE POLICY "Allow admin manage campaigns" ON public.newsletter_campaigns 
    FOR ALL USING (public.is_admin());

-- Allow admins full control over send logs
DROP POLICY IF EXISTS "Allow admin manage send logs" ON public.newsletter_send_logs;
CREATE POLICY "Allow admin manage send logs" ON public.newsletter_send_logs 
    FOR ALL USING (public.is_admin());
