/**
 * Kiddo English - ข้อมูลบทเรียนและคำศัพท์ภาษาอังกฤษ
 * ปรับปรุงเนื้อหาบทเรียน Family สำหรับระดับชั้นประถมศึกษาปีที่ 3 (ป.3)
 */

const ALPHABET_DATA = [
  { letter: 'A', lower: 'a', word: 'Apple', phonics: '/æ/ แอะ', icon: '🍎', thai: 'แอปเปิ้ล', example: 'An apple is red.' },
  { letter: 'B', lower: 'b', word: 'Bird', phonics: '/b/ เบอะ', icon: '🐦', thai: 'นก', example: 'The bird can fly.' },
  { letter: 'C', lower: 'c', word: 'Cat', phonics: '/k/ เคอะ', icon: '🐱', thai: 'แมว', example: 'I love my cute cat.' },
  { letter: 'D', lower: 'd', word: 'Dog', phonics: '/d/ เดอะ', icon: '🐶', thai: 'สุนัข', example: 'A dog is barking.' },
  { letter: 'E', lower: 'e', word: 'Elephant', phonics: '/e/ เอะ', icon: '🐘', thai: 'ช้าง', example: 'An elephant is big.' },
  { letter: 'F', lower: 'f', word: 'Fish', phonics: '/f/ เฟอะ', icon: '🐟', thai: 'ปลา', example: 'Fish swim in water.' },
  { letter: 'G', lower: 'g', word: 'Giraffe', phonics: '/g/ เกอะ', icon: '🦒', thai: 'ยีราฟ', example: 'A giraffe has a long neck.' },
  { letter: 'H', lower: 'h', word: 'Hat', phonics: '/h/ เฮอะ', icon: '👒', thai: 'หมวก', example: 'I wear a yellow hat.' },
  { letter: 'I', lower: 'i', word: 'Ice cream', phonics: '/ɪ/ อิ', icon: '🍦', thai: 'ไอศกรีม', example: 'I like sweet ice cream.' },
  { letter: 'J', lower: 'j', word: 'Juice', phonics: '/dʒ/ เจอะ', icon: '🪀', thai: 'น้ำผลไม้', example: 'Orange juice is delicious.' },
  { letter: 'K', lower: 'k', word: 'Kite', phonics: '/k/ เคอะ', icon: '🪁', thai: 'ว่าว', example: 'The kite flies high.' },
  { letter: 'L', lower: 'l', word: 'Lion', phonics: '/l/ เลอะ', icon: '🦁', thai: 'สิงโต', example: 'The lion is king.' },
  { letter: 'M', lower: 'm', word: 'Monkey', phonics: '/m/ เมอะ', icon: '🐵', thai: 'ลิง', example: 'The monkey loves bananas.' },
  { letter: 'N', lower: 'n', word: 'Nest', phonics: '/n/ เนอะ', icon: '🪹', thai: 'รังนก', example: 'Eggs are in the nest.' },
  { letter: 'O', lower: 'o', word: 'Orange', phonics: '/ɒ/ เอาะ', icon: '🍊', thai: 'ส้ม', example: 'An orange is sweet.' },
  { letter: 'P', lower: 'p', word: 'Pencil', phonics: '/p/ เพอะ', icon: '✏️', thai: 'ดินสอ', example: 'I write with a pencil.' },
  { letter: 'Q', lower: 'q', word: 'Queen', phonics: '/kw/ เควอะ', icon: '👑', thai: 'ราชินี', example: 'The queen wears a crown.' },
  { letter: 'R', lower: 'r', word: 'Rabbit', phonics: '/r/ เรอะ', icon: '🐰', thai: 'กระต่าย', example: 'A rabbit can hop.' },
  { letter: 'S', lower: 's', word: 'Sun', phonics: '/s/ เซอะ', icon: '☀️', thai: 'ดวงอาทิตย์', example: 'The sun is shining.' },
  { letter: 'T', lower: 't', word: 'Tiger', phonics: '/t/ เทอะ', icon: '🐯', thai: 'เสือ', example: 'The tiger runs fast.' },
  { letter: 'U', lower: 'u', word: 'Umbrella', phonics: '/ʌ/ อะ', icon: '☂️', thai: 'ร่ม', example: 'I have a colorful umbrella.' },
  { letter: 'V', lower: 'v', word: 'Van', phonics: '/v/ เวอะ', icon: '🚐', thai: 'รถตู้', example: 'The school van is here.' },
  { letter: 'W', lower: 'w', word: 'Watermelon', phonics: '/w/ เวอะ', icon: '🍉', thai: 'แตงโม', example: 'Watermelon is fresh and red.' },
  { letter: 'X', lower: 'x', word: 'Xylophone', phonics: '/ks/ คึส', icon: '🎵', thai: 'ไซโลโฟน (ระนาดฝรั่ง)', example: 'Play music on the xylophone.' },
  { letter: 'Y', lower: 'y', word: 'Yo-yo', phonics: '/j/ เยอะ', icon: '🪀', thai: 'ลูกดิ่ง', example: 'I like playing yo-yo.' },
  { letter: 'Z', lower: 'z', word: 'Zebra', phonics: '/z/ เซอะ (สั่น)', icon: '🦓', thai: 'ม้าลาย', example: 'A zebra has black and white stripes.' }
];

