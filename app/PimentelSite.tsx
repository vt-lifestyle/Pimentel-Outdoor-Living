'use client';

import Image from 'next/image';
import { FormEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import { business, copy, faqs, formOptions, imageAlts, instagramItems, Lang, nav, portfolio, processSteps, reviews, services } from './content';

const HERO_MEDIA = {
  desktop: '/video/hero-outdoor-living-desktop.mp4',
  mobile: '/video/hero-outdoor-living-mobile.mp4',
  desktopPoster: '/images/hero-video-desktop-poster.webp',
  mobilePoster: '/images/hero-video-mobile-poster.webp',
};

function HeroMedia() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const requestPlayback = () => {
      const video = videoRef.current;
      if (!video || reducedMotion) return;
      video.muted = true;
      void video.play().catch(() => undefined);
    };
    requestPlayback();
    const resumeWhenVisible = () => document.visibilityState === 'visible' && requestPlayback();
    document.addEventListener('visibilitychange', resumeWhenVisible);
    window.addEventListener('pageshow', requestPlayback);
    window.addEventListener('pointerdown', requestPlayback, { once: true });
    window.addEventListener('keydown', requestPlayback, { once: true });
    return () => {
      document.removeEventListener('visibilitychange', resumeWhenVisible);
      window.removeEventListener('pageshow', requestPlayback);
      window.removeEventListener('pointerdown', requestPlayback);
      window.removeEventListener('keydown', requestPlayback);
    };
  }, [reducedMotion]);

  const handleVideoReady = () => {
    setVideoReady(true);
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  };

  const firstFrame = (
    <div className="hero-media hero-fallback" aria-hidden="true">
      <Image className="hero-fallback-desktop" src={HERO_MEDIA.desktopPoster} alt="" fill priority sizes="100vw" />
      <Image className="hero-fallback-mobile" src={HERO_MEDIA.mobilePoster} alt="" fill priority sizes="100vw" />
    </div>
  );

  if (HERO_MEDIA.desktop && !reducedMotion) {
    return <>{firstFrame}
      <video ref={videoRef} className={`hero-media hero-video ${videoReady ? 'is-ready' : ''}`} autoPlay muted loop playsInline preload="auto" onLoadedData={handleVideoReady} onCanPlay={handleVideoReady} onError={() => setVideoReady(false)} aria-hidden="true" tabIndex={-1}>
        {HERO_MEDIA.mobile && <source src={HERO_MEDIA.mobile} media="(max-width: 700px)" type="video/mp4" />}
        <source src={HERO_MEDIA.desktop} type="video/mp4" />
      </video>
    </>;
  }

  return firstFrame;
}

