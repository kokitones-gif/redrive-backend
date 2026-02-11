export interface CoursePrice {
  name: string
  duration: string
  sessions: number
  price: number
  priceRange?: { min: number; max: number }
}

export interface Testimonial {
  studentName: string
  age: number
  course: string
  rating: number
  comment: string
  date: string
  reply?: string
  replyDate?: string
}

export interface Instructor {
  id: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  experience: number
  area: string
  coursePrices: CoursePrice[]
  specialties: string[]
  introduction: string
  carType: string
  transmissionTypes: ("AT" | "MT")[] // AT/MT対応
  availableDates: string[]
  badges: string[]
  gender: "male" | "female"
  ageGroup: "20代" | "30代" | "40代" | "50代" | "60代"
  teachingStyle: string[]
  hasInstructorLicense: boolean
  serviceAreas: string
  designatedAreas: string[]
  travelAreas: string[]
  availableDays: string
  travelFee: number
  vehicleFee: number
  timeSlotCapacity: TimeSlotCapacity
  scheduledLessons?: ScheduledLesson[]
  testimonials?: Testimonial[] // 受講者の声を追加
}

const defaultCoursePrices: CoursePrice[] = [
  {
    name: "1回コース",
    duration: "100分",
    sessions: 1,
    price: 9000,
  },
  {
    name: "2時限×4回コース",
    duration: "100分",
    sessions: 4,
    price: 52800,
  },
  {
    name: "2時限×7回コース",
    duration: "100分",
    sessions: 7,
    price: 86800,
  },
  {
    name: "2時限×10回コース",
    duration: "100分",
    sessions: 10,
    price: 120000,
  },
  {
    name: "2時限×20回コース",
    duration: "100分",
    sessions: 20,
    price: 220000,
  },
]

function generateAvailableDates(daysFromNow: number[]): string[] {
  const today = new Date()
  return daysFromNow.map((days) => {
    const date = new Date(today)
    date.setDate(today.getDate() + days)
    return date.toISOString().split("T")[0]
  })
}

export interface TimeSlotCapacity {
  morning: number // 午前の受付枠数
  afternoon: number // 昼の受付枠数
  evening: number // 午後の受付枠数
}