const VOCAB_CATEGORIES = [
  {
    id: 'family',
    title: 'ครอบครัว ป.3 (Family)',
    icon: '👨‍👩‍👧‍👦',
    color: '#EC4899',
    bgColor: '#FDF2F8',
    words: [
      { word: 'Grandfather', nickname: 'Grandpa', thai: 'คุณปู่ / คุณตา', icon: '👴', phonetic: 'แกรนด์-ฟา-เธอร์', sentence: 'This is my grandfather.' },
      { word: 'Grandmother', nickname: 'Grandma', thai: 'คุณย่า / คุณยาย', icon: '👵', phonetic: 'แกรนด์-มา-เธอร์', sentence: 'This is my grandmother.' },
      { word: 'Father', nickname: 'Dad', thai: 'คุณพ่อ', icon: '👨', phonetic: 'ฟา-เธอร์', sentence: 'This is my father.' },
      { word: 'Mother', nickname: 'Mom', thai: 'คุณแม่', icon: '👩', phonetic: 'มา-เธอร์', sentence: 'This is my mother.' },
      { word: 'Sister', nickname: 'Sis', thai: 'พี่สาว / น้องสาว', icon: '👧', phonetic: 'ซิส-เทอร์', sentence: 'She is my sister.' },
      { word: 'Brother', nickname: 'Bro', thai: 'พี่ชาย / น้องชาย', icon: '👦', phonetic: 'บรา-เธอร์', sentence: 'He is my brother.' },
      { word: 'Cousin', nickname: 'Cousin', thai: 'ลูกพี่ลูกน้อง', icon: '🧑', phonetic: 'คัซ-ซิน', sentence: 'He is my cousin.' },
      { word: 'Uncle', nickname: 'Uncle', thai: 'คุณลุง / คุณน้า / อา (ชาย)', icon: '👨‍🦰', phonetic: 'อัง-เคิล', sentence: 'He is my uncle.' },
      { word: 'Aunt', nickname: 'Auntie', thai: 'คุณป้า / คุณน้า / อา (หญิง)', icon: '👩‍🦱', phonetic: 'อานต์', sentence: 'She is my aunt.' },
      { word: 'Me', nickname: 'Me', thai: 'ตัวฉันเอง', icon: '🧒', phonetic: 'มี', sentence: 'This is me in Grade 3.' }
    ]
  },
  {
    id: 'numbers',
    title: 'ตัวเลข (Numbers)',
    icon: '🔢',
    color: '#FF6B6B',
    bgColor: '#FFF0F0',
    words: [
      { word: 'One', thai: 'หนึ่ง (1)', icon: '1️⃣', phonetic: 'วัน', count: 1 },
      { word: 'Two', thai: 'สอง (2)', icon: '2️⃣', phonetic: 'ทู', count: 2 },
      { word: 'Three', thai: 'สาม (3)', icon: '3️⃣', phonetic: 'ธรี', count: 3 },
      { word: 'Four', thai: 'สี่ (4)', icon: '4️⃣', phonetic: 'โฟร์', count: 4 },
      { word: 'Five', thai: 'ห้า (5)', icon: '5️⃣', phonetic: 'ไฟฟ์', count: 5 },
      { word: 'Six', thai: 'หก (6)', icon: '6️⃣', phonetic: 'ซิกส์', count: 6 },
      { word: 'Seven', thai: 'เจ็ด (7)', icon: '7️⃣', phonetic: 'เซเว่น', count: 7 },
      { word: 'Eight', thai: 'แปด (8)', icon: '8️⃣', phonetic: 'เอท', count: 8 },
      { word: 'Nine', thai: 'เก้า (9)', icon: '9️⃣', phonetic: 'ไนน์', count: 9 },
      { word: 'Ten', thai: 'สิบ (10)', icon: '🔟', phonetic: 'เท็น', count: 10 }
    ]
  },
  {
    id: 'colors',
    title: 'สีสัน (Colors)',
    icon: '🎨',
    color: '#4ECDC4',
    bgColor: '#EFFFFE',
    words: [
      { word: 'Red', thai: 'สีแดง', icon: '🔴', phonetic: 'เรด', hex: '#EF4444' },
      { word: 'Blue', thai: 'สีน้ำเงิน / สีฟ้า', icon: '🔵', phonetic: 'บลู', hex: '#3B82F6' },
      { word: 'Yellow', thai: 'สีเหลือง', icon: '🟡', phonetic: 'เยลโล่ว', hex: '#FACC15' },
      { word: 'Green', thai: 'สีเขียว', icon: '🟢', phonetic: 'กรีน', hex: '#22C55E' },
      { word: 'Orange', thai: 'สีส้ม', icon: '🟠', phonetic: 'ออเรนจ์', hex: '#F97316' },
      { word: 'Pink', thai: 'สีชมพู', icon: '🌸', phonetic: 'พิงก์', hex: '#EC4899' },
      { word: 'Purple', thai: 'สีม่วง', icon: '🟣', phonetic: 'เพอร์เพิล', hex: '#A855F7' },
      { word: 'Brown', thai: 'สีน้ำตาล', icon: '🟤', phonetic: 'บราวน์', hex: '#78350F' },
      { word: 'Black', thai: 'สีดำ', icon: '⚫', phonetic: 'แบล็ค', hex: '#18181B' },
      { word: 'White', thai: 'สีขาว', icon: '⚪', phonetic: 'ไวท์', hex: '#E4E4E7' }
    ]
  },
  {
    id: 'animals',
    title: 'สัตว์แสนน่ารัก (Animals)',
    icon: '🐶',
    color: '#FFD166',
    bgColor: '#FFFDF0',
    words: [
      { word: 'Cat', thai: 'แมว', icon: '🐱', phonetic: 'แคท', sound: 'Meow! Meow!' },
      { word: 'Dog', thai: 'สุนัข', icon: '🐶', phonetic: 'ด็อก', sound: 'Woof! Woof!' },
      { word: 'Bird', thai: 'นก', icon: '🐦', phonetic: 'เบิร์ด', sound: 'Tweet! Tweet!' },
      { word: 'Fish', thai: 'ปลา', icon: '🐟', phonetic: 'ฟิช', sound: 'Blub! Blub!' },
      { word: 'Duck', thai: 'เป็ด', icon: '🦆', phonetic: 'ดั๊ก', sound: 'Quack! Quack!' },
      { word: 'Pig', thai: 'หมู', icon: '🐷', phonetic: 'พิก', sound: 'Oink! Oink!' },
      { word: 'Rabbit', thai: 'กระต่าย', icon: '🐰', phonetic: 'แร็บบิท', sound: 'Hop! Hop!' },
      { word: 'Elephant', thai: 'ช้าง', icon: '🐘', phonetic: 'เอเลเฟนต์', sound: 'Pawoo!' },
      { word: 'Lion', thai: 'สิงโต', icon: '🦁', phonetic: 'ไลออน', sound: 'Roar!' },
      { word: 'Monkey', thai: 'ลิง', icon: '🐵', phonetic: 'มังกี้', sound: 'Ooh ooh aah aah!' }
    ]
  },
  {
    id: 'fruits',
    title: 'ผลไม้และของกิน (Fruits & Food)',
    icon: '🍎',
    color: '#06D6A0',
    bgColor: '#EDFBF7',
    words: [
      { word: 'Apple', thai: 'แอปเปิ้ล', icon: '🍎', phonetic: 'แอปเปิล' },
      { word: 'Banana', thai: 'กล้วย', icon: '🍌', phonetic: 'บานาน่า' },
      { word: 'Orange', thai: 'ส้ม', icon: '🍊', phonetic: 'ออเรนจ์' },
      { word: 'Watermelon', thai: 'แตงโม', icon: '🍉', phonetic: 'วอเทอร์เมลอน' },
      { word: 'Mango', thai: 'มะม่วง', icon: '🥭', phonetic: 'แมงโก้' },
      { word: 'Milk', thai: 'นม', icon: '🥛', phonetic: 'มิลค์' },
      { word: 'Egg', thai: 'ไข่', icon: '🥚', phonetic: 'เอ้ก' },
      { word: 'Bread', thai: 'ขนมปัง', icon: '🍞', phonetic: 'เบรด' },
      { word: 'Cake', thai: 'เค้ก', icon: '🎂', phonetic: 'เค้ก' },
      { word: 'Ice cream', thai: 'ไอศกรีม', icon: '🍦', phonetic: 'ไอศกรีม' }
    ]
  },
  {
    id: 'body',
    title: 'ร่างกายของฉัน (My Body)',
    icon: '🧍',
    color: '#118AB2',
    bgColor: '#EFF8FB',
    words: [
      { word: 'Head', thai: 'ศีรษะ / หัว', icon: '🗣️', phonetic: 'เฮด' },
      { word: 'Eye', thai: 'ตา', icon: '👁️', phonetic: 'อาย' },
      { word: 'Ear', thai: 'หู', icon: '👂', phonetic: 'เอียร์' },
      { word: 'Nose', thai: 'จมูก', icon: '👃', phonetic: 'โนส' },
      { word: 'Mouth', thai: 'ปาก', icon: '👄', phonetic: 'เมาท์' },
      { word: 'Hand', thai: 'มือ', icon: '✋', phonetic: 'แฮนด์' },
      { word: 'Arm', thai: 'แขน', icon: '💪', phonetic: 'อาร์ม' },
      { word: 'Leg', thai: 'ขา', icon: '🦵', phonetic: 'เลก' },
      { word: 'Foot', thai: 'เท้า', icon: '🦶', phonetic: 'ฟุต' },
      { word: 'Teeth', thai: 'ฟัน', icon: '🦷', phonetic: 'ทีธ' }
    ]
  },
  {
    id: 'school',
    title: 'โรงเรียนและคำทักทาย (School & Greetings)',
    icon: '🏫',
    color: '#8338EC',
    bgColor: '#F7F0FE',
    words: [
      { word: 'Book', thai: 'หนังสือ', icon: '📖', phonetic: 'บุ๊ค' },
      { word: 'Pencil', thai: 'ดินสอ', icon: '✏️', phonetic: 'เพนซิล' },
      { word: 'Ruler', thai: 'ไม้บรรทัด', icon: '📏', phonetic: 'รูเลอร์' },
      { word: 'Eraser', thai: 'ยางลบ', icon: '🧼', phonetic: 'อิเรเซอร์' },
      { word: 'School bag', thai: 'กระเป๋านักเรียน', icon: '🎒', phonetic: 'สคูลแบ็ก' },
      { word: 'Chair', thai: 'เก้าอี้', icon: '🪑', phonetic: 'แชร์' },
      { word: 'Desk', thai: 'โต๊ะเรียน', icon: '🪑', phonetic: 'เดสก์' },
      { word: 'Hello', thai: 'สวัสดี', icon: '👋', phonetic: 'ฮัลโหล' },
      { word: 'Good morning', thai: 'สวัสดีตอนเช้า', icon: '🌅', phonetic: 'กู๊ดมอร์นิ่ง' },
      { word: 'Thank you', thai: 'ขอบคุณ', icon: '🙏', phonetic: 'แธงกิวยู' }
    ]
  }
];

