import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const initialLanguage = typeof window === "undefined" ? "en" : localStorage.getItem("portfolio-language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {
      nav: { about: "About", skills: "Skills", projects: "Work", certificates: "Credentials", contact: "Contact" },
      hero: { available: "Open to internship and junior opportunities", viewWork: "Explore selected work", contact: "Start a conversation", downloadCv: "View CV", scroll: "Scroll to discover" },
      about: { label: "About", title: "A builder who cares about the whole system.", education: "Education & learning", location: "Based in" },
      skills: { label: "Toolkit", title: "A practical, evolving technical toolkit.", copy: "I focus on durable backend foundations, clear interfaces, and thoughtful product details." },
      projects: { label: "Selected work", title: "Projects shaped around useful problems.", copy: "Each project lives in the database and can be updated from the owner dashboard.", source: "Source", demo: "Live demo", empty: "Selected projects will appear here as they are published." },
      certificates: { label: "Credentials", title: "Learning with intent, not just completion.", copy: "Training, coursework, and certifications are managed from the dashboard.", credential: "View credential", empty: "Credentials will appear here as they are added." },
      contact: { label: "Contact", title: "Have a role, project, or idea in mind?", copy: "Send a short note and I will respond as soon as possible.", name: "Your name", email: "Email address", subject: "Subject", message: "Your message", send: "Send message", sending: "Sending…", sent: "Your message has been sent.", error: "Something went wrong. Please try again." },
      footer: { built: "Built as a database-driven portfolio.", dashboard: "Owner dashboard", downloadCv: "View CV", rights: "All rights reserved." },
      controls: { language: "العربية", light: "Switch to light mode", dark: "Switch to dark mode", menu: "Open navigation" },
      loading: "Loading portfolio content…",
      portfolio: { emptyTitle: "Portfolio profile is being prepared.", emptyCopy: "The owner can complete public profile details from the management dashboard.", loadError: "Portfolio content could not be loaded.", retry: "Try again" },
    } },
    ar: { translation: {
      nav: { about: "عني", skills: "المهارات", projects: "المشاريع", certificates: "الشهادات", contact: "تواصل" },
      hero: { available: "متاح لفرص التدريب والعمل كمطور مبتدئ", viewWork: "استكشف الأعمال المختارة", contact: "ابدأ محادثة", downloadCv: "عرض السيرة الذاتية", scroll: "اكتشف المزيد" },
      about: { label: "نبذة", title: "مطور يهتم ببناء النظام كاملًا، لا بمجرد واجهته.", education: "التعليم والتطوير", location: "مقيم في" },
      skills: { label: "الأدوات", title: "مجموعة مهارات عملية تتطور باستمرار.", copy: "أركز على أساسيات خلفية متينة، وواجهات واضحة، وتفاصيل منتج مدروسة." },
      projects: { label: "أعمال مختارة", title: "مشاريع مبنية حول مشكلات مفيدة وحقيقية.", copy: "كل مشروع مرتبط بقاعدة البيانات ويمكن تحديثه من لوحة المالك.", source: "المصدر", demo: "عرض مباشر", empty: "ستظهر المشاريع المختارة هنا عند نشرها." },
      certificates: { label: "الشهادات", title: "تعلم مقصود، وليس مجرد إنجاز شكلي.", copy: "تُدار التدريبات والدورات والشهادات بالكامل من لوحة التحكم.", credential: "عرض الشهادة", empty: "ستظهر الشهادات هنا عند إضافتها." },
      contact: { label: "تواصل", title: "هل لديك فرصة أو مشروع أو فكرة؟", copy: "أرسل رسالة مختصرة وسأعود إليك في أقرب وقت ممكن.", name: "الاسم", email: "البريد الإلكتروني", subject: "الموضوع", message: "الرسالة", send: "إرسال الرسالة", sending: "جارٍ الإرسال…", sent: "تم إرسال رسالتك بنجاح.", error: "حدث خطأ. حاول مرة أخرى." },
      footer: { built: "بورتفوليو ديناميكي يعتمد على قاعدة بيانات.", dashboard: "لوحة المالك", downloadCv: "عرض السيرة الذاتية", rights: "جميع الحقوق محفوظة." },
      controls: { language: "English", light: "التحويل إلى الوضع الفاتح", dark: "التحويل إلى الوضع الداكن", menu: "فتح القائمة" },
      loading: "جارٍ تحميل محتوى البورتفوليو…",
      portfolio: { emptyTitle: "يجري إعداد الملف الشخصي للبورتفوليو.", emptyCopy: "يمكن للمالك استكمال تفاصيل الملف العام من لوحة التحكم.", loadError: "تعذر تحميل محتوى البورتفوليو.", retry: "حاول مرة أخرى" },
    } },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