export const instructors: Instructor[] = [
  {
    id: "1",
    name: "田中 健太",
    avatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    rating: 4.9,
    reviewCount: 128,
    experience: 15,
    area: "東京都 渋谷区",
    coursePrices: defaultCoursePrices, // 全講師で統一価格を使用
    specialties: ["高速道路", "駐車", "夜間運転"],
    introduction:
      "15年の指導経験で、初心者から久しぶりの方まで丁寧にサポートします。緊張せずリラックスして練習できる環境を大切にしています。",
    carType: "トヨタ アクア",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([1, 2, 3, 5, 7, 8, 10, 12, 14]),
    badges: ["人気講師", "高評価"],
    gender: "male",
    ageGroup: "40代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: true,
    serviceAreas: "東京都（品川区、目黒区、渋谷区）",
    designatedAreas: ["東京都 品川区", "東京都 目黒区", "東京都 渋谷区"],
    travelAreas: ["東京都 世田谷区", "東京都 港区"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
  testimonials: [
  {
  studentName: "山本 花子",
  age: 28,
  course: "4回コース",
  rating: 5,
  comment:
  "10年ぶりの運転でしたが、田中先生の丁寧な指導のおかげで自信を取り戻せました。高速道路の練習も安心して受けられました。",
  date: "2024-11-15",
  reply: "嬉しいお言葉ありがとうございます！10年のブランクを乗り越えて、高速道路も走れるようになったこと、私もとても嬉しいです。これからも安全運転を心がけてくださいね！",
  replyDate: "2024-11-16",
  },
  {
        studentName: "佐藤 太郎",
        age: 35,
        course: "7回コース",
        rating: 5,
        comment:
          "夜間運転が苦手でしたが、基礎から丁寧に教えていただき、今では安心して運転できます。優しく教えてくれるので緊張せずに練習できました。",
        date: "2024-10-20",
      },
      {
        studentName: "鈴木 美咲",
        age: 32,
        course: "10回コース",
        rating: 4,
        comment:
          "駐車が苦手で何度も練習しましたが、根気よく付き合ってくださいました。おかげで自宅の駐車場にもスムーズに入れられるようになりました。",
        date: "2024-09-10",
      },
    ],
  },
  {
    id: "2",
    name: "山田 美咲",
    avatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
    rating: 4.8,
    reviewCount: 96,
    experience: 8,
    area: "東京都 新宿区",
    coursePrices: defaultCoursePrices,
    specialties: ["初心者向け", "女性専用対応", "買い物ルート"],
    introduction:
      "女性ならではの視点で、安心して練習できるレッスンを心がけています。お子様の送り迎えルートの練習も人気です。",
    carType: "ホンダ フィット",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 4, 5, 7, 9, 11, 13, 15]),
    badges: ["女性講師"],
    gender: "female",
    ageGroup: "30代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（品川区、目黒区、渋谷区）",
    designatedAreas: ["東京都 品川区", "東京都 目黒区", "東京都 渋谷区"],
    travelAreas: ["東京都 世田谷区", "東京都 港区"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "田中 恵子",
        age: 30,
        course: "4回コース",
        rating: 5,
        comment:
          "女性講師なので安心して受講できました。子供の保育園への送迎ルートを一緒に練習していただき、とても助かりました。",
        date: "2024-11-20",
        reply: "レビューありがとうございます！お子様の送迎、毎日のことなので安心して運転できるようになって良かったです。また何かありましたらいつでもご相談ください。",
        replyDate: "2024-11-21",
      },
      {
        studentName: "中村 由美",
        age: 26,
        course: "7回コース",
        rating: 5,
        comment:
          "初心者でも分かりやすく教えてくださり、運転が楽しくなりました。買い物ルートの練習もリアルで役立ちました。",
        date: "2024-10-05",
      },
    ],
  },
  {
    id: "3",
    name: "佐藤 大輔",
    avatar: "/professional-japanese-male-driving-instructor-in-h.jpg",
    rating: 4.7,
    reviewCount: 205,
    experience: 20,
    area: "東京都 世田谷区",
    coursePrices: defaultCoursePrices,
    specialties: ["高速道路", "長距離", "山道"],
    introduction:
      "教習所で20年の経験があります。苦手な運転も基礎から丁寧に指導。自信を持って運転できるようになるまでサポートします。",
    carType: "マツダ デミオ",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([2, 3, 8, 9, 10, 14, 16, 18]),
    badges: ["ベテラン"],
    gender: "male",
    ageGroup: "50代",
    teachingStyle: ["厳しめ"],
    hasInstructorLicense: true,
    serviceAreas: "東京都（品川区、目黒区、渋谷区）",
    designatedAreas: ["東京都 品川区", "東京都 目黒区", "東京都 渋谷区"],
    travelAreas: ["東京都 世田谷区", "東京都 港区"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 3, afternoon: 3, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "高橋 健",
        age: 45,
        course: "10回コース",
        rating: 5,
        comment:
          "ベテランならではの的確な指導で、長距離運転も安心してできるようになりました。厳しいですが的確なアドバイスで確実に上達しました。",
        date: "2024-11-10",
      },
      {
        studentName: "伊藤 誠一",
        age: 38,
        course: "7回コース",
        rating: 4,
        comment:
          "高速道路の合流が苦手でしたが、基礎から教えていただき克服できました。少し厳しいですが、その分確実に技術が身につきます。",
        date: "2024-09-25",
      },
    ],
  },
  {
    id: "4",
    name: "鈴木 あゆみ",
    avatar: "/cheerful-japanese-female-driving-instructor-in-her.jpg",
    rating: 4.9,
    reviewCount: 87,
    experience: 10,
    area: "神奈川県 横浜市",
    coursePrices: defaultCoursePrices,
    specialties: ["縦列駐車", "車庫入れ", "狭い道"],
    introduction:
      "駐車が苦手な方、お任せください！何度でも丁寧に練習にお付き合いします。できた時の喜びを一緒に分かち合いましょう。",
    carType: "日産 ノート",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 2, 5, 6, 8, 11, 13, 15]),
    badges: ["駐車のプロ"],
    gender: "female",
    ageGroup: "30代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（品川区、目黒区、渋谷区）",
    designatedAreas: ["東京都 品川区", "東京都 目黒区", "東京都 渋谷区"],
    travelAreas: ["東京都 世田谷区", "東京都 港区"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "渡辺 麻美",
        age: 33,
        course: "4回コース",
        rating: 5,
        comment:
          "縦列駐車が全くできなかったのですが、鈴木先生のおかげでコツを掴めました。明るく励ましてくれるので楽しく練習できました。",
        date: "2024-11-18",
      },
      {
        studentName: "小林 直子",
        age: 29,
        course: "7回コース",
        rating: 5,
        comment:
          "狭い道での対向車とのすれ違いが苦手でしたが、何度も練習して自信がつきました。駐車も完璧にできるようになりました！",
        date: "2024-10-12",
      },
    ],
  },
  {
    id: "5",
    name: "伊藤 誠",
    avatar: "/calm-japanese-male-driving-instructor-in-his-35s.jpg",
    rating: 4.6,
    reviewCount: 64,
    experience: 6,
    area: "埼玉県 さいたま市",
    coursePrices: defaultCoursePrices,
    specialties: ["基礎練習", "交差点", "車線変更"],
    introduction: "焦らず、ゆっくり、確実に。基本に忠実な指導で、安全運転の習慣を身につけていただきます。",
    carType: "スズキ スイフト",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([3, 4, 7, 10, 12, 14, 17, 20]),
    badges: ["リーズナブル"],
    gender: "male",
    ageGroup: "30代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（品川区、目黒区、渋谷区）",
    designatedAreas: ["東京都 品川区", "東京都 目黒区", "東京都 渋谷区"],
    travelAreas: ["東京都 世田谷区", "神奈川県 川崎市"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "加藤 健太郎",
        age: 22,
        course: "10回コース",
        rating: 5,
        comment:
          "免許取得後、一度も運転していなかったのですが、基礎から丁寧に教えていただきました。焦らず練習できて良かったです。",
        date: "2024-11-05",
      },
      {
        studentName: "木村 真由美",
        age: 27,
        course: "4回コース",
        rating: 4,
        comment: "車線変更が苦手でしたが、何度も練習して克服できました。落ち着いた指導で安心して練習できました。",
        date: "2024-10-08",
      },
    ],
  },
  {
    id: "6",
    name: "高橋 優子",
    avatar: "/warm-japanese-female-driving-instructor-in-her-45s.jpg",
    rating: 4.8,
    reviewCount: 112,
    experience: 12,
    area: "千葉県 舟橋市",
    coursePrices: defaultCoursePrices,
    specialties: ["ペーパー歴10年以上", "メンタルケア", "基礎からやり直し"],
    introduction:
      "長いブランクがあっても大丈夫。ゼロからのスタートを温かくサポートします。まずは座席の調整から始めましょう。",
    carType: "ダイハツ ムーヴ",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 6, 9, 11, 15, 18, 21]),
    badges: ["安心サポート"],
    gender: "female",
    ageGroup: "40代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（品川区、目黒区、渋谷区）",
    designatedAreas: ["東京都 品川区", "東京都 目黒区", "東京都 渋谷区"],
    travelAreas: ["東京都 世田谷区", "東京都 港区"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "斉藤 由紀",
        age: 55,
        course: "7回コース",
        rating: 5,
        comment:
          "20年ぶりの運転で不安でしたが、高橋先生が優しく声をかけてくださり、リラックスして練習できました。座席の調整から丁寧に教えてくれて安心しました。",
        date: "2024-11-25",
      },
      {
        studentName: "岡田 昌子",
        age: 48,
        course: "4回コース",
        rating: 5,
        comment:
          "ペーパードライバー講習で利用しました。基礎からしっかり教えていただき、短期間で運転できるようになりました。メンタルケアもありがたかったです。",
        date: "2024-10-18",
      },
    ],
  },
  {
    id: "7",
    name: "渡辺 健",
    avatar: "/instructor7.jpg",
    rating: 4.7,
    reviewCount: 75,
    experience: 9,
    area: "東京都 港区",
    coursePrices: defaultCoursePrices,
    specialties: ["都心部運転", "時間帯別運転", "雨天運転"],
    introduction: "都心部の複雑な道路も安心して走れるよう、実践的な指導を行います。",
    carType: "トヨタ プリウス",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([2, 4, 6, 8, 10, 12, 14, 16]),
    badges: ["都心のプロ"],
    gender: "male",
    ageGroup: "40代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: true,
    serviceAreas: "東京都（港区、千代田区、中央区）",
    designatedAreas: ["東京都 港区", "東京都 千代田区", "東京都 中央区"],
    travelAreas: ["東京都 渋谷区", "東京都 目黒区"],
    availableDays: "月、水、金、日",
    travelFee: 800,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 3, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "福田 健太",
        age: 31,
        course: "7回コース",
        rating: 4,
        comment:
          "都心部の運転は初めてで不安でしたが、渡辺先生がルートを細かく指示してくれたので、落ち着いて運転できました。時間帯別の練習も役立ちました。",
        date: "2024-11-12",
      },
      {
        studentName: "青山 奈々",
        age: 38,
        course: "4回コース",
        rating: 5,
        comment:
          "雨の日の運転が苦手でしたが、雨天運転のコツを教えていただき、恐怖心がなくなりました。的確なアドバイスに感謝しています。",
        date: "2024-10-01",
      },
    ],
  },
  {
    id: "8",
    name: "中村 さやか",
    avatar: "/instructor8.jpg",
    rating: 4.9,
    reviewCount: 143,
    experience: 14,
    area: "東京都 練馬区",
    coursePrices: defaultCoursePrices,
    specialties: ["子育て世代", "通学路", "スーパー駐車場"],
    introduction: "子育て中のママの味方！日常生活に必要な運転スキルを丁寧に教えます。",
    carType: "ホンダ N-BOX",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 3, 5, 7, 9, 11, 13, 15]),
    badges: ["ママ講師", "人気講師"],
    gender: "female",
    ageGroup: "30代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（練馬区、板橋区、豊島区）",
    designatedAreas: ["東京都 練馬区", "東京都 板橋区", "東京都 豊島区"],
    travelAreas: ["東京都 杉並区", "東京都 中野区"],
    availableDays: "月、水、金、土",
    travelFee: 900,
    vehicleFee: 400,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 1 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "田中 恵子",
        age: 30,
        course: "4回コース",
        rating: 5,
        comment:
          "子供の送り迎えで使うスーパーの駐車場が苦手でしたが、中村先生が何度も練習に付き合ってくださり、スムーズに停められるようになりました。子育て経験者なので話も合いやすかったです。",
        date: "2024-11-20",
      },
      {
        studentName: "小林 直子",
        age: 29,
        course: "7回コース",
        rating: 5,
        comment:
          "子供の通学路を安全に運転できるようになりたいと思い受講しました。細い道でのカーブや一時停止の練習を重点的に行い、安心して運転できるようになりました。",
        date: "2024-10-12",
      },
    ],
  },
  {
    id: "9",
    name: "小林 拓也",
    avatar: "/instructor9.jpg",
    rating: 4.6,
    reviewCount: 58,
    experience: 7,
    area: "神奈川県 川崎市",
    coursePrices: defaultCoursePrices,
    specialties: ["首都高速", "長距離運転", "運転姿勢"],
    introduction: "正しい運転姿勢から指導します。疲れにくく安全な運転を身につけましょう。",
    carType: "日産 セレナ",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([2, 4, 6, 8, 10, 12, 14, 18]),
    badges: ["姿勢矯正"],
    gender: "male",
    ageGroup: "30代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: true,
    serviceAreas: "神奈川県（川崎市、横浜市）",
    designatedAreas: ["神奈川県 川崎市", "神奈川県 横浜市"],
    travelAreas: ["東京都 大田区", "東京都 品川区"],
    availableDays: "火、木、土、日",
    travelFee: 1200,
    vehicleFee: 600,
    timeSlotCapacity: { morning: 3, afternoon: 3, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "佐藤 健太",
        age: 35,
        course: "7回コース",
        rating: 5,
        comment:
          "長距離運転が苦手でしたが、小林先生の指導で運転姿勢を改善したところ、疲れにくくなり、長距離も楽に運転できるようになりました。首都高の合流も怖くなくなりました。",
        date: "2024-11-01",
      },
      {
        studentName: "田中 花子",
        age: 28,
        course: "4回コース",
        rating: 4,
        comment:
          "運転姿勢について具体的に指導してもらえて良かったです。長距離運転はまだ少し不安ですが、基本をしっかり教えてもらえたので安心感があります。",
        date: "2024-09-20",
      },
    ],
  },
  {
    id: "10",
    name: "加藤 真理子",
    avatar: "/instructor10.jpg",
    rating: 4.8,
    reviewCount: 91,
    experience: 11,
    area: "東京都 江東区",
    coursePrices: defaultCoursePrices,
    specialties: ["湾岸エリア", "トンネル運転", "橋梁運転"],
    introduction: "湾岸エリア特有の運転環境に対応した実践的な指導を行います。",
    carType: "トヨタ ヤリス",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 3, 5, 7, 9, 13, 15, 17]),
    badges: ["湾岸エリア"],
    gender: "female",
    ageGroup: "40代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（江東区、墨田区、江戸川区）",
    designatedAreas: ["東京都 江東区", "東京都 墨田区", "東京都 江戸川区"],
    travelAreas: ["東京都 中央区", "東京都 台東区"],
    availableDays: "月、水、金、日",
    travelFee: 800,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "佐藤 美咲",
        age: 32,
        course: "7回コース",
        rating: 5,
        comment:
          "湾岸エリアの橋やトンネルでの運転が不安でしたが、加藤先生の丁寧な指導で克服できました。実際の走行を想定した練習がとても役立ちました。",
        date: "2024-11-22",
      },
      {
        studentName: "田中 健太",
        age: 25,
        course: "4回コース",
        rating: 4,
        comment:
          "湾岸エリアでの運転に特化した講習を受けました。橋の上での風の影響やトンネル内での注意点など、実践的なアドバイスが参考になりました。",
        date: "2024-10-15",
      },
    ],
  },
  {
    id: "11",
    name: "松本 隆",
    avatar: "/instructor11.jpg",
    rating: 4.7,
    reviewCount: 102,
    experience: 16,
    area: "埼玉県 川口市",
    coursePrices: defaultCoursePrices,
    specialties: ["高齢者向け", "リハビリ運転", "認知機能ケア"],
    introduction: "シニア世代の運転再開を全力でサポート。安全運転のプロフェッショナルです。",
    carType: "スバル インプレッサ",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([2, 4, 6, 9, 11, 13, 16, 18]),
    badges: ["シニア対応"],
    gender: "male",
    ageGroup: "50代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: true,
    serviceAreas: "埼玉県（川口市、蕨市、戸田市）",
    designatedAreas: ["埼玉県 川口市", "埼玉県 蕨市", "埼玉県 戸田市"],
    travelAreas: ["東京都 北区", "東京都 足立区"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 1 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "小林 隆",
        age: 68,
        course: "7回コース",
        rating: 5,
        comment:
          "免許更新を機に運転を再開したく、松本先生にお願いしました。高齢者向けの丁寧な指導と、認知機能に配慮したアドバイスのおかげで、安心して運転できるようになりました。",
        date: "2024-11-08",
      },
      {
        studentName: "田中 恵子",
        age: 62,
        course: "4回コース",
        rating: 5,
        comment:
          "リハビリ運転で利用しました。ゆっくりとしたペースで、焦らず練習させていただけたので良かったです。安全運転の意識が高まりました。",
        date: "2024-10-28",
      },
    ],
  },
  {
    id: "12",
    name: "吉田 麻衣",
    avatar: "/instructor12.jpg",
    rating: 4.9,
    reviewCount: 156,
    experience: 13,
    area: "千葉県 市川市",
    coursePrices: defaultCoursePrices,
    specialties: ["通勤ルート", "駅前運転", "商業施設駐車"],
    introduction: "日常生活で必要な場所への運転を集中的に練習。実用的なスキルが身につきます。",
    carType: "トヨタ カローラ",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([1, 3, 5, 8, 10, 12, 15, 17]),
    badges: ["実用派"],
    gender: "female",
    ageGroup: "40代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "千葉県（市川市、船橋市、浦安市）",
    designatedAreas: ["千葉県 市川市", "千葉県 舟橋市", "千葉県 浦安市"],
    travelAreas: ["東京都 江戸川区", "東京都 葛飾区"],
    availableDays: "月、水、金、土",
    travelFee: 900,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 3, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "伊藤 健太",
        age: 29,
        course: "7回コース",
        rating: 5,
        comment:
          "毎日の通勤ルートの練習を重点的に行いました。駅前の混雑した道や、狭い駐車場での運転がスムーズにできるようになり、通勤が楽になりました。",
        date: "2024-11-15",
      },
      {
        studentName: "青山 奈々",
        age: 38,
        course: "4回コース",
        rating: 4,
        comment:
          "商業施設の駐車場での駐車練習をしました。何度か失敗しましたが、吉田先生が根気強く教えてくださり、今では自信を持って駐車できるようになりました。",
        date: "2024-10-05",
      },
    ],
  },
  {
    id: "13",
    name: "木村 浩二",
    avatar: "/instructor13.jpg",
    rating: 4.5,
    reviewCount: 47,
    experience: 5,
    area: "東京都 杉並区",
    coursePrices: defaultCoursePrices,
    specialties: ["若者向け", "SNS対応", "カーシェア運転"],
    introduction: "同世代だからこそ分かる不安を解消。気軽に質問できる雰囲気を大切にしています。",
    carType: "マツダ CX-3",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([2, 4, 6, 8, 11, 13, 15, 19]),
    badges: ["若手講師"],
    gender: "male",
    ageGroup: "20代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（杉並区、中野区、世田谷区）",
    designatedAreas: ["東京都 杉並区", "東京都 中野区", "東京都 世田谷区"],
    travelAreas: ["東京都 練馬区", "東京都 渋谷区"],
    availableDays: "火、木、土、日",
    travelFee: 700,
    vehicleFee: 400,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 3 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "佐藤 健太",
        age: 25,
        course: "4回コース",
        rating: 4,
        comment:
          "若手講師なので気軽に質問しやすかったです。カーシェアの利用方法や、SNSでの情報収集についてもアドバイスをもらいました。",
        date: "2024-11-02",
      },
      {
        studentName: "木村 真由美",
        age: 27,
        course: "1回コース",
        rating: 5,
        comment:
          "初めての運転で不安でしたが、木村先生が同世代なので話しやすく、リラックスして練習できました。SNSでの情報発信も参考になります。",
        date: "2024-09-28",
      },
    ],
  },
  {
    id: "14",
    name: "林 恵子",
    avatar: "/instructor14.jpg",
    rating: 4.8,
    reviewCount: 119,
    experience: 15,
    area: "東京都 大田区",
    coursePrices: defaultCoursePrices,
    specialties: ["空港アクセス", "羽田周辺", "環状線"],
    introduction: "羽田空港周辺の運転に強い！旅行や出張前の練習にも最適です。",
    carType: "ホンダ ヴェゼル",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 3, 5, 7, 10, 12, 14, 16]),
    badges: ["空港エリア"],
    gender: "female",
    ageGroup: "40代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: true,
    serviceAreas: "東京都（大田区、品川区、目黒区）",
    designatedAreas: ["東京都 大田区", "東京都 品川区", "東京都 目黒区"],
    travelAreas: ["東京都 世田谷区", "神奈川県 川崎市"],
    availableDays: "月、水、金、土",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 3, afternoon: 3, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "青山 奈々",
        age: 38,
        course: "7回コース",
        rating: 5,
        comment:
          "羽田空港周辺の道に詳しく、空港へのアクセスルートや、空港周辺の道路事情について実践的なアドバイスをいただきました。旅行前の練習に最適でした。",
        date: "2024-11-18",
      },
      {
        studentName: "福田 健太",
        age: 31,
        course: "4回コース",
        rating: 4,
        comment:
          "環状線の運転練習をしました。林先生のおかげで、スムーズに合流・流出ができるようになりました。空港周辺の道も少しずつ慣れてきました。",
        date: "2024-10-10",
      },
    ],
  },
  {
    id: "15",
    name: "斎藤 雄一",
    avatar: "/instructor15.jpg",
    rating: 4.6,
    reviewCount: 73,
    experience: 8,
    area: "神奈川県 藤沢市",
    coursePrices: defaultCoursePrices,
    specialties: ["海岸道路", "観光地運転", "混雑回避"],
    introduction: "湘南エリアの運転を楽しく！観光地特有の運転テクニックをお教えします。",
    carType: "スバル レヴォーグ",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([2, 4, 7, 9, 11, 14, 16, 18]),
    badges: ["湘南エリア"],
    gender: "male",
    ageGroup: "30代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "神奈川県（藤沢市、鎌倉市、茅ヶ崎市）",
    designatedAreas: ["神奈川県 藤沢市", "神奈川県 鎌倉市", "神奈川県 茅ヶ崎市"],
    travelAreas: ["神奈川県 横浜市", "神奈川県 平塚市"],
    availableDays: "火、木、土、日",
    travelFee: 1300,
    vehicleFee: 600,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "伊藤 健太",
        age: 29,
        course: "7回コース",
        rating: 5,
        comment:
          "湘南エリアの海岸道路や観光地での運転練習をしました。斎藤先生のおかげで、混雑時の回避方法や、狭い道でのすれ違いもスムーズにできるようになりました。",
        date: "2024-11-15",
      },
      {
        studentName: "岡田 昌子",
        age: 48,
        course: "4回コース",
        rating: 4,
        comment:
          "観光地での運転は初めてで不安でしたが、斎藤先生が周辺の状況をよく把握していて、的確なアドバイスをくれました。混雑回避のコツも学べて良かったです。",
        date: "2024-10-05",
      },
    ],
  },
  {
    id: "16",
    name: "森田 由美",
    avatar: "/instructor16.jpg",
    rating: 4.9,
    reviewCount: 134,
    experience: 12,
    area: "埼玉県 所沢市",
    coursePrices: defaultCoursePrices,
    specialties: ["郊外運転", "住宅街", "学校周辺"],
    introduction: "住宅街の運転マナーから丁寧に指導。近隣住民に配慮した運転を学べます。",
    carType: "日産 デイズ",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 3, 6, 8, 10, 13, 15, 17]),
    badges: ["マナー重視"],
    gender: "female",
    ageGroup: "40代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "埼玉県（所沢市、狭山市、入間市）",
    designatedAreas: ["埼玉県 所沢市", "埼玉県 狭山市", "埼玉県 入間市"],
    travelAreas: ["埼玉県 川越市", "東京都 東村山市"],
    availableDays: "月、水、金、日",
    travelFee: 900,
    vehicleFee: 400,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "斉藤 由紀",
        age: 55,
        course: "7回コース",
        rating: 5,
        comment:
          "住宅街での運転が苦手でしたが、森田先生が近隣住民への配慮や、見通しの悪い交差点での注意点を丁寧に教えてくださり、安心して運転できるようになりました。",
        date: "2024-11-25",
      },
      {
        studentName: "岡田 昌子",
        age: 48,
        course: "4回コース",
        rating: 5,
        comment:
          "学校周辺の通学路での運転練習をしました。子供たちの安全を最優先にした運転マナーを学ぶことができ、大変参考になりました。",
        date: "2024-10-18",
      },
    ],
  },
  {
    id: "17",
    name: "清水 康平",
    avatar: "/instructor17.jpg",
    rating: 4.7,
    reviewCount: 88,
    experience: 10,
    area: "千葉県 柏市",
    coursePrices: defaultCoursePrices,
    specialties: ["国道運転", "幹線道路", "交通量の多い道"],
    introduction: "交通量の多い道路でも落ち着いて運転できるよう、段階的に練習します。",
    carType: "トヨタ カローラツーリング",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([2, 5, 7, 9, 12, 14, 16, 19]),
    badges: ["幹線道路"],
    gender: "male",
    ageGroup: "30代",
    teachingStyle: ["厳しめ"],
    hasInstructorLicense: true,
    serviceAreas: "千葉県（柏市、松戸市、流山市）",
    designatedAreas: ["千葉県 柏市", "千葉県 松戸市", "千葉県 流山市"],
    travelAreas: ["千葉県 我孫子市", "茨城県 取手市"],
    availableDays: "火、木、土、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 3, afternoon: 3, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "佐藤 健太",
        age: 35,
        course: "7回コース",
        rating: 4,
        comment:
          "幹線道路での運転が怖かったのですが、清水先生が段階的に練習させてくれたおかげで、交通量の多い道でも落ち着いて運転できるようになりました。少し厳しいですが、その分上達しました。",
        date: "2024-11-01",
      },
      {
        studentName: "田中 花子",
        age: 28,
        course: "4回コース",
        rating: 5,
        comment:
          "国道での合流や車線変更の練習をしました。清水先生の的確な指示で、安全に運転できるようになりました。交通量の多い道でも怖くなくなりました。",
        date: "2024-09-20",
      },
    ],
  },
  {
    id: "18",
    name: "池田 奈々",
    avatar: "/instructor18.jpg",
    rating: 4.8,
    reviewCount: 107,
    experience: 14,
    area: "東京都 足立区",
    coursePrices: defaultCoursePrices,
    specialties: ["病院送迎", "介護施設", "バリアフリー対応"],
    introduction: "ご家族の送迎に必要な運転スキルを丁寧に指導。優しく寄り添います。",
    carType: "ダイハツ タント",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 4, 6, 8, 11, 13, 16, 18]),
    badges: ["介護対応"],
    gender: "female",
    ageGroup: "50代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "東京都（足立区、葛飾区、荒川区）",
    designatedAreas: ["東京都 足立区", "東京都 葛飾区", "東京都 荒川区"],
    travelAreas: ["東京都 北区", "埼玉県 草加市"],
    availableDays: "月、水、金、土",
    travelFee: 800,
    vehicleFee: 400,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 1 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "田中 恵子",
        age: 62,
        course: "7回コース",
        rating: 5,
        comment:
          "親の病院送迎のために講習を受けました。池田先生がバリアフリー対応の重要性や、介護施設周辺での注意点を丁寧に教えてくださり、安心して送迎できるようになりました。",
        date: "2024-11-25",
      },
      {
        studentName: "岡田 昌子",
        age: 55,
        course: "4回コース",
        rating: 5,
        comment:
          "介護施設での送迎練習をしました。池田先生の優しい指導のおかげで、ご家族にも安心して同乗していただけるようになりました。",
        date: "2024-10-18",
      },
    ],
  },
  {
    id: "19",
    name: "橋本 雅人",
    avatar: "/instructor19.jpg",
    rating: 4.6,
    reviewCount: 62,
    experience: 7,
    area: "神奈川県 相模原市",
    coursePrices: defaultCoursePrices,
    specialties: ["坂道発進", "山道運転", "カーブ走行"],
    introduction: "坂道の多いエリアならお任せ！苦手な坂道発進も自信を持てるようになります。",
    carType: "スズキ ジムニー",
    transmissionTypes: ["AT", "MT"],
    availableDates: generateAvailableDates([3, 5, 7, 10, 12, 14, 17, 19]),
    badges: ["坂道マスター"],
    gender: "male",
    ageGroup: "30代",
    teachingStyle: ["優しい"],
    hasInstructorLicense: false,
    serviceAreas: "神奈川県（相模原市、町田市）",
    designatedAreas: ["神奈川県 相模原市", "東京都 町田市"],
    travelAreas: ["神奈川県 厚木市", "神奈川県 大和市"],
    availableDays: "火、木、土、日",
    travelFee: 1100,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 2, afternoon: 2, evening: 2 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "伊藤 健太",
        age: 29,
        course: "7回コース",
        rating: 5,
        comment:
          "坂道の多い地域に住んでおり、坂道発進が苦手でした。橋本先生の指導で、恐怖心がなくなり、自信を持って運転できるようになりました。山道でのカーブ走行もスムーズになりました。",
        date: "2024-11-15",
      },
      {
        studentName: "青山 奈々",
        age: 38,
        course: "4回コース",
        rating: 4,
        comment:
          "坂道発進の練習を重点的に行いました。橋本先生が根気強く教えてくださり、少しずつできるようになりました。山道運転も安心感を持って走れるようになりました。",
        date: "2024-10-05",
      },
    ],
  },
  {
    id: "20",
    name: "野村 真美",
    avatar: "/instructor20.jpg",
    rating: 4.9,
    reviewCount: 148,
    experience: 16,
    area: "東京都 武蔵野市",
    coursePrices: defaultCoursePrices,
    specialties: ["夜間運転", "悪天候", "視界不良時"],
    introduction: "あらゆる条件下での運転に対応。安全運転のプロフェッショナルです。",
    carType: "ホンダ フリード",
    transmissionTypes: ["AT"],
    availableDates: generateAvailableDates([1, 3, 5, 8, 10, 12, 15, 17]),
    badges: ["全天候対応", "ベテラン"],
    gender: "female",
    ageGroup: "50代",
    teachingStyle: ["厳しめ"],
    hasInstructorLicense: true,
    serviceAreas: "東京都（武蔵野市、三鷹市、調布市）",
    designatedAreas: ["東京都 武蔵野市", "東京都 三鷹市", "東京都 調布市"],
    travelAreas: ["東京都 小金井市", "東京都 府中市"],
    availableDays: "月、水、金、日",
    travelFee: 1000,
    vehicleFee: 500,
    timeSlotCapacity: { morning: 3, afternoon: 3, evening: 3 },
    scheduledLessons: [],
    testimonials: [
      {
        studentName: "田中 恵子",
        age: 62,
        course: "7回コース",
        rating: 5,
        comment:
          "夜間運転や悪天候時の運転が不安でしたが、野村先生の指導で自信がつきました。視界不良時でも落ち着いて運転できるコツを教えていただき、大変参考になりました。",
        date: "2024-11-25",
      },
      {
        studentName: "岡田 昌子",
        age: 55,
        course: "4回コース",
        rating: 5,
        comment:
          "悪天候時の運転練習をしました。野村先生の的確なアドバイスで、雨の日でも安心して運転できるようになりました。ベテラン講師なので安心感があります。",
        date: "2024-10-18",
      },
    ],
  },
]