// ข้อมูลคำศัพท์ 10 คำเรื่อง Family ระดับชั้น ป.3
const FAMILY_MEMBERS_TREE = [
  {
    generation: 'grandparents',
    title: 'รุ่นปู่ย่าตายาย (Grandparents)',
    members: [
      {
        id: 'grandfather',
        word: 'Grandfather',
        shortName: 'Grandpa',
        thai: 'คุณปู่ / คุณตา',
        icon: '👴',
        phonetic: 'แกรนด์-ฟา-เธอร์',
        sentence: 'This is my grandfather. He is kind.',
        soundGreeting: 'Hello my grandchild!'
      },
      {
        id: 'grandmother',
        word: 'Grandmother',
        shortName: 'Grandma',
        thai: 'คุณย่า / คุณยาย',
        icon: '👵',
        phonetic: 'แกรนด์-มา-เธอร์',
        sentence: 'This is my grandmother. She is sweet.',
        soundGreeting: 'Have some cookies, darling!'
      }
    ]
  },
  {
    generation: 'parents',
    title: 'รุ่นพ่อแม่ ลุงป้าน้าอา (Parents & Relatives)',
    members: [
      {
        id: 'father',
        word: 'Father',
        shortName: 'Dad',
        thai: 'คุณพ่อ',
        icon: '👨',
        phonetic: 'ฟา-เธอร์',
        sentence: 'This is my father. He is hardworking.',
        soundGreeting: 'Good job, keep studying hard!'
      },
      {
        id: 'mother',
        word: 'Mother',
        shortName: 'Mom',
        thai: 'คุณแม่',
        icon: '👩',
        phonetic: 'มา-เธอร์',
        sentence: 'This is my mother. She loves cooking.',
        soundGreeting: 'I love you so much!'
      },
      {
        id: 'uncle',
        word: 'Uncle',
        shortName: 'Uncle',
        thai: 'คุณลุง / คุณน้า / อา (ชาย)',
        icon: '👨‍🦰',
        phonetic: 'อัง-เคิล',
        sentence: 'He is my uncle. He likes sports.',
        soundGreeting: 'Hey there champ!'
      },
      {
        id: 'aunt',
        word: 'Aunt',
        shortName: 'Auntie',
        thai: 'คุณป้า / คุณน้า / อา (หญิง)',
        icon: '👩‍🦱',
        phonetic: 'อานต์',
        sentence: 'She is my aunt. She is very helpful.',
        soundGreeting: 'Hello sweetie!'
      }
    ]
  },
  {
    generation: 'children',
    title: 'รุ่นพี่น้องและตัวฉัน (Children & Cousins)',
    members: [
      {
        id: 'brother',
        word: 'Brother',
        shortName: 'Brother',
        thai: 'พี่ชาย / น้องชาย',
        icon: '👦',
        phonetic: 'บรา-เธอร์',
        sentence: 'This is my brother. We ride bikes together.',
        soundGreeting: 'Let us play together!'
      },
      {
        id: 'sister',
        word: 'Sister',
        shortName: 'Sister',
        thai: 'พี่สาว / น้องสาว',
        icon: '👧',
        phonetic: 'ซิส-เทอร์',
        sentence: 'This is my sister. She loves reading books.',
        soundGreeting: 'Let us do homework together!'
      },
      {
        id: 'cousin',
        word: 'Cousin',
        shortName: 'Cousin',
        thai: 'ลูกพี่ลูกน้อง',
        icon: '🧑',
        phonetic: 'คัซ-ซิน',
        sentence: 'This is my cousin. We are good friends.',
        soundGreeting: 'Nice to see you, cousin!'
      },
      {
        id: 'me',
        word: 'Me',
        shortName: 'Me',
        thai: 'ตัวฉันเอง',
        icon: '🧒',
        phonetic: 'มี',
        sentence: 'This is me! I am a student in Grade 3.',
        soundGreeting: 'I am proud to be in Grade 3!'
      }
    ]
  }
];