function LanguageControl({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const c = copy[lang];
  return (
    <div className="language" aria-label={c.languageSelector}>
      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button>
      <span aria-hidden="true">/</span>
      <button className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')} aria-pressed={lang === 'es'}>ES</button>
    </div>
  );
}

function Wordmark({ lang }: { lang: Lang }) {
  return (
    <a className="wordmark" href="#top" aria-label={copy[lang].homeLabel}>
      <Image className="brand-logo" src="/images/pimentel-logo-transparent.png" alt="" width={1254} height={1254} priority />
    </a>
  );
}

function Header({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const c = copy[lang];
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeButton.current?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          <Wordmark lang={lang} />
          <nav className="desktop-nav" aria-label={c.primaryNavigation}>
            {nav[lang].map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <div className="header-actions">
            <LanguageControl lang={lang} setLang={setLang} />
            <a className="phone-short" href={business.phoneHref} aria-label={`${c.call} ${business.phoneDisplay}`}>{c.call}</a>
            <a className="header-cta" href="#start">{c.start}</a>
            <button className="menu-button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu"><span>{c.menu}</span><i aria-hidden="true" /></button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu-top"><Wordmark lang={lang} /><button ref={closeButton} onClick={() => setOpen(false)}>{c.close} <span aria-hidden="true">×</span></button></div>
        <nav aria-label={c.mobileNavigation}>
          {nav[lang].map((item, index) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</a>)}
        </nav>
        <div className="mobile-menu-bottom"><LanguageControl lang={lang} setLang={setLang} /><a href={business.phoneHref}>{business.phoneDisplay}</a><a className="button button-light" href="#start" onClick={() => setOpen(false)}>{c.start}</a></div>
      </div>
    </>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="hero" id="top">
      <HeroMedia /><div className="hero-shade" />
      <div className="hero-content page-shell">
        <p className="eyebrow hero-enter enter-1">{c.heroEyebrow}</p>
        <h1 className="hero-title"><span className="hero-enter enter-2">{c.heroTitleA}</span><em className="hero-enter enter-3">{c.heroTitleB}</em></h1>
        <p className="hero-copy hero-enter enter-4">{c.heroBody}</p>
        <div className="hero-actions hero-enter enter-5"><a className="button button-light" href="#start">{c.start}</a><a className="arrow-link" href="#work">{c.explore}<span aria-hidden="true">↘</span></a></div>
      </div>
      <div className="hero-bottom page-shell"><span>{business.area}</span><a href="#intro">{c.scrollDiscover} <i aria-hidden="true">↓</i></a></div>
    </section>
  );
}

function TrustStrip({ lang }: { lang: Lang }) {
  return <div className="trust-strip" aria-label={copy[lang].businessCredentials}><div className="trust-track">{[...copy[lang].trust, ...copy[lang].trust].map((item, index) => <span key={`${item}-${index}`}><i aria-hidden="true" />{item}</span>)}</div></div>;
}

function Intro({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="intro section" id="intro">
      <div className="page-shell intro-grid">
        <div className="section-heading reveal"><p className="eyebrow dark">{c.introEyebrow}</p><h2>{c.introTitle}</h2></div>
        <div className="intro-aside reveal"><p>{c.introBody}</p><div className="proof"><strong>4.4</strong><span>Google<br />{c.reviewCount}</span></div></div>
      </div>
      <div className="intro-image reveal"><Image src="/images/wide-turf-installation.webp" alt={imageAlts.introduction[lang]} fill sizes="100vw" /></div>
    </section>
  );
}

function Lightbox({ index, lang, onClose, onMove }: { index: number; lang: Lang; onClose: () => void; onMove: (delta: number) => void }) {
  const item = portfolio[index];
  const c = copy[lang];
  const startX = useRef(0);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onMove(1);
      if (event.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose, onMove]);
  const touchStart = (event: TouchEvent) => { startX.current = event.touches[0].clientX; };
  const touchEnd = (event: TouchEvent) => { const distance = event.changedTouches[0].clientX - startX.current; if (Math.abs(distance) > 45) onMove(distance > 0 ? -1 : 1); };
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item[lang]} onTouchStart={touchStart} onTouchEnd={touchEnd}>
      <button className="lightbox-close" onClick={onClose} autoFocus aria-label={c.closeGallery}>×</button>
      <button className="lightbox-prev" onClick={() => onMove(-1)} aria-label={c.previousImage}>←</button>
      <div className="lightbox-image"><Image src={item.src} alt={item[lang]} fill sizes="100vw" priority /></div>
      <button className="lightbox-next" onClick={() => onMove(1)} aria-label={c.nextImage}>→</button>
      <div className="lightbox-caption"><span>{String(index + 1).padStart(2, '0')} / {portfolio.length}</span></div>
    </div>
  );
}