export const areas = [
  "すべてのエリア",
  "東京都 品川区",
  "東京都 目黒区",
  "東京都 渋谷区",
  "東京都 世田谷区",
  "東京都 港区",
  "神奈川県 横浜市",
  "埼玉県 さいたま市",
  "千葉県 舟橋市",
  "東京都 練馬区",
  "東京都 杉並区",
  "神奈川県 川崎市",
  "東京都 江東区",
  "埼玉県 川口市",
  "千葉県 柏市",
  "神奈川県 相模原市",
  "東京都 足立区",
  "東京都 武蔵野市",
]

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  instructorId: string
  instructorName: string
  instructorAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export const conversations: Conversation[] = [
  {
    id: "1",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    lastMessage: "次回のレッスンは10時からでよろしいでしょうか？",
    lastMessageTime: "2時間前",
    unreadCount: 2,
  },
  {
    id: "2",
    instructorId: "2",
    instructorName: "山田 美咲",
    instructorAvatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
    lastMessage: "お疲れ様でした！次回も頑張りましょう。",
    lastMessageTime: "1日前",
    unreadCount: 0,
  },
  {
    id: "3",
    instructorId: "4",
    instructorName: "鈴木 あゆみ",
    instructorAvatar: "/cheerful-japanese-female-driving-instructor-in-her.jpg",
    lastMessage: "駐車の練習、だいぶ上達してきましたね！",
    lastMessageTime: "3日前",
    unreadCount: 0,
  },
]