// บทสนทนาภาษาอังกฤษเรื่องครอบครัว ระดับ ป.3
const FAMILY_CONVERSATIONS = [
  {
    q: 'Who is that man?',
    qThai: 'ผู้ชายคนนั้นคือใคร?',
    a: 'He is my grandfather.',
    aThai: 'เขาคือคุณปู่/คุณตาของฉัน',
    icon: '👴'
  },
  {
    q: 'Who is that woman?',
    qThai: 'ผู้หญิงคนนั้นคือใคร?',
    a: 'She is my aunt.',
    aThai: 'เธอคือคุณป้า/คุณน้า/คุณอาของฉัน',
    icon: '👩‍🦱'
  },
  {
    q: 'Who is this boy?',
    qThai: 'เด็กผู้ชายคนนี้คือใคร?',
    a: 'He is my cousin.',
    aThai: 'เขาคือลูกพี่ลูกน้องของฉัน',
    icon: '🧑'
  },
  {
    q: 'How many people are there in your family?',
    qThai: 'ในครอบครัวของคุณมีกี่คน?',
    a: 'There are five people in my family.',
    aThai: 'มี 5 คนในครอบครัวของฉัน',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    q: 'Do you have any brothers or sisters?',
    qThai: 'คุณมีพี่น้องไหม?',
    a: 'Yes, I have one brother and one sister.',
    aThai: 'มีครับ/ค่ะ ฉันมีพี่/น้องชาย 1 คน และพี่/น้องสาว 1 คน',
    icon: '👧'
  }
];

