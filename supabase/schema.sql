-- Re:Drive Database Schema for Supabase

-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor')),
  phone TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INSTRUCTOR PROFILES ==========
CREATE TABLE IF NOT EXISTS instructor_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  experience INTEGER DEFAULT 0,
  introduction TEXT DEFAULT '',
  car_type TEXT DEFAULT '',
  transmission_types TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  gender TEXT DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  age_group TEXT DEFAULT '30代',
  teaching_style TEXT[] DEFAULT '{}',
  has_instructor_license BOOLEAN DEFAULT FALSE,
  service_areas TEXT DEFAULT '',
  designated_areas TEXT[] DEFAULT '{}',
  travel_areas TEXT[] DEFAULT '{}',
  travel_fee INTEGER DEFAULT 0,
  vehicle_fee INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0
);

-- ========== STUDENT PROFILES ==========
CREATE TABLE IF NOT EXISTS student_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT,
  license_type TEXT,
  transmission_type TEXT
);

-- ========== COURSE PRICING ==========
CREATE TABLE IF NOT EXISTS course_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hours INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  price INTEGER NOT NULL,
  description TEXT
);

-- ========== TIME SLOTS ==========
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('morning', 'afternoon', 'evening')),
  is_available BOOLEAN DEFAULT TRUE,
  capacity INTEGER DEFAULT 2,
  UNIQUE(instructor_id, date, period)
);

-- ========== BOOKINGS ==========
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  location TEXT NOT NULL,
  course_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  use_instructor_vehicle BOOLEAN DEFAULT FALSE,
  total_price INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== REVIEWS ==========
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  course_name TEXT,
  reply TEXT,
  reply_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== CONVERSATIONS ==========
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  unread_count_student INTEGER DEFAULT 0,
  unread_count_instructor INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, instructor_id)
);

-- ========== MESSAGES ==========
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_instructor ON bookings(instructor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_instructor ON reviews(instructor_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_instructor_date ON time_slots(instructor_id, date);

-- ========== ROW LEVEL SECURITY ==========
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- Allow all operations via service_role key (server-side only)
CREATE POLICY "Service role full access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON instructor_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON student_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON course_pricing FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON time_slots FOR ALL USING (true) WITH CHECK (true);