export const messages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      conversationId: "1",
      senderId: "1",
      senderName: "田中 健太",
      senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      content: "予約ありがとうございます！当日は渋谷駅南口でお待ちしております。",
      timestamp: "2024-12-10 14:30",
      read: true,
    },
    {
      id: "2",
      conversationId: "1",
      senderId: "user",
      senderName: "あなた",
      senderAvatar: "/abstract-geometric-shapes.png",
      content: "よろしくお願いします！緊張しますが頑張ります。",
      timestamp: "2024-12-10 14:45",
      read: true,
    },
    {
      id: "3",
      conversationId: "1",
      senderId: "1",
      senderName: "田中 健太",
      senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      content: "大丈夫です！リラックスして楽しく練習しましょう。",
      timestamp: "2024-12-10 15:00",
      read: true,
    },
    {
      id: "4",
      conversationId: "1",
      senderId: "1",
      senderName: "田中 健太",
      senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      content: "次回のレッスンは10時からでよろしいでしょうか？",
      timestamp: "2024-12-12 08:30",
      read: false,
    },
  ],
  "2": [
    {
      id: "5",
      conversationId: "2",
      senderId: "2",
      senderName: "山田 美咲",
      senderAvatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      content: "本日はお疲れ様でした！車線変更がとても上達してきましたね。",
      timestamp: "2024-12-11 17:00",
      read: true,
    },
    {
      id: "6",
      conversationId: "2",
      senderId: "user",
      senderName: "あなた",
      senderAvatar: "/abstract-geometric-shapes.png",
      content: "ありがとうございました！次回も楽しみです。",
      timestamp: "2024-12-11 17:15",
      read: true,
    },
    {
      id: "7",
      conversationId: "2",
      senderId: "2",
      senderName: "山田 美咲",
      senderAvatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      content: "お疲れ様でした！次回も頑張りましょう。",
      timestamp: "2024-12-11 17:20",
      read: true,
    },
  ],
  "3": [
    {
      id: "8",
      conversationId: "3",
      senderId: "4",
      senderName: "鈴木 あゆみ",
      senderAvatar: "/cheerful-japanese-female-driving-instructor-in-her.jpg",
      content: "本日のレッスンありがとうございました！",
      timestamp: "2024-12-08 16:00",
      read: true,
    },
    {
      id: "9",
      conversationId: "3",
      senderId: "user",
      senderName: "あなた",
      senderAvatar: "/placeholder-user.jpg",
      content: "こちらこそありがとうございました！駐車がまだ苦手です...",
      timestamp: "2024-12-08 16:15",
      read: true,
    },
    {
      id: "10",
      conversationId: "3",
      senderId: "4",
      senderName: "鈴木 あゆみ",
      senderAvatar: "/cheerful-japanese-female-driving-instructor-in-her.jpg",
      content: "駐車の練習、だいぶ上達してきましたね！",
      timestamp: "2024-12-08 16:30",
      read: true,
    },
  ],
}

