import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Code2, Database, Download, ExternalLink, Github, Globe2, GraduationCap, Instagram, Languages, Linkedin, Mail, MapPin, Menu, Moon, Phone, Send, Sparkles, Sun, X } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type SectionHeadingProps = { eyebrow: string; title: string; copy?: string; index: string };

function SectionHeading({ eyebrow, title, copy, index }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div className="section-index" aria-hidden="true">{index}</div>
      <div>
        <p className="eyebrow"><span />{eyebrow}</p>
        <h2>{title}</h2>
        {copy ? <p className="section-copy">{copy}</p> : null}
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
    >{children}</motion.div>
  );
}

function Skeleton() {
  return <div className="min-h-screen grid place-items-center bg-[var(--canvas)] text-[var(--ink-muted)]"><div className="loading-orb" /></div>;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ senderName: "", senderEmail: "", subject: "", body: "" });
  const { data, isLoading, isError, refetch } = trpc.portfolio.publicData.useQuery();
  const language = i18n.language.startsWith("ar") ? "ar" : "en";
  const isArabic = language === "ar";

  const message = trpc.portfolio.sendMessage.useMutation({
    onSuccess: () => { toast.success(t("contact.sent")); setForm({ senderName: "", senderEmail: "", subject: "", body: "" }); },
    onError: () => toast.error(t("contact.error")),
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic, language]);

  const changeLanguage = () => {
    const next = isArabic ? "en" : "ar";
    localStorage.setItem("portfolio-language", next);
    i18n.changeLanguage(next);
  };

  const profile = data?.profile;
  const name = isArabic ? profile?.nameAr : profile?.nameEn;
  const availability = isArabic ? profile?.availabilityAr : profile?.availabilityEn;
  const headline = isArabic ? profile?.headlineAr : profile?.headlineEn;
  const bio = isArabic ? profile?.bioAr : profile?.bioEn;
  const location = isArabic ? profile?.locationAr : profile?.locationEn;
  const education = isArabic ? profile?.educationAr : profile?.educationEn;
  const training = isArabic ? profile?.trainingAr : profile?.trainingEn;
  const initials = useMemo(() => (name || "P").split(" ").filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase(), [name]);
  const navItems = ["about", "skills", "projects", "certificates", "contact"] as const;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    message.mutate(form);
  };

  if (isLoading) return <Skeleton />;
  if (isError) return <main className="load-error"><div className="load-error-card glass-panel"><Code2 size={28} /><h1>{t("portfolio.loadError")}</h1><button className="primary-button" onClick={() => refetch()}>{t("portfolio.retry")}<ArrowUpRight size={17} /></button></div></main>;

  return (
    <main className="portfolio-shell signal-garden">
      <div className="ambient-field" aria-hidden="true"><div className="ambient-orb ambient-orb-a" /><div className="ambient-orb ambient-orb-b" /><div className="ambient-orb ambient-orb-c" /><div className="ambient-grid" /><div className="ambient-stars" /></div>
      <div className="grain" aria-hidden="true" />
      <div className="portfolio-frame">
      <aside className="identity-rail" aria-label="Profile summary">
        <div className="identity-card glass-panel">
          <div className="rail-portrait">{profile?.avatarUrl ? <img src={profile.avatarUrl} alt={name || "Profile"} /> : <span>{initials}</span>}<i className="rail-orbit rail-orbit-one" /><i className="rail-orbit rail-orbit-two" /></div>
          <p className="rail-system">SYSTEM // 01</p><h2>{name || "Portfolio"}</h2><p className="rail-headline">{headline || ""}</p>
          {availability ? <div className="rail-availability"><span />{availability}</div> : null}
          <div className="rail-contact">
            {profile?.email ? <a href={`mailto:${profile.email}`}><Mail size={15} /><span><b>EMAIL</b>{profile.email}</span></a> : null}
            {profile?.phone ? <a href={`tel:${profile.phone.replace(/\s+/g, "")}`}><Phone size={15} /><span><b>PHONE</b>{profile.phone}</span></a> : null}
            {location ? <span><MapPin size={15} /><span><b>LOCATION</b>{location}</span></span> : null}
          </div>
          <div className="rail-socials">{profile?.githubUrl ? <a href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a> : null}{profile?.linkedinUrl ? <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a> : null}{profile?.instagramUrl ? <a href={profile.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a> : null}{profile?.cvUrl ? <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="rail-cv"><Download size={16} />{t("hero.downloadCv")}</a> : null}</div>
        </div>
        <nav className="identity-navigation" aria-label="Portfolio sections">{navItems.map((item, index) => <a key={item} href={`#${item}`}><span>0{index + 1}</span>{t(`nav.${item}`)}</a>)}</nav>
      </aside>
      <div className="content-canvas">
      <header className={`topbar ${scrolled ? "topbar-scrolled" : ""}`}>
        <a href="#top" className="brand" aria-label="Portfolio home"><span className="brand-mark brand-monogram" aria-hidden="true"><i /><i /><i /></span><span>{name || "Portfolio"}</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(item => <a key={item} href={`#${item}`}>{t(`nav.${item}`)}</a>)}
        </nav>
        <div className="nav-controls">
          <button className="icon-button" onClick={changeLanguage} aria-label={t("controls.language")}><Languages size={17} /><span>{t("controls.language")}</span></button>
          <button className="icon-button compact" onClick={toggleTheme} aria-label={theme === "dark" ? t("controls.light") : t("controls.dark")}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button className="icon-button compact mobile-menu-button" onClick={() => setMenuOpen(open => !open)} aria-label={t("controls.menu")}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        {menuOpen ? <nav className="mobile-nav glass-panel" aria-label="Mobile navigation">{navItems.map(item => <a key={item} onClick={() => setMenuOpen(false)} href={`#${item}`}>{t(`nav.${item}`)}</a>)}</nav> : null}
      </header>

      <section id="top" className="hero section-shell rail-hero">
        <div className="hero-grid" aria-hidden="true" />
        <Reveal className="hero-copy">
          {availability ? <div className="availability"><span className="availability-dot" />{availability}</div> : null}
          {location ? <p className="hero-kicker"><MapPin size={15} />{location}</p> : null}
          <h1>{name || t("portfolio.emptyTitle")}<span className="hero-line">{headline || ""}</span></h1>
          <p className="hero-summary">{bio || t("portfolio.emptyCopy")}</p>
          <div className="hero-actions">
            <a href="#projects" className="primary-button">{t("hero.viewWork")}<ArrowDownRight size={18} /></a>
            <a href="#contact" className="text-button">{t("hero.contact")}<ArrowUpRight size={17} /></a>
            {profile?.cvUrl ? <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="text-button">{t("hero.downloadCv")}<Download size={17} /></a> : null}
          </div>
        </Reveal>
        <a className="scroll-cue" href="#about"><span>{t("hero.scroll")}</span><i /></a>
      </section>

      <section id="about" className="section-shell content-section about-section">
        <Reveal><SectionHeading index="01" eyebrow={t("about.label")} title={t("about.title")} /></Reveal>
        <div className="about-grid">
          <Reveal delay={0.05}><div className="about-statement"><p>{bio || t("portfolio.emptyCopy")}</p><div className="about-rule" />{location ? <span><MapPin size={16} />{t("about.location")} {location}</span> : null}</div></Reveal>
          <Reveal delay={0.12}><div className="timeline-card glass-panel">{training ? <div className="timeline-item"><div className="timeline-dot" /><div><span>NOW</span><h3>{training}</h3></div></div> : null}{education ? <div className="timeline-item"><div className="timeline-dot muted" /><div><span>EDUCATION</span><h3>{education}</h3></div></div> : null}</div></Reveal>
        </div>
      </section>

      <section id="skills" className="section-shell content-section skills-section">
        <Reveal><SectionHeading index="02" eyebrow={t("skills.label")} title={t("skills.title")} copy={t("skills.copy")} /></Reveal>
        <div className="skills-layout">
          <Reveal delay={0.08} className="skill-feature"><div className="skill-feature-icon"><Globe2 size={24} /></div><div><p className="eyebrow"><span />SYSTEM THINKING</p><h3>{isArabic ? "من الـ API إلى تجربة المستخدم." : "From the API to the user experience."}</h3></div></Reveal>
          <div className="skills-cloud">{(profile?.skills ?? []).map((skill, index) => <Reveal key={skill} delay={0.04 * index}><span className={`skill-pill skill-pill-${index % 4}`}>{skill}</span></Reveal>)}</div>
        </div>
      </section>

      <section id="projects" className="section-shell content-section projects-section">
        <Reveal><SectionHeading index="03" eyebrow={t("projects.label")} title={t("projects.title")} copy={t("projects.copy")} /></Reveal>
        {(data?.projects?.length ?? 0) > 0 ? <div className="projects-grid">{data?.projects.map((project, index) => <Reveal key={project.id} delay={0.06 * index}><article className={`project-card glass-panel ${index % 3 === 0 ? "project-card-featured" : ""}`}>
          <div className="project-visual">{project.imageUrl ? <img src={project.imageUrl} alt={isArabic ? project.titleAr : project.titleEn} /> : <div className="project-placeholder"><span>0{index + 1}</span><Code2 size={34} /></div>}</div>
          <div className="project-content"><div className="project-heading"><p>PROJECT / 0{index + 1}</p><h3>{isArabic ? project.titleAr : project.titleEn}</h3></div><p>{isArabic ? project.descriptionAr : project.descriptionEn}</p><div className="tag-row">{project.techStack.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links">{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={16} />{t("projects.source")}</a> : null}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} />{t("projects.demo")}</a> : null}</div></div>
        </article></Reveal>)}</div> : <Reveal><div className="empty-state"><Code2 size={26} /><p>{t("projects.empty")}</p></div></Reveal>}
      </section>

      <section id="certificates" className="section-shell content-section certificates-section">
        <Reveal><SectionHeading index="04" eyebrow={t("certificates.label")} title={t("certificates.title")} copy={t("certificates.copy")} /></Reveal>
        {(data?.certificates?.length ?? 0) > 0 ? <div className="certificates-list">{data?.certificates.map((certificate, index) => <Reveal key={certificate.id} delay={0.05 * index}><article className="certificate-row"><div className="certificate-number">0{index + 1}</div><div className="certificate-title"><GraduationCap size={21} /><div><h3>{isArabic ? certificate.titleAr : certificate.titleEn}</h3><p>{certificate.issuer}</p></div></div><div className="certificate-date">{certificate.issuedAt}</div>{certificate.credentialUrl ? <a className="certificate-link" href={certificate.credentialUrl} target="_blank" rel="noreferrer">{t("certificates.credential")}<ArrowUpRight size={16} /></a> : null}</article></Reveal>)}</div> : <Reveal><div className="empty-state"><GraduationCap size={26} /><p>{t("certificates.empty")}</p></div></Reveal>}
      </section>

      <section id="contact" className="section-shell content-section contact-section">
        <Reveal><div className="contact-wrap"><div><SectionHeading index="05" eyebrow={t("contact.label")} title={t("contact.title")} copy={t("contact.copy")} /><div className="contact-links">{profile?.email ? <a href={`mailto:${profile.email}`}><Mail size={17} />{profile.email}</a> : null}{profile?.phone ? <a href={`tel:${profile.phone.replace(/\s+/g, "")}`}><Phone size={17} />{profile.phone}</a> : null}{profile?.linkedinUrl ? <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin size={17} />LinkedIn</a> : null}{profile?.githubUrl ? <a href={profile.githubUrl} target="_blank" rel="noreferrer"><Github size={17} />GitHub</a> : null}{profile?.instagramUrl ? <a href={profile.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} />Instagram</a> : null}</div></div>
          <form className="contact-form glass-panel" onSubmit={handleSubmit}><div className="form-row"><label>{t("contact.name")}<input required value={form.senderName} onChange={event => setForm(current => ({ ...current, senderName: event.target.value }))} /></label><label>{t("contact.email")}<input type="email" required value={form.senderEmail} onChange={event => setForm(current => ({ ...current, senderEmail: event.target.value }))} /></label></div><label>{t("contact.subject")}<input required value={form.subject} onChange={event => setForm(current => ({ ...current, subject: event.target.value }))} /></label><label>{t("contact.message")}<textarea required rows={5} value={form.body} onChange={event => setForm(current => ({ ...current, body: event.target.value }))} /></label><button className="primary-button" disabled={message.isPending}>{message.isPending ? t("contact.sending") : t("contact.send")}<Send size={17} /></button></form>
        </div></Reveal>
      </section>

      <footer className="footer section-shell"><a href="#top" className="brand"><span className="brand-mark brand-monogram" aria-hidden="true"><i /><i /><i /></span><span>{name || "Portfolio"}</span></a><p>{t("footer.built")}</p><div className="footer-links">{profile?.cvUrl ? <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="footer-dashboard">{t("footer.downloadCv")}<Download size={15} /></a> : null}<a href="/admin" className="footer-dashboard">{t("footer.dashboard")}<ArrowUpRight size={15} /></a></div></footer>
      </div></div>
    </main>
  );
}
