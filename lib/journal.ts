export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  accentColor: string;
  content: string[];
};

export const journalPosts: JournalPost[] = [
  {
    slug: "atir-tanlash-sanati",
    title: "Atir tanlash san'ati",
    excerpt: "To'g'ri hidni qanday topish mumkin — teri kimyosidan tortib, mavsumgacha.",
    accentColor: "#B5603A",
    content: [
      "Atir tanlash — shunchaki yoqimli hidni topish emas, balki o'z teringiz bilan uyg'un keladigan kompozitsiyani aniqlash demakdir. Har bir terining kimyoviy tarkibi boshqacha, shuning uchun bir xil atir ikki kishida turlicha ochiladi.",
      "Yangi hidni sinab ko'rishdan oldin uni bilakka purkab, kamida 15-20 daqiqa kutish tavsiya etiladi — shu vaqt ichida yuqori notalar uchib, haqiqiy xarakter namoyon bo'ladi.",
      "Mavsumni ham hisobga oling: yozda sitrus va yengil gulli hidlar, qishda esa sharqona va yog'ochsimon, qalinroq kompozitsiyalar yaxshiroq mos tushadi.",
    ],
  },
  {
    slug: "notalar-siri",
    title: "Notalar siri: yuqori, o'rta, baza",
    excerpt: "Har bir atir uch qatlamdan iborat — ular vaqt o'tishi bilan qanday ochiladi?",
    accentColor: "#A9793C",
    content: [
      "Professional parfyumeriyada har bir kompozitsiya uch qatlamga bo'linadi: yuqori notalar (birinchi taassurot, 15-30 daqiqa), o'rta notalar (hidning \"yuragi\", 2-4 soat) va baza notalar (eng uzoq qoladigan, chuqur asos).",
      "Yuqori notalar odatda sitrus yoki yengil o'simlik hidlari bo'ladi — ular diqqatni tortadi, lekin tez uchib ketadi. O'rta notalar gulli yoki ziravorli bo'lib, atirning shaxsiyatini belgilaydi.",
      "Baza notalar — amber, mushk, yog'ochsimon yoki oud kabi — soatlab, ba'zan kun bo'yi qoladi. Aynan shu qatlam atirning \"xotirasini\" yaratadi.",
    ],
  },
];

export function getJournalPost(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}