export interface Student {
  id: string
  name: string
  avatar: string
  email: string
  phone: string
  address: string
  gender: "male" | "female"
  age: number
  licenseType: "普通免許（AT）" | "普通免許（MT）" | "なし"
  drivingExperience: "未経験" | "1年未満" | "1-3年" | "3-5年" | "5年以上"
  registeredAt: string
  customerType: "new" | "repeat"
}

export const students: Student[] = [
  {
    id: "1",
    name: "山本 花子",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "hanako.yamamoto@example.com",
    phone: "090-1234-5678",
    address: "東京都渋谷区恵比寿1-2-3",
    gender: "female",
    age: 28,
    licenseType: "なし",
    drivingExperience: "未経験",
    registeredAt: "2024-12-01",
    customerType: "new",
  },
  {
    id: "2",
    name: "佐々木 太郎",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "taro.sasaki@example.com",
    phone: "090-2345-6789",
    address: "東京都新宿区西新宿2-3-4",
    gender: "male",
    age: 35,
    licenseType: "普通免許（AT）",
    drivingExperience: "1-3年",
    registeredAt: "2024-11-15",
    customerType: "repeat",
  },
  {
    id: "3",
    name: "田村 優子",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "yuko.tamura@example.com",
    phone: "090-3456-7890",
    address: "東京都港区六本木3-4-5",
    gender: "female",
    age: 42,
    licenseType: "普通免許（AT）",
    drivingExperience: "5年以上",
    registeredAt: "2024-10-20",
    customerType: "repeat",
  },
  {
    id: "4",
    name: "中村 健",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "ken.nakamura@example.com",
    phone: "090-4567-8901",
    address: "東京都品川区大崎4-5-6",
    gender: "male",
    age: 31,
    licenseType: "普通免許（MT）",
    drivingExperience: "1年未満",
    registeredAt: "2024-12-05",
    customerType: "new",
  },
]

