-- Re:Drive Seed Data
-- Run this after schema.sql to populate initial data

-- ========== INSTRUCTORS (password: password123) ==========
-- Password hash for 'password123' using SHA-256 with salt

INSERT INTO users (id, email, password_hash, name, role, phone, avatar) VALUES
  ('11111111-1111-1111-1111-111111111111', 'tanaka@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '田中 健太', 'instructor', '090-1234-5678', '/instructors/tanaka.jpg'),
  ('22222222-2222-2222-2222-222222222222', 'yamamoto@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '山本 裕子', 'instructor', '090-2345-6789', '/instructors/yamamoto.jpg'),
  ('33333333-3333-3333-3333-333333333333', 'sato@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '佐藤 大輔', 'instructor', '090-3456-7890', '/instructors/sato.jpg'),
  ('44444444-4444-4444-4444-444444444444', 'suzuki@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '鈴木 あゆみ', 'instructor', '090-4567-8901', '/instructors/suzuki.jpg'),
  ('55555555-5555-5555-5555-555555555555', 'takahashi@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '高橋 誠', 'instructor', '090-5678-9012', '/instructors/takahashi.jpg')
ON CONFLICT (id) DO NOTHING;

-- ========== STUDENTS ==========
INSERT INTO users (id, email, password_hash, name, role, phone) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'student1@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '山田 太郎', 'student', '080-1111-2222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'student2@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '佐藤 花子', 'student', '080-3333-4444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'student3@example.com', 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8:7580c39ce80b41fb6dad4aa1d4db1b0944ef336186852bef7af877b3b2c7ceae', '鈴木 一郎', 'student', '080-5555-6666')
ON CONFLICT (id) DO NOTHING;

-- ========== INSTRUCTOR PROFILES ==========
INSERT INTO instructor_profiles (user_id, experience, introduction, car_type, transmission_types, specialties, badges, gender, age_group, teaching_style, has_instructor_license, service_areas, designated_areas, travel_areas, travel_fee, vehicle_fee, is_approved, rating, review_count) VALUES
  ('11111111-1111-1111-1111-111111111111', 15, '15年の指導経験で、初心者から久しぶりの方まで丁寧にサポートします。緊張せずリラックスして練習できる環境を大切にしています。', 'トヨタ アクア', ARRAY['AT', 'MT'], ARRAY['高速道路', '駐車', '夜間運転'], ARRAY['人気講師', '高評価'], 'male', '40代', ARRAY['丁寧', '優しい'], true, '東京都', ARRAY['東京都 品川区', '東京都 目黒区', '東京都 渋谷区'], ARRAY['東京都 世田谷区', '東京都 港区'], 1000, 2000, true, 4.9, 128),
  ('22222222-2222-2222-2222-222222222222', 8, '女性ドライバーの気持ちがわかる女性講師です。買い物やお子さんの送迎など、日常で使えるテクニックを中心にレッスンします。', 'ホンダ フィット', ARRAY['AT'], ARRAY['駐車', '市街地走行'], ARRAY['女性講師', '高評価'], 'female', '30代', ARRAY['フレンドリー', '実践的'], true, '東京都', ARRAY['東京都 世田谷区', '東京都 杉並区'], ARRAY['東京都 渋谷区', '東京都 新宿区'], 1000, 1500, true, 4.8, 95),
  ('33333333-3333-3333-3333-333333333333', 10, '元教習所指導員の経験を活かし、基礎からしっかり教えます。苦手な部分を克服するカリキュラムを組みます。', 'マツダ デミオ', ARRAY['AT', 'MT'], ARRAY['高速道路', '山道', '縦列駐車'], ARRAY['元教習所'], 'male', '30代', ARRAY['論理的', '基礎重視'], true, '東京都', ARRAY['東京都 練馬区', '東京都 板橋区', '東京都 豊島区'], ARRAY['東京都 北区', '東京都 中野区'], 800, 1800, true, 4.7, 76),
  ('44444444-4444-4444-4444-444444444444', 5, '楽しく安全に！をモットーに、リラックスした雰囲気でレッスンを行います。ペーパードライバー歴が長い方も大歓迎です。', 'ダイハツ タント', ARRAY['AT'], ARRAY['駐車', '住宅街走行'], ARRAY['女性講師'], 'female', '20代', ARRAY['明るい', 'リラックス'], false, '神奈川県', ARRAY['横浜市 青葉区', '横浜市 都筑区'], ARRAY['川崎市 宮前区'], 1200, 2000, true, 4.6, 42),
  ('55555555-5555-5555-5555-555555555555', 20, '20年以上の指導実績。高速道路や長距離ドライブなど、上級テクニックも教えられます。', 'トヨタ カローラ', ARRAY['AT', 'MT'], ARRAY['高速道路', '長距離', '夜間運転', '山道'], ARRAY['ベテラン', '人気講師'], 'male', '50代', ARRAY['厳しめ', '実践的'], true, '東京都', ARRAY['東京都 新宿区', '東京都 中野区', '東京都 杉並区'], ARRAY['東京都 渋谷区', '東京都 世田谷区'], 1500, 2500, true, 4.8, 210)
ON CONFLICT (user_id) DO NOTHING;

-- ========== COURSE PRICING ==========
INSERT INTO course_pricing (instructor_id, name, hours, sessions, price, description) VALUES
  ('11111111-1111-1111-1111-111111111111', '2時限×3回コース', 2, 3, 39600, '初めての方におすすめ'),
  ('11111111-1111-1111-1111-111111111111', '2時限×5回コース', 2, 5, 62000, '一番人気のコース'),
  ('11111111-1111-1111-1111-111111111111', '2時限×7回コース', 2, 7, 86800, 'じっくり練習したい方に'),
  ('22222222-2222-2222-2222-222222222222', '2時限×3回コース', 2, 3, 36000, 'まずはお試し'),
  ('22222222-2222-2222-2222-222222222222', '2時限×5回コース', 2, 5, 58000, '人気No.1コース'),
  ('33333333-3333-3333-3333-333333333333', '2時限×3回コース', 2, 3, 37800, '基礎固めコース'),
  ('33333333-3333-3333-3333-333333333333', '2時限×5回コース', 2, 5, 60000, '標準コース'),
  ('33333333-3333-3333-3333-333333333333', '2時限×7回コース', 2, 7, 82000, 'しっかりコース'),
  ('44444444-4444-4444-4444-444444444444', '2時限×3回コース', 2, 3, 34000, 'ライトコース'),
  ('44444444-4444-4444-4444-444444444444', '2時限×5回コース', 2, 5, 55000, 'スタンダード'),
  ('55555555-5555-5555-5555-555555555555', '2時限×3回コース', 2, 3, 42000, '短期集中'),
  ('55555555-5555-5555-5555-555555555555', '2時限×5回コース', 2, 5, 68000, '上級者向け'),
  ('55555555-5555-5555-5555-555555555555', '2時限×10回コース', 2, 10, 125000, 'マスターコース');

-- ========== SAMPLE REVIEWS ==========
INSERT INTO reviews (student_id, instructor_id, rating, comment, course_name, created_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 5, '夜間運転が苦手でしたが、田中先生の丁寧な指導のおかげで自信を取り戻せました。優しく教えてくれるので緊張せずに練習できました。', '7回コース', '2024-10-20'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 5, '10年ぶりの運転でしたが、基礎から丁寧に教えていただき、今では安心して運転できます。高速道路の練習もできて良かったです。', '5回コース', '2024-11-15'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 4, '女性の先生なので安心して受講できました。駐車のコツを分かりやすく教えていただきました。', '3回コース', '2024-09-10'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 5, '元教習所の先生だけあって、教え方がとても分かりやすかったです。苦手だった縦列駐車も克服できました。', '5回コース', '2024-11-01'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 5, '高速道路の合流が怖かったのですが、高橋先生に何度も練習させてもらい、今は一人でも大丈夫です。', '5回コース', '2024-10-05');

-- ========== SAMPLE BOOKINGS ==========
INSERT INTO bookings (student_id, instructor_id, date, time_slot, location, course_name, status, total_price) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '2026-02-15', 'morning', '東京都 品川区', '2時限×7回コース', 'confirmed', 86800),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '2026-02-16', 'afternoon', '東京都 世田谷区', '2時限×5回コース', 'pending', 58000),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '2026-02-17', 'morning', '東京都 練馬区', '2時限×5回コース', 'confirmed', 60000);
