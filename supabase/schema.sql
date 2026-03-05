-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pages table
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    parent_id UUID REFERENCES menu_items(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT,
    phone TEXT,
    type TEXT, -- e.g., '15-min', '40-min'
    appointment_date DATE,
    appointment_time TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability table
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL, -- 0 (Sun) to 6 (Sat)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_type TEXT DEFAULT 'all', -- '15-min', '40-min', or 'all'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public Insert Leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Availability" ON availability FOR SELECT USING (is_active = true);

-- Admin policies (requires auth.uid() check)
CREATE POLICY "Admin All Pages" ON pages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Menu" ON menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Leads" ON leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Availability" ON availability FOR ALL TO authenticated USING (true);