export interface Booking {
  id: string
  instructorId: string
  instructorName: string
  instructorAvatar: string
  studentId: string
  studentName: string
  studentAvatar: string
  date: string
  time: string
  timeSlot?: "morning" | "afternoon" | "evening"
  duration: string
  course: string
  price: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  meetingPoint: string
  notes?: string
  createdAt: string
  coursePackageId?: string
  sessionNumber?: number
  remainingTickets?: number
}

export interface CoursePackage {
  id: string
  studentId: string
  instructorId: string
  instructorName: string
  courseName: string
  totalSessions: number
  usedSessions: number
  remainingTickets: number
  purchasedAt: string
  expiresAt?: string
}

export const coursePackages: CoursePackage[] = [
  {
    id: "pkg-1",
    studentId: "1",
    instructorId: "1",
    instructorName: "田中 健太",
    courseName: "2時限×7回コース",
    totalSessions: 7,
    usedSessions: 4,
    remainingTickets: 3,
    purchasedAt: "2024-12-01T10:00:00",
  },
  {
    id: "pkg-2",
    studentId: "1",
    instructorId: "2",
    instructorName: "山田 美咲",
    courseName: "2時限×10回コース",
    totalSessions: 10,
    usedSessions: 3,
    remainingTickets: 7,
    purchasedAt: "2024-11-15T14:00:00",
  },
]

export const bookingRequests: Booking[] = [
  {
    id: "req-1",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "1",
    studentName: "山本 花子",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-10",
    time: "10:00",
    timeSlot: "morning",
    duration: "100分",
    course: "2時限×4回コース（1回目）",
    price: 13200,
    status: "pending",
    meetingPoint: "渋谷駅南口",
    notes: "10年ぶりの運転で緊張していますが、よろしくお願いします。",
    createdAt: "2024-12-14T09:30:00",
    coursePackageId: "pkg-1",
    sessionNumber: 1,
    remainingTickets: 6,
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: false,
  },
  {
    id: "req-2",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "2",
    studentName: "佐々木 太郎",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-12",
    time: "",
    timeSlot: "afternoon",
    duration: "100分",
    course: "1回コース",
    price: 9000,
    status: "pending",
    meetingPoint: "新宿駅東口",
    notes: "高速道路の練習を希望します。",
    createdAt: "2024-12-14T10:15:00",
    transmissionType: "MT",
    useInstructorCar: true,
    pickupService: true,
  },
  // 完了済み予約（評価・口コミ、売上管理から参照）
  {
    id: "completed-1",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "1",
    studentName: "山本 花子",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-20",
    time: "10:00",
    timeSlot: "morning",
    duration: "100分",
    course: "2時限×7回コース",
    price: 13200,
    status: "completed",
    meetingPoint: "渋谷駅南口",
    notes: "駐車の練習を重点的にお願いします。",
    createdAt: "2025-01-15T09:00:00",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: false,
  },
  {
    id: "completed-2",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "3",
    studentName: "田村 優子",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-18",
    time: "14:00",
    timeSlot: "afternoon",
    duration: "100分",
    course: "2時限×4回コース",
    price: 13200,
    status: "completed",
    meetingPoint: "池袋駅東口",
    notes: "実践的な練習をお願いします。",
    createdAt: "2025-01-14T10:00:00",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: true,
  },
  {
    id: "completed-3",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "4",
    studentName: "中村 健",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-17",
    time: "10:00",
    timeSlot: "morning",
    duration: "100分",
    course: "2時限×7回コース",
    price: 13200,
    status: "completed",
    meetingPoint: "品川駅港南口",
    notes: "ペーパードライバー歴15年です。",
    createdAt: "2025-01-12T11:00:00",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: false,
  },
  {
    id: "completed-4",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "2",
    studentName: "佐々木 太郎",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-14",
    time: "15:00",
    timeSlot: "afternoon",
    duration: "100分",
    course: "2時限×10回コース",
    price: 13200,
    status: "completed",
    meetingPoint: "新宿駅東口",
    notes: "高速道路の練習を希望します。",
    createdAt: "2025-01-10T14:00:00",
    transmissionType: "MT",
    useInstructorCar: true,
    pickupService: true,
  },
  {
    id: "completed-5",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "3",
    studentName: "田村 優子",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-12",
    time: "10:00",
    timeSlot: "morning",
    duration: "100分",
    course: "2時限×4回コース",
    price: 13200,
    status: "completed",
    meetingPoint: "池袋駅東口",
    notes: "縦列駐車を練習したいです。",
    createdAt: "2025-01-08T09:00:00",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: false,
  },
  {
    id: "completed-6",
    instructorId: "1",
    instructorName: "田中 健太",
    instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
    studentId: "1",
    studentName: "山本 花子",
    studentAvatar: "/abstract-geometric-shapes.png",
    date: "2025-01-10",
    time: "10:00",
    timeSlot: "morning",
    duration: "100分",
    course: "2時限×7回コース",
    price: 13200,
    status: "completed",
    meetingPoint: "渋谷駅南口",
    notes: "初回レッスンです。緊張しています。",
    createdAt: "2025-01-05T08:00:00",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: false,
  },
]

