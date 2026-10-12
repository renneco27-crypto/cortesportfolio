-- ==============================================================================
-- Supabase Database Schema for Lawrence Cortes Portfolio
-- Target Instance: https://nstyqceyjkgevnibfqks.supabase.co
-- ==============================================================================

-- 1. CREDENTIALS & CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.credentials (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    issuing_body TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('earned', 'in-progress', 'planned', 'pending')),
    badge_icon TEXT NOT NULL DEFAULT 'award' CHECK (badge_icon IN ('award', 'check', 'shield', 'graduation')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    verify_url TEXT,
    target_date TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Allow public read access (portfolio visitors)
DROP POLICY IF EXISTS "Allow public read access on credentials" ON public.credentials;
CREATE POLICY "Allow public read access on credentials"
    ON public.credentials
    FOR SELECT
    USING (true);

-- Allow service_role full management
DROP POLICY IF EXISTS "Allow service_role full access on credentials" ON public.credentials;
CREATE POLICY "Allow service_role full access on credentials"
    ON public.credentials
    FOR ALL
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 2. PORTFOLIO SETTINGS TABLE (Dynamic resume URL, announcements, etc.)
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on portfolio_settings" ON public.portfolio_settings;
CREATE POLICY "Allow public read access on portfolio_settings"
    ON public.portfolio_settings
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow service_role full access on portfolio_settings" ON public.portfolio_settings;
CREATE POLICY "Allow service_role full access on portfolio_settings"
    ON public.portfolio_settings
    FOR ALL
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 3. SEED INITIAL CREDENTIALS DATA
INSERT INTO public.credentials (id, label, issuing_body, status, badge_icon, sort_order, notes, verify_url, target_date)
VALUES
  (
    'csc-professional',
    'Civil Service Exam — Professional Level',
    'Civil Service Commission (CSC), Philippines',
    'in-progress',
    'award',
    1,
    'Civil service eligibility for government technical roles.',
    'https://www.csc.gov.ph',
    '2025-08-01'
  ),
  (
    'tesda-css-nc2',
    'Computer Systems Servicing NC II',
    'TESDA',
    'in-progress',
    'check',
    2,
    'Hands-on hardware assembly, operating systems, networking, and troubleshooting.',
    'https://www.tesda.gov.ph',
    NULL
  ),
  (
    'cisco-cybersecurity',
    'Intro to Cybersecurity & Networking Basics',
    'Cisco Networking Academy',
    'in-progress',
    'shield',
    3,
    'Enterprise network security, routing basics, and defense fundamentals.',
    'https://www.netacad.com',
    NULL
  ),
  (
    'pwncollege-badge',
    'pwn.college — Program Security Path',
    'pwn.college',
    'in-progress',
    'shield',
    4,
    'Low-level binary exploitation, memory corruption, reverse engineering, and shellcode execution.',
    'https://pwn.college',
    NULL
  ),
  (
    'nextwork-cloud',
    'NextWork — Cloud-Native AI Engineering',
    'NextWork',
    'in-progress',
    'graduation',
    5,
    'Production cloud architecture, generative AI pipeline integration, and serverless infrastructure.',
    'https://nextwork.org',
    NULL
  ),
  (
    'aws-cloud-practitioner',
    'AWS Certified Cloud Practitioner',
    'Amazon Web Services',
    'planned',
    'award',
    6,
    'Core AWS services, security, IAM architecture, pricing, and cloud economics.',
    'https://aws.amazon.com/certification',
    '2025-12-01'
  )
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  issuing_body = EXCLUDED.issuing_body,
  status = EXCLUDED.status,
  badge_icon = EXCLUDED.badge_icon,
  sort_order = EXCLUDED.sort_order,
  notes = EXCLUDED.notes,
  verify_url = EXCLUDED.verify_url,
  target_date = EXCLUDED.target_date;

-- 4. SEED INITIAL SETTINGS
INSERT INTO public.portfolio_settings (key, value)
VALUES ('resume_url', '/resume/lawrence-cortes-resume.pdf')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = timezone('utc'::text, now());