// ข้อมูลสำหรับเพลง Finger Family Song
const FINGER_FAMILY_SONG = [
  { role: 'Daddy', name: 'Daddy Finger (Father)', finger: '👍 นิ้วโป้ง', lyric: 'Daddy finger, Daddy finger, where are you? Here I am, here I am. How do you do?', icon: '👨' },
  { role: 'Mommy', name: 'Mommy Finger (Mother)', finger: '☝️ นิ้วชี้', lyric: 'Mommy finger, Mommy finger, where are you? Here I am, here I am. How do you do?', icon: '👩' },
  { role: 'Brother', name: 'Brother Finger (Brother)', finger: '🖕 นิ้วกลาง', lyric: 'Brother finger, Brother finger, where are you? Here I am, here I am. How do you do?', icon: '👦' },
  { role: 'Sister', name: 'Sister Finger (Sister)', finger: '💍 นิ้วนาง', lyric: 'Sister finger, Sister finger, where are you? Here I am, here I am. How do you do?', icon: '👧' },
  { role: 'Cousin', name: 'Cousin Finger (Cousin)', finger: '👶 นิ้วก้อย', lyric: 'Cousin finger, Cousin finger, where are you? Here I am, here I am. How do you do?', icon: '🧑' }
];

// ชุดคำศัพท์สำหรับเกมสะกดคำ (Spelling Game) เน้นคำศัพท์ ป.3
const SPELLING_WORDS = [
  { word: 'FATHER', icon: '👨', hint: 'คุณพ่อ' },
  { word: 'MOTHER', icon: '👩', hint: 'คุณแม่' },
  { word: 'SISTER', icon: '👧', hint: 'พี่สาว/น้องสาว' },
  { word: 'BROTHER', icon: '👦', hint: 'พี่ชาย/น้องชาย' },
  { word: 'COUSIN', icon: '🧑', hint: 'ลูกพี่ลูกน้อง' },
  { word: 'UNCLE', icon: '👨‍🦰', hint: 'คุณลุง/น้า/อา (ชาย)' },
  { word: 'AUNT', icon: '👩‍🦱', hint: 'คุณป้า/น้า/อา (หญิง)' },
  { word: 'FAMILY', icon: '🏡', hint: 'ครอบครัว' }
];