export interface InstructorEarning {
  month: string
  totalEarnings: number
  pendingAmount: number
  withdrawnAmount: number
  completedLessons: number
  lessons: {
    date: string
    studentName: string
    course: string
    amount: number
    status: "completed" | "cancelled"
    studentId?: string
    bookingId?: string
    rating?: number
    review?: string
  }[]
}

export const instructorEarnings: InstructorEarning[] = [
  {
    month: "2024年12月",
    totalEarnings: 156000,
    pendingAmount: 156000,
    withdrawnAmount: 0,
    completedLessons: 12,
  lessons: [
  {
  date: "12/15",
  studentName: "山本 花子",
  course: "4回コース 残り2",
  amount: 13000,
  status: "completed",
  studentId: "1",
  bookingId: "completed-1",
  rating: 5,
  review: "とても丁寧に教えていただきました！",
  },
  {
  date: "12/14",
  studentName: "佐々木 太郎",
  course: "1回コース",
  amount: 13000,
  status: "completed",
  studentId: "2",
  bookingId: "completed-4",
  rating: 4,
  review: "分かりやすい指導でした。",
  },
  {
  date: "12/13",
  studentName: "田村 優子",
  course: "8回コース 残り5",
  amount: 13000,
  status: "completed",
  studentId: "3",
  bookingId: "completed-2",
  rating: 5,
  },
  { date: "12/12", studentName: "中村 健", course: "4回コース 残り1", amount: 13000, status: "completed", bookingId: "completed-3" },
  {
  date: "12/11",
  studentName: "山本 花子",
  course: "4回コース 残り3",
  amount: 13000,
  status: "completed",
  studentId: "1",
  bookingId: "completed-6",
  rating: 5,
  },
  {
  date: "12/10",
  studentName: "佐々木 太郎",
  course: "1回コース",
        amount: 13000,
        status: "completed",
        studentId: "2",
      },
      {
        date: "12/9",
        studentName: "田村 優子",
        course: "8回コース 残り6",
        amount: 13000,
        status: "completed",
        studentId: "3",
        rating: 4,
      },
      {
        date: "12/8",
        studentName: "山本 花子",
        course: "4回コース 残り4",
        amount: 13000,
        status: "completed",
        studentId: "1",
        rating: 5,
      },
      {
        date: "12/7",
        studentName: "中村 健",
        course: "4回コース 残り2",
        amount: 13000,
        status: "completed",
        studentId: "4",
        rating: 3,
        review: "普通でした。",
      },
      {
        date: "12/6",
        studentName: "田村 優子",
        course: "8回コース 残り7",
        amount: 13000,
        status: "completed",
        studentId: "3",
      },
      { date: "12/5", studentName: "佐々木 太郎", course: "1回コース", amount: 13000, status: "cancelled" },
      {
        date: "12/4",
        studentName: "山本 花子",
        course: "1回コース",
        amount: 13000,
        status: "completed",
        studentId: "1",
        rating: 5,
      },
    ],
  },
  {
    month: "2024年11月",
    totalEarnings: 156000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 11,
    lessons: [],
  },
  {
    month: "2024年10月",
    totalEarnings: 144000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 10,
    lessons: [],
  },
  {
    month: "2024年9月",
    totalEarnings: 132000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 9,
    lessons: [],
  },
  {
    month: "2024年8月",
    totalEarnings: 180000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 13,
    lessons: [],
  },
  {
    month: "2024年7月",
    totalEarnings: 192000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 14,
    lessons: [],
  },
  {
    month: "2024年6月",
    totalEarnings: 156000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 11,
    lessons: [],
  },
  {
    month: "2024年5月",
    totalEarnings: 168000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 12,
    lessons: [],
  },
  {
    month: "2024年4月",
    totalEarnings: 144000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 10,
    lessons: [],
  },
  {
    month: "2024年3月",
    totalEarnings: 120000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 8,
    lessons: [],
  },
  {
    month: "2024年2月",
    totalEarnings: 108000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 7,
    lessons: [],
  },
  {
    month: "2024年1月",
    totalEarnings: 132000,
    pendingAmount: 0,
    withdrawnAmount: 0,
    completedLessons: 9,
    lessons: [],
  },
]

export const instructorTypeOptions = ["ベテラン", "女性", "優しい", "厳しめ", "指導員資格者", "人気講師", "高評価"]

export const ageGroupOptions = ["20代", "30代", "40代", "50代", "60代"]

export type TimeSlotStatus = "available" | "tentative" | "booked"

export interface DaySchedule {
  date: string
  morning: TimeSlotStatus // 午前
  afternoon: TimeSlotStatus // 昼
  evening: TimeSlotStatus // 午後
  isHoliday: boolean // 休業日
}

export const instructorSchedule: DaySchedule[] = [
  // 2025年1月のサンプルデータ
  { date: "2025-01-06", morning: "available", afternoon: "tentative", evening: "booked", isHoliday: false },
  { date: "2025-01-07", morning: "available", afternoon: "tentative", evening: "booked", isHoliday: false },
  { date: "2025-01-08", morning: "available", afternoon: "tentative", evening: "booked", isHoliday: false },
  { date: "2025-01-09", morning: "available", afternoon: "tentative", evening: "booked", isHoliday: false },
  { date: "2025-01-10", morning: "available", afternoon: "tentative", evening: "booked", isHoliday: false },
  { date: "2025-01-11", morning: "available", afternoon: "tentative", evening: "booked", isHoliday: true },
  { date: "2025-01-12", morning: "available", afternoon: "tentative", evening: "booked", isHoliday: true },
]

export interface ScheduledLesson {
  id: string
  instructorId: string
  date: string
  timeSlot: "morning" | "afternoon" | "evening"
  confirmedTime?: string // 確定した時間（例: "10:00"）
  studentId?: string
  studentName: string
  studentPhone: string
  course: string
  price: number
  meetingPoint: string
  status: "tentative" | "confirmed"
  notes?: string
  transmissionType?: "AT" | "MT"
  useInstructorCar?: boolean
  pickupService?: boolean
}