function Portfolio({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<number | null>(null);
  const c = copy[lang];
  const move = (delta: number) => setActive(current => current === null ? 0 : (current + delta + portfolio.length) % portfolio.length);
  const projectCard = (item: (typeof portfolio)[number], index: number) => (
    <button className="project-card reveal" key={item.src} onClick={() => setActive(index)} aria-label={`${c.viewProject}: ${item[lang]}`}>
      <Image src={item.src} alt={item[lang]} fill sizes="(max-width: 520px) 92vw, (max-width: 800px) 46vw, 33vw" />
    </button>
  );
  return (
    <section className="work section" id="work">
      <div className="page-shell work-heading reveal"><div><p className="eyebrow dark">{c.workEyebrow}</p><h2>{c.workTitle}</h2></div><p>{c.workBody}</p></div>
      <div className="portfolio-grid page-shell">
        {portfolio.map((item, index) => projectCard(item, index))}
      </div>
      {active !== null && <Lightbox index={active} lang={lang} onClose={() => setActive(null)} onMove={move} />}
    </section>
  );
}

function Services({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="services section" id="services"><div className="page-shell">
      <div className="services-heading reveal"><p className="eyebrow">{c.servicesEyebrow}</p><h2>{c.servicesTitle}</h2></div>
      <div className="service-list">{services.map((service, index) => <article className="service-row reveal" key={service.en[0]}><span>0{index + 1}</span><h3>{service[lang][0]}</h3><p>{service[lang][1]}</p><div className="service-image"><Image src={service.image} alt="" fill sizes="280px" /></div></article>)}</div>
    </div></section>
  );
}

function FeaturedProject({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="feature section"><div className="page-shell feature-grid">
      <div className="feature-copy reveal"><p className="eyebrow dark">{c.featureEyebrow}</p><h2>{c.featureTitle}</h2><p>{c.featureBody}</p><div className="tags">{c.featureTags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      <div className="feature-image feature-main reveal"><Image src="/images/front-yard-composition.webp" alt={imageAlts.featureMain[lang]} fill sizes="(max-width: 800px) 100vw, 52vw" /></div>
      <div className="feature-image feature-detail reveal"><Image src="/images/stepping-stone-path.webp" alt={imageAlts.featureDetail[lang]} fill sizes="(max-width: 800px) 70vw, 28vw" /></div>
      <div className="feature-note reveal"><span>{c.connectedDetails}</span><p>{c.featureLocations}</p></div>
    </div></section>
  );
}

function NightShowcase({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="night section"><div className="night-glow" />
      <div className="page-shell night-heading reveal"><p className="eyebrow">{c.nightEyebrow}</p><h2>{c.nightTitleA}<em>{c.nightTitleB}</em></h2><p>{c.nightBody}</p></div>
      <div className="page-shell night-gallery">
        <div className="night-image night-wide reveal"><Image src="/images/illuminated-backyard.webp" alt={imageAlts.nightWide[lang]} fill sizes="(max-width: 800px) 94vw, 62vw" /></div>
        <div className="night-image night-tall reveal"><Image src="/images/illuminated-walkway.webp" alt={imageAlts.nightTall[lang]} fill sizes="(max-width: 800px) 72vw, 28vw" /></div>
        <div className="night-index"><span>{c.afterDark}</span><i /></div>
      </div>
    </section>
  );
}

function SocialReels({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<string | null>(null);
  const c = copy[lang];
  return (
    <section className="social section" id="social"><div className="page-shell social-heading reveal"><div><p className="eyebrow dark">{c.socialEyebrow}</p><h2>{c.socialTitle}</h2></div><p>{c.socialBody}</p></div>
      <div className="reel-track">{instagramItems.map((item, index) => <article className="reel-card reveal" key={item.id}>
        {active === item.id ? <iframe src={item.embed} title={`${c.watchInstagram} ${item.title[lang]} ${c.instagramPlatform}`} loading="lazy" allow="encrypted-media; picture-in-picture" /> : <><Image src={item.image} alt="" fill sizes="(max-width: 700px) 78vw, 340px" /><div className="reel-shade" /><button onClick={() => setActive(item.id)} aria-label={`${c.watchInstagram} ${item.title[lang]} ${c.instagramPlatform}`}><span>Play</span></button></>}
        <div className="reel-meta"><span>0{index + 1} · Instagram</span><h3>{item.title[lang]}</h3><p>{item.description[lang]}</p><a href={item.url} target="_blank" rel="noopener noreferrer">{c.openInstagram} ↗</a></div>
      </article>)}</div>
      <div className="page-shell follow-row"><a href={business.instagram} target="_blank" rel="noopener noreferrer">{c.follow}<span aria-hidden="true">↗</span></a></div>
    </section>
  );
}

function Process({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return <section className="process section" id="process"><div className="page-shell"><div className="process-heading reveal"><p className="eyebrow dark">{c.processEyebrow}</p><h2>{c.processTitle}</h2></div><ol>{processSteps[lang].map((step, index) => <li className="reveal" key={step[0]}><span>0{index + 1}</span><h3>{step[0]}</h3><p>{step[1]}</p></li>)}</ol></div></section>;
}

function Reviews({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return <section className="reviews section" id="reviews"><div className="page-shell"><div className="reviews-heading reveal"><div><p className="eyebrow">{c.reviewsEyebrow}</p><h2>{c.reviewsTitle}</h2></div><span>{c.rating}</span></div><div className="review-layout"><blockquote className="review-feature reveal" lang="en"><span>“</span><p>{reviews[0].quote}</p><cite>{reviews[0].name} · {c.googleReview}</cite></blockquote><div className="review-support">{reviews.slice(1).map(review => <blockquote className="reveal" key={review.name} lang="en"><p>“{review.quote}”</p><cite>{review.name} · {c.googleReview}</cite></blockquote>)}</div></div></div></section>;
}

function AboutArea({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <>
      <section className="about section" id="about"><div className="page-shell about-grid"><div className="about-image reveal"><Image src="/images/pimentel-crew.webp" alt={imageAlts.crew[lang]} fill sizes="(max-width: 800px) 100vw, 46vw" /><div className="about-brand-card"><Image src="/images/pimentel-logo-transparent.png" alt="" width={1254} height={1254} /></div></div><div className="about-copy reveal"><p className="eyebrow dark">{c.aboutEyebrow}</p><h2>{c.aboutTitle}</h2><p>{c.aboutBody}</p><div className="about-facts"><span>{business.license}</span><span>{business.area}</span><span>Se Habla Español</span></div></div></div></section>
      <section className="area"><div className="page-shell area-grid"><div className="area-title reveal"><p className="eyebrow">{c.areaEyebrow}</p><h2>{c.areaTitle}</h2></div><div className="area-copy reveal"><p>{c.areaBody}</p><div><a className="button button-light area-call" href={business.phoneHref}><span>{c.call} {business.phoneDisplay}</span></a><a className="arrow-link" href={business.maps} target="_blank" rel="noopener noreferrer">{c.viewMap}<span>↗</span></a></div></div></div><div className="page-shell service-map reveal"><iframe title={c.mapTitle} src="https://www.google.com/maps?q=Bakersfield%2C+CA&amp;z=8&amp;output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section>
    </>
  );
}

type PreviewFile = { file: File; url: string };

function ProjectForm({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const filesRef = useRef<PreviewFile[]>([]);
  const [status, setStatus] = useState('');
  const [fileError, setFileError] = useState('');
  useEffect(() => { filesRef.current = files; }, [files]);
  useEffect(() => () => filesRef.current.forEach(item => URL.revokeObjectURL(item.url)), []);

  const chooseFiles = (selected: FileList | null) => {
    if (!selected) return;
    const incoming = Array.from(selected);
    const valid = incoming.filter(file => file.type.startsWith('image/') && file.size <= 8 * 1024 * 1024);
    if (valid.length !== incoming.length || files.length + valid.length > 6) setFileError(c.fileError); else setFileError('');
    const accepted = valid.slice(0, Math.max(0, 6 - files.length)).map(file => ({ file, url: URL.createObjectURL(file) }));
    setFiles(current => [...current, ...accepted]);
  };
  const removeFile = (index: number) => setFiles(current => { URL.revokeObjectURL(current[index].url); return current.filter((_, itemIndex) => itemIndex !== index); });
  // TODO: Add the production Formspree endpoint and test delivery before launch.
  const handlePrototypeSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (event.currentTarget.reportValidity()) setStatus(c.prototypeNotice); };

  return (
    <section className="project-form section" id="start"><div className="page-shell form-grid">
      <div className="form-intro reveal"><p className="eyebrow">{c.formEyebrow}</p><h2>{c.formTitle}</h2><p>{c.formBody}</p><div className="form-contact-links"><a href={business.phoneHref}>{business.phoneDisplay}<span>{c.call} ↗</span></a><a href={business.emailHref}>{business.email}<span>{c.email} ↗</span></a><div className="form-hours"><strong>{c.hoursValue}</strong><span>{c.hoursLabel}</span></div></div></div>
      <form className="reveal" onSubmit={handlePrototypeSubmit} noValidate={false}>
        <div className="field-row"><label><span>{c.fullName} <i>{c.required}</i></span><input name="fullName" autoComplete="name" required /></label><label><span>{c.phone} <i>{c.required}</i></span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required /></label></div>
        <div className="field-row"><label><span>{c.email}</span><input name="email" type="email" inputMode="email" autoComplete="email" /></label><label><span>{c.city} <i>{c.required}</i></span><input name="city" autoComplete="postal-code" required /></label></div>
        <div className="field-row"><label><span>{c.projectType} <i>{c.required}</i></span><select name="projectType" required defaultValue=""><option value="" disabled>—</option>{formOptions.type[lang].map(option => <option key={option}>{option}</option>)}</select></label><label><span>{c.timing}</span><select name="timing" defaultValue=""><option value="">—</option>{formOptions.timing[lang].map(option => <option key={option}>{option}</option>)}</select></label></div>
        <fieldset><legend>{c.contact}</legend><div className="radio-row">{formOptions.contact[lang].map((option, index) => <label key={option}><input type="radio" name="contact" value={option} defaultChecked={index === 1} /><span>{option}</span></label>)}</div></fieldset>
        <label className="details-field"><span>{c.details} <i>{c.required}</i></span><textarea name="details" required rows={5} placeholder={c.detailsPlaceholder} /></label>
        <div className="upload-field"><div><span>{c.photos}</span><small id="project-photo-help">{c.photoHelp}</small></div><label className="upload-button"><input type="file" accept="image/jpeg,image/png,image/webp" multiple aria-describedby={fileError ? 'project-photo-help project-photo-error' : 'project-photo-help'} aria-invalid={Boolean(fileError)} onChange={event => { chooseFiles(event.target.files); event.target.value = ''; }} /><span>{c.choosePhotos} +</span></label></div>
        {fileError && <p className="file-error" id="project-photo-error" role="alert">{fileError}</p>}
        {files.length > 0 && <div className="photo-previews">{files.map((item, index) => <div key={`${item.file.name}-${index}`}><Image src={item.url} alt={`${c.photos} ${index + 1}: ${item.file.name}`} fill unoptimized /><button type="button" onClick={() => removeFile(index)} aria-label={`${c.remove} ${item.file.name}`}>×</button></div>)}</div>}
        <div className="submit-row"><button className="button button-dark" type="submit">{c.send}<span>↗</span></button><p>{c.prototypeLine}</p></div>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>
    </div></section>
  );
}

function Faq({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return <section className="faq section" id="faq"><div className="page-shell faq-grid"><div className="reveal"><p className="eyebrow dark">{c.faqEyebrow}</p><h2>{c.faqTitle}</h2></div><div className="faq-list">{faqs[lang].map(item => <details className="reveal" key={item[0]}><summary>{item[0]}<span>+</span></summary><p>{item[1]}</p></details>)}</div></div></section>;
}

function Footer({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return <footer><div className="page-shell footer-top"><Wordmark lang={lang} /><p>{c.footerLine}</p><a href={business.phoneHref}>{business.phoneDisplay}</a></div><div className="page-shell footer-middle"><p>{c.footerStatementA}<br /><em>{c.footerStatementB}</em></p><a className="footer-cta" href="#start">{c.start}<span>↗</span></a></div><div className="page-shell footer-bottom"><div><span>{business.license}</span><span>{business.area}</span><span>{c.hoursLabel}: {c.hoursValue}</span><span>{c.languageLine}</span></div><div><a href={business.emailHref}>{c.email} ↗</a><a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={business.facebook} target="_blank" rel="noopener noreferrer">Facebook ↗</a></div><span>© {new Date().getFullYear()} Pimentel Outdoor Living</span></div></footer>;
}

function MobileDock({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const update = () => { const form = document.getElementById('start'); const nearForm = form ? form.getBoundingClientRect().top < window.innerHeight * .88 : false; setShow(window.scrollY > window.innerHeight * .75 && !nearForm); };
    update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update);
  }, []);
  return <div className={`mobile-dock ${show ? 'is-visible' : ''}`}><a href={business.phoneHref}>{copy[lang].call}</a><a href="#start">{copy[lang].start}</a></div>;
}

export default function PimentelSite() {
  const [lang, setLangState] = useState<Lang>('en');
  const setLang = (next: Lang) => { setLangState(next); localStorage.setItem('pimentel-lang', next); document.documentElement.lang = next; };
  useEffect(() => {
    const saved = localStorage.getItem('pimentel-lang');
    if (saved !== 'en' && saved !== 'es') return;
    const frame = window.requestAnimationFrame(() => setLang(saved));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    const observeAll = () => document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    observeAll(); const timer = window.setTimeout(observeAll, 300);
    return () => { window.clearTimeout(timer); observer.disconnect(); };
  }, [lang]);
  return <><Header lang={lang} setLang={setLang} /><main><Hero lang={lang} /><TrustStrip lang={lang} /><Intro lang={lang} /><Portfolio lang={lang} /><Services lang={lang} /><FeaturedProject lang={lang} /><NightShowcase lang={lang} /><SocialReels lang={lang} /><Process lang={lang} /><Reviews lang={lang} /><AboutArea lang={lang} /><ProjectForm lang={lang} /><Faq lang={lang} /></main><Footer lang={lang} /><MobileDock lang={lang} /></>;
}