// รางวัลสติกเกอร์ที่เด็กๆ สามารถปลดล็อกได้
const STICKER_REWARDS = [
  { id: 'stk_1', name: 'ดาวดวงแรก ⭐', icon: '⭐', desc: 'เริ่มฝึกฝนภาษาอังกฤษ', starsNeeded: 5 },
  { id: 'stk_fam', name: 'ครอบครัวสุขสันต์ ป.3 👨‍👩‍👧‍👦', icon: '🏡', desc: 'เรียนรู้สมาชิกครอบครัว 10 คนครบถ้วน', starsNeeded: 12 },
  { id: 'stk_2', name: 'หนูน้อย A-Z 🔤', icon: '🔤', desc: 'เรียนรู้พยัญชนะครบ 26 ตัว', starsNeeded: 25 },
  { id: 'stk_3', name: 'ผู้พิทักษ์ตัวเลข 🔢', icon: '🎯', desc: 'นับเลข 1-10 คล่องแคล่ว', starsNeeded: 40 },
  { id: 'stk_4', name: 'ยอดนักสะกดคำ 🐝', icon: '🐝', desc: 'ชนะเกมสะกดคำ 3 รอบ', starsNeeded: 60 },
  { id: 'stk_5', name: 'จอมพลังความจำ 🧠', icon: '🏆', desc: 'ชนะเกมจับคู่การ์ด', starsNeeded: 80 },
  { id: 'stk_6', name: 'ซูเปอร์สตาร์ภาษาอังกฤษ ป.3 👑', icon: '👑', desc: 'สะสมดาวครบ 100 ดวง', starsNeeded: 100 }
];