export const scheduledLessons: ScheduledLesson[] = [
  {
    id: "sl-1",
    instructorId: "1",
    date: "2026-01-21",
    timeSlot: "morning",
    confirmedTime: "10:00",
    studentId: "1",
    studentName: "田中 花子",
    studentPhone: "090-1234-5678",
    course: "4回コース（1回目）",
    price: 13200,
    meetingPoint: "渋谷駅南口",
    status: "confirmed",
    notes: "高速道路練習希望",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: false,
  },
  {
    id: "sl-2",
    instructorId: "1",
    date: "2026-01-21",
    timeSlot: "afternoon",
    studentId: "2",
    studentName: "佐藤 美咲",
    studentPhone: "080-9876-5432",
    course: "7回コース（3回目）",
    price: 13200,
    meetingPoint: "新宿駅東口",
    status: "tentative",
    notes: "駐車練習希望",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: true,
  },
  {
    id: "sl-3",
    instructorId: "1",
    date: "2026-01-22",
    timeSlot: "morning",
    studentId: "3",
    studentName: "山本 太郎",
    studentPhone: "070-1111-2222",
    course: "10回コース（5回目）",
    price: 13200,
    meetingPoint: "池袋駅東口",
    status: "tentative",
    transmissionType: "MT",
    useInstructorCar: true,
    pickupService: false,
  },
  {
    id: "sl-4",
    instructorId: "1",
    date: "2026-01-22",
    timeSlot: "afternoon",
    confirmedTime: "14:30",
    studentId: "4",
    studentName: "鈴木 次郎",
    studentPhone: "080-3333-4444",
    course: "1回コース",
    price: 9000,
    meetingPoint: "品川駅港南口",
    status: "confirmed",
    notes: "縦列駐車重点",
    transmissionType: "AT",
    useInstructorCar: true,
    pickupService: true,
  },
  {
    id: "sl-5",
    instructorId: "1",
    date: "2026-01-23",
    timeSlot: "evening",
    studentId: "5",
    studentName: "高橋 愛",
    studentPhone: "090-5555-6666",
    course: "4回コース（2回目）",
    price: 13200,
    meetingPoint: "東京駅丸の内口",
    status: "tentative",
    notes: "夜間運転練習",
    transmissionType: "AT",
    useInstructorCar: false,
    pickupService: false,
  },
]

export interface InstructorConversation {
  id: string
  studentId: string
  studentName: string
  studentAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export const instructorConversations: InstructorConversation[] = [
  {
    id: "ic-1",
    studentId: "1",
    studentName: "山本 花子",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "はい、10時で大丈夫です。よろしくお願いします！",
    lastMessageTime: "1時間前",
    unreadCount: 1,
  },
  {
    id: "ic-2",
    studentId: "2",
    studentName: "佐々木 太郎",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "高速道路の練習、ありがとうございました！",
    lastMessageTime: "昨日",
    unreadCount: 0,
  },
  {
    id: "ic-3",
    studentId: "3",
    studentName: "田村 優子",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "駐車が少しできるようになりました！",
    lastMessageTime: "2日前",
    unreadCount: 0,
  },
  {
    id: "ic-4",
    studentId: "4",
    studentName: "中村 健",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "来週の予約をお願いできますか？",
    lastMessageTime: "3日前",
    unreadCount: 2,
  },
]

export const instructorMessages: Record<string, Message[]> = {
  "ic-1": [
    {
      id: "im-1",
      conversationId: "ic-1",
      senderId: "1",
      senderName: "田中 健太",
      senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      content: "山本さん、予約ありがとうございます。次回のレッスンは10時からでよろしいでしょうか？",
      timestamp: "2024-12-14 08:30",
      read: true,
    },
    {
      id: "im-2",
      conversationId: "ic-1",
      senderId: "1",
      senderName: "山本 花子",
      senderAvatar: "/placeholder.svg?height=48&width=48",
      content: "予約ありがとうございます！次回は駐車の練習をお願いしたいです。",
      timestamp: "2024-12-14 09:30",
      read: true,
    },
    {
      id: "im-3",
      conversationId: "ic-1",
      senderId: "1",
      senderName: "田中 健太",
      senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      content: "了解しました！駐車の基礎から丁寧に指導します。",
      timestamp: "2024-12-14 10:00",
      read: true,
    },
  ],
  "ic-2": [
    {
      id: "im-4",
      conversationId: "ic-2",
      senderId: "2",
      senderName: "佐々木 太郎",
      senderAvatar: "/placeholder.svg?height=48&width=48",
      content: "高速道路の練習をお願いできますか？",
      timestamp: "2024-12-13 15:00",
      read: true,
    },
    {
      id: "im-5",
      conversationId: "ic-2",
      senderId: "1",
      senderName: "田中 健太",
      senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      content: "もちろんです。合流や車線変更の練習もしましょう。",
      timestamp: "2024-12-13 15:30",
      read: true,
    },
    {
      id: "im-6",
      conversationId: "ic-2",
      senderId: "2",
      senderName: "佐々木 太郎",
      senderAvatar: "/placeholder.svg?height=48&width=48",
      content: "次回よろしくお願いします！",
      timestamp: "2024-12-13 15:45",
      read: false,
    },
  ],
  "ic-3": [
    {
      id: "im-7",
      conversationId: "ic-3",
      senderId: "3",
      senderName: "田村 優子",
      senderAvatar: "/placeholder.svg?height=48&width=48",
      content: "先日はありがとうございました。駐車が少しずつできるようになりました！",
      timestamp: "2024-12-12 14:20",
      read: true,
    },
    {
      id: "im-8",
      conversationId: "ic-3",
      senderId: "1",
      senderName: "田中 健太",
      senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      content: "それは良かったです！焦らず練習を続けましょう。",
      timestamp: "2024-12-12 14:45",
      read: true,
    },
  ],
  "ic-4": [
    {
      id: "im-9",
      conversationId: "ic-4",
      senderId: "4",
      senderName: "中村 健",
      senderAvatar: "/placeholder.svg?height=48&width=48",
      content: "お世話になっております。来週の月曜日か火曜日に予約をお願いできますか？",
      timestamp: "2024-12-11 10:00",
      read: false,
    },
    {
      id: "im-10",
      conversationId: "ic-4",
      senderId: "4",
      senderName: "中村 健",
      senderAvatar: "/placeholder.svg?height=48&width=48",
      content: "午前中の時間帯を希望しています。",
      timestamp: "2024-12-11 10:05",
      read: false,
    },
  ],
}

export const specialtyOptions = [
  "高速道路",
  "駐車",
  "夜間運転",
  "初心者向け",
  "女性専用対応",
  "長距離",
  "山道",
  "縦列駐車",
  "車庫入れ",
  "基礎練習",
  "都心部運転",
  "時間帯別運転",
  "雨天運転",
  "子育て世代",
  "通学路",
  "スーパー駐車場",
  "首都高速",
  "高齢者向け",
  "リハビリ運転",
  "認知機能ケア",
  "通勤ルート",
  "駅前運転",
  "商業施設駐車",
  "空港アクセス",
  "羽田周辺",
  "環状線",
  "海岸道路",
  "観光地運転",
  "混雑回避",
  "郊外運転",
  "住宅街",
  "学校周辺",
  "国道運転",
  "幹線道路",
  "交通量の多い道",
  "病院送迎",
  "介護施設",
  "バリアフリー対応",
  "坂道発進",
  "若者向け",
  "SNS対応",
  "カーシェア運転",
]

export interface Review {
  id: string
  bookingId: string
  instructorId: string
  studentId: string
  studentName: string
  rating: number
  comment: string
  createdAt: string
  tags: string[]
}

export const reviews: Review[] = [
  {
    id: "r1",
    bookingId: "3",
    instructorId: "1",
    studentId: "1",
    studentName: "山本 花子",
    rating: 5,
    comment: "とても丁寧に教えていただきました。10年ぶりの運転でしたが、安心して練習できました。",
    createdAt: "2024-12-09T10:00:00",
    tags: ["丁寧", "わかりやすい"],
  },
]

export interface LoginCredentials {
  email: string
  password: string
  userId: string
  userType: "student" | "instructor"
  name: string
}

export const testLoginCredentials: LoginCredentials[] = [
  {
    email: "tanaka@example.com",
    password: "password123",
    userId: "1",
    userType: "instructor",
    name: "田中 健太",
  },
  {
    email: "yamada@example.com",
    password: "password123",
    userId: "2",
    userType: "instructor",
    name: "山田 美咲",
  },
  {
    email: "student@example.com",
    password: "password123",
    userId: "1",
    userType: "student",
    name: "山本 花子",
  },
]
