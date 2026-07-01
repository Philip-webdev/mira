import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ProfessionalSlider from "@/components/ProfessionalSlider";
import '../index.css';
import { GetStartedButton, BookDemoButton} from "./Admissionmodal";
import { AlertTriangle, ArrowDown, ArrowRight, BarChart3, Bell, BookOpen, Building2, CheckCircle, Clock, CreditCard, EyeOff, FileWarning, GraduationCap, Hourglass, Layers, Play, Receipt, ReceiptText, School, Shield, Sparkles, TrendingDown, TrendingUp, Users, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
const Index = () => {
  const TIERS = [
  {
    icon: <BookOpen size={28} />,
    name: "Primary & Secondary",
    desc: "Government & private basic schools managing term levies, PTA fees, and result collection.",
    price: 0,
    highlight: false,
    features: [
      "Term & session billing cycles",
      "PTA fee collection",
      "Basic analytics dashboard",
    ],
  },
  {
    icon: <School size={28} />,
    name: "High Schools",
    desc: "Senior secondary schools handling WAEC fees, acceptance, and hostel payments with ease.",
    price: 0,
    highlight: true,
    features: [
      "Basic analytics dashboard",
      "New levy integration",
      "Hostel & boarding payments"
    
    ],
  },
  {
    icon: <GraduationCap size={28} />,
    name: "Colleges & Universities",
    desc: "Higher institutions processing tuition, accommodation, and departmental fees at scale.",
    price:0,
    highlight: false,
    features: [
      "Multi-campus management",
      "Bursary workflow automation",
      "Dedicated account manager",
    ],
  },
];
  return (
    <div className="min-h-screen justify-evenly" style={{fontFamily: 'Geom', backgroundColor: 'rgb(95, 103, 172)'}}>
          <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sage:   rgb(95, 103, 172);
          --sage-d: rgb(178,182,214);
          --ink:    rgb(24, 11, 40);
          --leaf:   rgb(24, 11, 40);
          --lime:   rgb(95, 103, 172);
          --cream:  #f8f5ee;
          --warm:   #e8e0d0;
          --gold:   #d4a843;
          --red:    #e05c3a;
          --white:  #ffffff;
          --glass:  rgba(255,255,255,0.12);
          --r: 16px;
        }

        body { font-family: 'Sora', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 6%; height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all .4s;
        }
        .nav.scrolled {
          background: rgba(248,245,238,0.96);
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 rgba(0,0,0,.08);
        }
        .nav-logo { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.5rem; color: var(--leaf); letter-spacing: -1px; }
        .nav-logo span { color: var(--lime); }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { font-size: .9rem; font-weight: 500; color: var(--ink); text-decoration: none; opacity: .75; transition: opacity .2s; }
        .nav-links a:hover { opacity: 1; }
        .nav-cta { display: flex; gap: .75rem; align-items: center; }
        .btn-ghost { padding: .5rem 1.25rem; border-radius: 99px; border: 1.5px solid var(--leaf); background: transparent; color: var(--leaf); font-weight: 600; font-size: .88rem; cursor: pointer; transition: all .2s; font-family: inherit; }
        .btn-ghost:hover { background: var(--leaf); color: #fff; }
        .btn-solid { padding: .55rem 1.4rem; border-radius: 99px; border: none; background: var(--leaf); color: #fff; font-weight: 600; font-size: .88rem; cursor: pointer; transition: all .2s; font-family: inherit; }
        .btn-solid:hover { background: var(--lime); color: var(--ink); transform: translateY(-1px); }
        .hamburger { display: none; background: none; border: none; cursor: pointer; color: var(--ink); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          background: var(--sage);
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
          align-items: center; padding: 120px 8% 80px;
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; top: -20%; right: -10%;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(95,103,172,.3) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero::after {
          content: ''; position: absolute; bottom: -15%; left: 5%;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(24,11,40,.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .35rem 1rem; border-radius: 99px;
          background: rgba(45,106,79,.12); border: 1px solid rgba(45,106,79,.2);
          font-size: .8rem; font-weight: 600; color: var(--leaf); letter-spacing: .05em;
          text-transform: uppercase; margin-bottom: 1.5rem;
          animation: fadeUp .8s ease both;
        }
        .hero-eyebrow span { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); display: inline-block; animation: pulse 1.5s infinite; }
        .hero-h1 {
          font-family: 'Sora', sans-serif; font-weight: 800;
          font-size: clamp(2.6rem, 5vw, 4.2rem); line-height: 1.08; color: var(--ink);
          letter-spacing: -2px; margin-bottom: 1.5rem;
          animation: fadeUp .8s .15s ease both;
        }
        .hero-h1 em { color: var(--leaf); font-style: normal; }
        .hero-sub {
          font-size: 1.1rem; color: #3a4a3c; line-height: 1.7; max-width: 480px;
          margin-bottom: 2.5rem;
          animation: fadeUp .8s .28s ease both;
        }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; animation: fadeUp .8s .4s ease both; }
        .btn-hero-primary {
          padding: .9rem 2rem; border-radius: 99px; border: none;
          background: var(--ink); color: #fff;
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1rem;
          cursor: pointer; display: flex; align-items: center; gap: .5rem;
          transition: all .25s; position: relative; overflow: hidden;
        }
        .btn-hero-primary::before {
          content: ''; position: absolute; inset: 0;
          background: var(--lime); transform: scaleX(0); transform-origin: left;
          transition: transform .3s; z-index: 0;
        }
        .btn-hero-primary:hover::before { transform: scaleX(1); }
        .btn-hero-primary span, .btn-hero-primary svg { position: relative; z-index: 1; }
        .btn-hero-primary:hover { color: var(--ink); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.18); }
        .btn-hero-demo {
          padding: .9rem 1.8rem; border-radius: 99px;
          border: 2px solid rgba(45,106,79,.4); background: rgba(255,255,255,.5);
          backdrop-filter: blur(8px); color: var(--ink);
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1rem;
          cursor: pointer; display: flex; align-items: center; gap: .5rem; transition: all .25s;
        }
        .btn-hero-demo:hover { background: #fff; border-color: var(--leaf); transform: translateY(-2px); }

        /* counter card */
        .counter-wrap { position: relative; display: inline-block; }
        .counter-card {
          position: absolute; bottom: -16px; right: -24px;
          background: #fff; border-radius: 16px;
          padding: 1rem 1.4rem; box-shadow: 0 16px 48px rgba(0,0,0,.14);
          min-width: 210px; z-index: 10;
          animation: fadeUp .8s .6s ease both;
        }
        .cc-dot-row { display: flex; align-items: center; gap: .5rem; margin-bottom: .4rem; }
        .cc-dot { width: 10px; height: 10px; border-radius: 50%; background: rgb(24, 11, 40); position: relative; }
        .cc-dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: rgba(95,103,172,.25); animation: pulse 1.5s infinite; }
        .cc-dot-label { font-size: .72rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
        .cc-amount { font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--ink); letter-spacing: -1px; line-height: 1; }
        .cc-badge { margin-top: .35rem; font-size: .75rem; font-weight: 700; color: rgb(24, 11, 40); display: flex; align-items: center; gap: .25rem; }

        /* hero image */
        .hero-img-wrap { position: relative; display: flex; justify-content: center; align-items: center; animation: fadeUp .8s .2s ease both; }
        .hero-img { max-width: 520px; width: 100%; filter: drop-shadow(0 24px 48px rgba(0,0,0,.15)); animation: float 5s ease-in-out infinite; }

        /* ── MARQUEE ── */
        .marquee-section { background: #fff; border-top: 1px solid rgba(0,0,0,.07); border-bottom: 1px solid rgba(0,0,0,.07); padding: 1.5rem 0; overflow: hidden; }
        .marquee-label { text-align: center; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #9ca3af; margin-bottom: 1.2rem; }
        .marquee-track { display: flex; width: max-content; animation: scrollLeft 24s linear infinite; }
        .marquee-item { padding: 0 3rem; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1rem; color: #9ca3af; white-space: nowrap; transition: color .2s; letter-spacing: -.5px; }
        .marquee-item:hover { color: var(--leaf); }
        .marquee-sep { color: var(--sage-d); opacity: .5; }

        /* ── STORY SECTION ── */
        .story { padding: 8rem 8%; background: var(--cream); }
        .section-eyebrow { font-size: .75rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: rgb(95, 103, 172); margin-bottom: 1rem; }
        .section-h2 {  font-weight: 800; font-size: clamp(2rem, 4vw, 3.2rem); letter-spacing: -1.5px; color: var(--ink); line-height: 1.1; margin-bottom: 1.5rem; }
        .section-h2 em { color: rgb(95, 103, 172); font-style: normal; }
        .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
        .story-text p { font-size: 1.05rem; color: #4a5a4c; line-height: 1.8; margin-bottom: 1.25rem; }
        .story-text strong { color: var(--ink); }
        .story-features { display: flex; flex-direction: column; gap: .85rem; margin-top: 2rem; }
        .story-feat { display: flex; align-items: flex-start; gap: .75rem; }
        .story-feat-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(95,103,172,.1); display: flex; align-items: center; justify-content: center; color: var(--leaf); flex-shrink: 0; }
        .story-feat-text strong { display: block; font-weight: 600; font-size: .92rem; color: var(--ink); margin-bottom: .2rem; }
        .story-feat-text span { font-size: .85rem; color: #6b7280; }

        /* ── STATS ── */
        .stats-section { background: var(--leaf); padding: 5rem 8%; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .stat-card { text-align: center; padding: 2rem 1rem; border-radius: var(--r); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); }
        .stat-number { font-family: 'Sora', sans-serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 800; color: #fff; letter-spacing: -2px; margin-bottom: .35rem; }
        .stat-label { font-size: .85rem; color: rgba(255,255,255,.65); font-weight: 500; }

        /* ── DASHBOARD ── */
        .dashboard-section { padding: 8rem 8%; background: rgb(24,11,40); position: relative; overflow: hidden; }
        .dashboard-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--lime), transparent); }
        .db-header { max-width: 620px; margin-bottom: 4rem; }
        .db-header .section-eyebrow { color: rgb(95, 103, 172); }
        .db-header .section-h2 { color: #fff; }
        .db-header p { font-size: 1.05rem; color: rgba(255,255,255,.6); line-height: 1.8; }
        .db-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: center; }
        .db-features { display: flex; flex-direction: column; gap: 1.5rem; }
        .db-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        @media (max-width: 768px) { .db-features-grid { grid-template-columns: 1fr; } }
        .db-feature { display: flex; gap: 1rem; align-items: flex-start; padding: 1.25rem; border-radius: 14px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); transition: all .25s; cursor: default; }
        .db-feature:hover { background: rgba(95,103,172,.07); border-color: rgba(95,103,172,.2); }
        .db-feat-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(95,103,172,.16); display: flex; align-items: center; justify-content: center; color: rgb(95, 103, 172); flex-shrink: 0; }
        .db-feat-text strong { display: block; font-weight: 700; font-size: .95rem; color: #fff; margin-bottom: .3rem; }
        .db-feat-text span { font-size: .85rem; color: rgba(255,255,255,.5); line-height: 1.6; }

        /* dashboard mock */
        .dashboard-mock {
          background: #1a2620; border-radius: 20px;
          border: 1px solid rgba(255,255,255,.1);
          overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,.5);
          font-size: .75rem;
        }
        .db-topbar { background: #111a14; padding: .75rem 1rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.07); }
        .db-logo-pill { font-family: 'Sora', sans-serif; font-weight: 700; font-size: .8rem; color: var(--lime); }
        .db-logo-pill span { color: rgba(255,255,255,.5); font-weight: 400; }
        .db-dots { display: flex; gap: .35rem; }
        .db-dots span { width: 10px; height: 10px; border-radius: 50%; }
        .db-dots span:nth-child(1) { background: #ef4444; }
        .db-dots span:nth-child(2) { background: #f59e0b; }
        .db-dots span:nth-child(3) { background: rgb(24, 11, 40); }
        .db-body { display: grid; grid-template-columns: 90px 1fr; }
        .db-sidebar { background: #131d16; padding: .75rem .5rem; border-right: 1px solid rgba(255,255,255,.07); }
        .db-nav-item { padding: .5rem .6rem; border-radius: 8px; color: rgba(255,255,255,.4); font-weight: 500; margin-bottom: .2rem; cursor: default; transition: all .2s; font-size: .7rem; }
        .db-nav-item.active { background: rgba(95,103,172,.15); color: var(--lime); }
        .db-main { padding: .9rem; display: flex; flex-direction: column; gap: .75rem; }
        .db-cards-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; }
        .db-mini-card { background: rgba(255,255,255,.04); border-radius: 10px; padding: .6rem .7rem; border: 1px solid rgba(255,255,255,.06); }
        .db-mini-label { font-size: .6rem; color: rgba(255,255,255,.4); margin-bottom: .25rem; }
        .db-mini-val { font-family: 'Sora', sans-serif; font-weight: 700; font-size: .9rem; color: #fff; }
        .db-mini-badge { font-size: .58rem; font-weight: 700; margin-top: .2rem; }
        .db-mini-badge.up { color: rgb(24, 11, 40); }
        .db-mini-badge.down { color: #ef4444; }
        .db-chart-area { background: rgba(255,255,255,.03); border-radius: 10px; padding: .7rem; border: 1px solid rgba(255,255,255,.06); }
        .db-chart-title { font-size: .65rem; font-weight: 700; color: rgba(255,255,255,.5); margin-bottom: .5rem; }
        .db-bars { display: flex; align-items: flex-end; gap: 3px; height: 60px; }
        .db-bar-wrap { flex: 1; height: 100%; display: flex; align-items: flex-end; }
        .db-bar { width: 100%; background: linear-gradient(to top, var(--lime), rgba(95,103,172,.3)); border-radius: 3px 3px 0 0; animation: growBar .8s ease both; }
        @keyframes growBar { from { height: 0 !important; } }
        .db-recent { }
        .db-recent-title { font-size: .65rem; font-weight: 700; color: rgba(255,255,255,.5); margin-bottom: .4rem; }
        .db-tx-row { display: flex; align-items: center; gap: .5rem; padding: .35rem 0; border-bottom: 1px solid rgba(255,255,255,.05); }
        .db-tx-avatar { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg, var(--leaf), var(--lime)); display: flex; align-items: center; justify-content: center; font-size: .55rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .db-tx-name { flex: 1; color: rgba(255,255,255,.7); font-size: .65rem; }
        .db-tx-amt { font-family: 'Sora', sans-serif; font-weight: 700; font-size: .7rem; color: #fff; }
        .db-tx-status { font-size: .55rem; font-weight: 700; padding: .15rem .45rem; border-radius: 99px; margin-left: .3rem; }
        .db-tx-status.paid { background: rgba(95,103,172,.15); color: rgb(24, 11, 40); }
        .db-tx-status.pending { background: rgba(245,158,11,.15); color: #f59e0b; }

        /* ── PRICING ── */
        .pricing-section { padding: 8rem 8%; background: var(--cream); }
        .pricing-header { text-align: center; max-width: 640px; margin: 0 auto 4rem; }
        .free-badge { display: inline-block; padding: .4rem 1.2rem; border-radius: 99px; background: linear-gradient(135deg, var(--lime), var(--leaf)); color: #fff; font-size: .8rem; font-weight: 700; letter-spacing: .05em; margin-bottom: 1.25rem; box-shadow: 0 4px 16px rgba(95,103,172,.35); }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .pricing-card {
          background: #fff; border-radius: 20px; padding: 2.5rem 2rem;
          border: 2px solid transparent; transition: all .3s;
          position: relative; overflow: hidden;
        }
        .pricing-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--sage), var(--leaf)); }
        .pricing-card:hover { transform: translateY(-6px); border-color: var(--sage-d); box-shadow: 0 24px 60px rgba(0,0,0,.1); }
        .pricing-card.featured { background: var(--ink); border-color: var(--lime); }
        .pricing-card.featured::before { background: linear-gradient(90deg, var(--lime), var(--leaf)); }
        .featured-tag { position: absolute; top: 1.2rem; right: 1.2rem; background: var(--lime); color: var(--ink); font-size: .65rem; font-weight: 800; padding: .25rem .7rem; border-radius: 99px; letter-spacing: .05em; text-transform: uppercase; }
        .tier-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
        .pricing-card:not(.featured) .tier-icon { background: rgba(95,103,172,.1); color: var(--leaf); }
        .pricing-card.featured .tier-icon { background: rgba(95,103,172,.15); color: var(--lime); }
        .tier-name {  font-weight: 800; font-size: 1.15rem; color: var(--ink); margin-bottom: .5rem; }
        .pricing-card.featured .tier-name { color: #fff; }
        .tier-desc { font-size: .85rem; color: #6b7280; line-height: 1.6; margin-bottom: 1.75rem; }
        .pricing-card.featured .tier-desc { color: rgba(255,255,255,.55); }
        .price-row { display: flex; align-items: baseline; gap: .3rem; margin-bottom: .35rem; }
        .price-currency { font-size: 1.1rem; font-weight: 700; color: var(--leaf); }
        .price-amount {   font-size: 3rem; font-weight: 800; color: var(--ink); letter-spacing: -2px; line-height: 1; }
        .pricing-card.featured .price-amount { color: #fff; }
        .pricing-card.featured .price-currency { color: var(--lime); }
        .price-period { font-size: .85rem; color: #9ca3af; }
        .price-note { font-size: .78rem; color: var(--lime); font-weight: 600; margin-bottom: 1.75rem; }
        .tier-features { list-style: none; display: flex; flex-direction: column; gap: .7rem; margin-bottom: 2rem; }
        .tier-features li { display: flex; align-items: flex-start; gap: .6rem; font-size: .87rem; color: #4a5a4c; }
        .pricing-card.featured .tier-features li { color: rgba(255,255,255,.7); }
        .tier-features li svg { flex-shrink: 0; margin-top: 1px; }
        .pricing-card:not(.featured) .tier-features li svg { color: var(--leaf); }
        .pricing-card.featured .tier-features li svg { color: var(--lime); }
        .btn-tier {
          width: 100%; padding: .9rem; border-radius: 12px; border: none;
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: .95rem;
          cursor: pointer; transition: all .25s;
        }
        .btn-tier-default { background: var(--sage); color: var(--ink); }
        .btn-tier-default:hover { background: var(--sage-d); transform: translateY(-2px); }
        .btn-tier-featured { background: linear-gradient(135deg, var(--lime), rgb(60,66,120)); color: var(--ink); }
        .btn-tier-featured:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(95,103,172,.4); }

        /* free trial banner */
        .trial-banner {
          margin-top: 3rem; padding: 2.5rem 3rem;
          background: linear-gradient(135deg, var(--leaf), rgb(45,40,80));
          border-radius: 20px; display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
        }
        .trial-text strong { display: block; font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: .35rem; }
        .trial-text span { font-size: .95rem; color: rgba(255,255,255,.65); }
        .trial-actions { display: flex; gap: .75rem; flex-shrink: 0; }
        .btn-trial-free { padding: .85rem 2rem; border-radius: 99px; background: rgb(95, 103, 172); color: var(--ink); font-family: 'Sora', sans-serif; font-weight: 800; font-size: .95rem; border: none; cursor: pointer; transition: all .2s; }
        .btn-trial-free:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2); }
        .btn-trial-demo { padding: .85rem 2rem; border-radius: 99px; background: rgba(255,255,255,.12); border: 1.5px solid rgba(255,255,255,.25); color: #fff; font-family: 'Sora', sans-serif; font-weight: 700; font-size: .95rem; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: .5rem; }
        .btn-trial-demo:hover { background: rgba(255,255,255,.2); transform: translateY(-2px); }

        /* ── HOW IT WORKS ── */
        .how-section { padding: 8rem 8%; background: #f5f5f5; }
        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; }
        .how-card { background: #fff; backdrop-filter: blur(8px); border-radius: 20px; padding: 2.5rem 2rem; border: 1px solid rgba(0,0,0,.06); box-shadow: 0 10px 30px rgba(0,0,0,.04); transition: all .3s; }
        .how-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,.1); background: #fcfcfc; }
        .how-num { font-family: 'Sora', sans-serif; font-size: 3.5rem; font-weight: 800; color: rgba(95,103,172,.16); line-height: 1; margin-bottom: 1rem; }
        .how-icon { width: 48px; height: 48px; border-radius: 14px; background: rgb(95, 103, 172); display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 1.25rem; }
        .how-card h3 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1.1rem; color: rgb(24, 11, 40); margin-bottom: .6rem; }
        .how-card p { font-size: .9rem; color: #5f6368; line-height: 1.7; }

        /* ── TESTIMONIALS ── */
        .testimonials-section { padding: 8rem 8%; background: #fff; }
        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 4rem; }
        .testi-card { padding: 2rem; background: var(--cream); border-radius: 16px; border: 1px solid rgba(0,0,0,.06); transition: all .25s; }
        .testi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.07); }
        .testi-stars { display: flex; gap: .2rem; margin-bottom: 1rem; color: var(--gold); }
        .testi-quote { font-size: .92rem; color: #374151; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: .75rem; }
        .testi-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--leaf), var(--lime)); display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-weight: 700; font-size: .85rem; color: #fff; }
        .testi-info strong { display: block; font-size: .88rem; font-weight: 700; color: var(--ink); }
        .testi-info span { font-size: .78rem; color: #9ca3af; }

        /* ── CTA ── */
        .cta-section { padding: 8rem 8%; background: rgb(24, 11, 40); text-align: center; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(95,103,172,.12) 0%, transparent 70%); }
        .cta-section .section-h2 { color: #fff; position: relative; }
        .cta-section p { font-size: 1.1rem; color: rgba(255,255,255,.6); max-width: 520px; margin: 1.25rem auto 2.5rem; position: relative; }
        .cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; }
        .btn-cta-main { padding: 1rem 2.5rem; border-radius: 99px; background: rgb(95, 103, 172); color: var(--ink); font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.05rem; border: none; cursor: pointer; display: flex; align-items: center; gap: .5rem; transition: all .25s; }
        .btn-cta-main:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(95,103,172,.3); }
        .btn-cta-demo { padding: 1rem 2.5rem; border-radius: 99px; border: 1.5px solid rgba(255,255,255,.25); background: transparent; color: #fff; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1.05rem; cursor: pointer; display: flex; align-items: center; gap: .5rem; transition: all .25s; }
        .btn-cta-demo:hover { background: rgba(255,255,255,.1); transform: translateY(-3px); }

        /* ── FOOTER ── */
        .footer { background: #f5f5f5; padding: 4rem 8% 2.5rem; }
        .footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
        .footer-brand p { font-size: .88rem; color: #6b7280; line-height: 1.7; margin-top: .75rem; max-width: 240px; }
        .footer-col h4 { font-family: 'Sora', sans-serif; font-size: .85rem; font-weight: 700; color: rgb(24, 11, 40); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 1rem; }
        .footer-col a { display: block; font-size: .88rem; color: #6b7280; text-decoration: none; margin-bottom: .6rem; transition: color .2s; }
        .footer-col a:hover { color: rgb(95, 103, 172); }
        .footer-bottom { border-top: 1px solid rgba(0,0,0,.08); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
        .footer-bottom p { font-size: .8rem; color: #6b7280; }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: .75; } 50% { transform: scale(1.6); opacity: 0; } }
        @keyframes scrollLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── PROBLEMS ── */
        .problems-section { padding: 7rem 8% 5rem; background: var(--cream); }
        .section-head-center { text-align: center; max-width: 680px; margin: 0 auto 3.5rem; }
        .section-head-center p { font-size: 1.05rem; color: rgb(95, 103, 172); line-height: 1.7; margin-top: 1rem; }
        .problems-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .problem-card {
          position: relative; isolation: isolate;
          background: #ffffff;
          border: 1px solid rgba(95,103,172,.18);
          border-radius: 22px; padding: 1.6rem 1.5rem 1.5rem;
          display: flex; flex-direction: column; gap: .85rem;
          min-height: 190px; cursor: default; overflow: hidden;
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease, background .35s ease;
          box-shadow: 0 4px 18px rgba(13,26,15,.05);
        }
        .problem-card-glow {
          position: absolute; inset: -40% -40% auto auto;
          width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle, rgba(95,103,172,.22) 0%, rgba(95,103,172,0) 70%);
          opacity: 0; transition: opacity .45s ease, transform .6s ease;
          z-index: 0; pointer-events: none;
        }
        .problem-card:hover {
          transform: translateY(-6px);
          border-color: rgb(95,103,172);
          box-shadow: 0 22px 48px rgba(95,103,172,.18);
          background: rgb(220,222,240);
        }
        .problem-card:hover .problem-card-glow { opacity: 1; transform: scale(1.15); }
        .problem-icon-wrap {
          position: relative; z-index: 1;
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px; border-radius: 14px;
          background: rgb(220,222,240); color: rgb(95,103,172);
          transition: background .35s ease, color .35s ease, transform .35s ease;
        }
        .problem-card:hover .problem-icon-wrap {
          background: rgb(95,103,172); color: #fff; transform: rotate(-4deg);
        }
        .problem-card h3 {
          position: relative; z-index: 1;
          font-weight: 800; font-size: 1.18rem; color: rgb(24, 11, 40);
          letter-spacing: -.4px; line-height: 1.25; margin: 0;
        }
        .problem-stat {
          position: relative; z-index: 1; margin-top: auto;
          display: inline-flex; align-items: center; gap: .5rem;
          font-size: .78rem; font-weight: 700; color: #4a5a4c;
          letter-spacing: .2px;
        }
        .problem-stat-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgb(24,11,40); box-shadow: 0 0 0 4px rgba(95,103,172,.15);
        }
        .problem-card-arrow {
          position: absolute; top: 1.4rem; right: 1.4rem; z-index: 1;
          color: rgba(13,26,15,.25);
          transition: color .35s ease, transform .35s ease;
        }
        .problem-card:hover .problem-card-arrow {
          color: rgb(24,11,40); transform: translate(4px,-4px);
        }

        /* ── SOLUTION ── */
        .solution-section { padding: 7rem 8%; background: rgb(24, 11, 40); position: relative; overflow: hidden; }
        .solution-section::before {
          content: ''; position: absolute; top: -200px; right: -200px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(95, 103, 172, .22), transparent 70%);
          pointer-events: none;
        }
        .solution-section .section-eyebrow { color: #fff; }
        .solution-section .section-h2 { color: #fff; }
        .solution-section .section-head-center p { color: rgba(255,255,255,.65); }
        .solution-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; position: relative; z-index: 1; }
        .solution-card {
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px; padding: 2.25rem 1.75rem;
          transition: all .35s ease; cursor: default;
          position: relative; overflow: hidden;
        }
        .solution-card::after {
          content: ''; position: absolute; left: 0; bottom: 0; height: 3px; width: 0;
          background: linear-gradient(90deg, var(--lime), var(--leaf));
          transition: width .4s ease;
        }
        .solution-card:hover { transform: translateY(-8px); background: rgba(95, 103, 172, .18); border-color: rgba(95, 103, 172, .35); box-shadow: 0 24px 60px rgba(0,0,0,.4); }
        .solution-card:hover::after { width: 100%; }
        .solution-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(95, 103, 172, .16); color: rgb(95, 103, 172);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem; transition: transform .35s ease, background .35s ease;
        }
        .solution-card:hover .solution-icon { transform: rotate(6deg) scale(1.08); background: rgb(95, 103, 172); color: #fff; }
        .solution-card h3 { font-weight: 800; font-size: 1.15rem; color: #fff; margin-bottom: .6rem; letter-spacing: -.5px; }
        .solution-card p { font-size: .92rem; color: rgba(255,255,255,.6); line-height: 1.65; }
        .solution-tag { display: inline-block; margin-top: 1.25rem; font-size: .72rem; font-weight: 700; color: rgb(95, 103, 172); letter-spacing: .05em; text-transform: uppercase; padding: .25rem .65rem; border-radius: 99px; background: rgba(95, 103, 172, .16); }

        /* ── SHOWCASE ── */
        .showcase-section { padding: 7rem 8%; background: white; }
        .showcase-section .section-head-center p { color: rgb(95, 103, 172); }


        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; gap: 3rem; padding: 120px 6% 60px; }
          .hero-img { max-width: 380px; }
          .story-grid, .db-layout { grid-template-columns: 1fr; gap: 3rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .pricing-grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
          .how-grid, .testi-grid { grid-template-columns: 1fr 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; }
          .problems-grid { grid-template-columns: repeat(2, 1fr); }
          .solution-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: block; }
          .hero { padding: 100px 5% 60px; }
          .hero-h1 { font-size: 2.4rem; }
          .how-grid, .testi-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .counter-card { right: -8px; bottom: -12px; min-width: 170px; }
          .cc-amount { font-size: 1.2rem; }
          .trial-banner { flex-direction: column; text-align: center; padding: 2rem 1.25rem; }
          .trial-actions { flex-direction: column; width: 100%; }
          .trial-actions button { width: 100%; }
          .cta-actions { flex-direction: column; align-items: center; }
          .footer-top { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; gap: .75rem; text-align: center; }

          /* Recent additions: Problems / Solution / Showcase / Dashboard */
          .problems-section { padding: 4.5rem 5% 3.5rem; }
          .problems-grid { grid-template-columns: 1fr; gap: 1rem; }
          .problem-card { min-height: 0; padding: 1.3rem 1.25rem 1.25rem; border-radius: 18px; }
          .problem-card h3 { font-size: 1.05rem; }
          .problem-icon-wrap { width: 46px; height: 46px; border-radius: 12px; }
          .problem-card-arrow { top: 1.1rem; right: 1.1rem; }

          .solution-section { padding: 4.5rem 5%; }
          .solution-grid { grid-template-columns: 1fr; gap: 1rem; }
          .solution-card { padding: 1.75rem 1.4rem; border-radius: 16px; }
          .solution-card h3 { font-size: 1.05rem; }
          .solution-card p { font-size: .88rem; }
          .solution-icon { width: 48px; color: rgb(95, 103, 172); height: 48px; border-radius: 13px; margin-bottom: 1rem; }

          .showcase-section { padding: 4.5rem 5%; }
          .section-head-center { margin-bottom: 2.25rem; }
          .section-head-center p { font-size: .95rem; }

          .dashboard-section { padding: 4.5rem 5%; }
          .db-header { margin-bottom: 2.5rem; }
          .db-header p { font-size: .95rem; }
          .db-features-grid { grid-template-columns: 1fr; gap: 1rem; }
          .db-feature { padding: 1rem; }

          .how-section { padding: 4.5rem 5%; }
          .pricing-section { padding: 4.5rem 5%; }
          .cta-section { padding: 4.5rem 5%; }
          .section-h2 { font-size: 1.9rem; letter-spacing: -1px; }
        }
        @media (max-width: 480px) {
          .problems-section, .solution-section, .showcase-section,
          .dashboard-section, .how-section, .pricing-section, .cta-section { padding-left: 4%; padding-right: 4%; }
          .section-h2 { font-size: 1.7rem; }
          .solution-card { padding: 1.5rem 1.2rem; }
        }
      `}</style>
      
      {/* this is the header section containing quick actions on KIT services */}
      <div>
       <div className="absolute  ml-0 text-[rgb(24, 11, 40)] p-4 font-bolder" style={{fontWeight:'100px'}}>
           <a href='/splash' style={{textDecoration: 'none'}}><b>Mira</b></a> </div>
      
      <div className="flex  text-black p-4 m-0 rounded-lg  w-full justify-end  text-auto">
       
        <div className="mr-10 ml-auto"> <a href="/about">About</a></div> <div className="mr-10"><a href="/blogs">Blog</a></div><div className="bg-black text-white rounded-full px-4 "> 
         <a href='/splash' style={{textDecoration: ''}}> Pay</a>
                      </div> 
           </div>
       </div>
      <HeroSection />
          
      <section className="problems-section" id="problems">
        <div className="section-head-center">
          <div className="section-eyebrow">The Problem</div>
          <h2 className="section-h2">Campus payments are <em className="text-primary">still a mess.</em></h2>
          <p>On most campuses, fees still move through paper receipts, WhatsApp screenshots, and late-night reconciliations. Money goes missing, students get stuck, and bursars carry the weight.</p>
        </div>

        <div className="problems-grid">
          {[
            {
              icon: <ReceiptText size={26} strokeWidth={2.2} />,
              title: "Lost & fake receipts",
              stat: "1 in 4 disputed",
            },
            {
              icon: <Hourglass size={26} strokeWidth={2.2} />,
              title: "Endless bank queues",
              stat: "5+ hrs per payment",
            },
            {
              icon: <FileWarning size={26} strokeWidth={2.2} />,
              title: "Reconciliation pain",
              stat: "70% of admin time",
            },
            {
              icon: <TrendingDown size={26} strokeWidth={2.2} />,
              title: "Money quietly lost",
              stat: "Up to 15% yearly",
            },
            {
              icon: <EyeOff size={26} strokeWidth={2.2} />,
              title: "Parents in the dark",
              stat: "Zero visibility",
            },
            {
              icon: <Layers size={26} strokeWidth={2.2} />,
              title: "Too many purses",
              stat: "10+ silos / campus",
            },
          ].map((p) => (
            <article key={p.title} className="problem-card">
              <div className="problem-card-glow" aria-hidden />
              <div className="problem-icon-wrap">{p.icon}</div>
              <h3>{p.title}</h3>
              <div className="problem-stat">
               {p.stat}
              </div>
              <ArrowDown className="problem-card-arrow" size={18} />
            </article>
          ))}
        </div>
      </section>

          {/* ── SOLUTION ── */}
      <section className="solution-section" id="solution">
        <div className="section-head-center">
          <div className="section-eyebrow">The Mira Solution</div>
          <h2 className="section-h2">One platform. <em>Every payment, sorted.</em></h2>
          <p>Mira swaps the queues, paper, and spreadsheets for one secure rail that handles every kind of campus payment built around how African schools actually work.</p>
        </div>

        <div className="solution-grid">
          {[
            {
              icon: <Zap size={26} />,
              title: "Receipts you can trust",
              desc: "Every payment generates a verified digital receipt that automatically downloads the moment funds clear.",
              tag: "Real-time",
            },
            {
              icon: <CreditCard size={26} />,
              title: "Pay from anywhere",
              desc: "Card, transfer, USSD, or mobile money. Students and parents pay how they want, on their mobile device, in under a minute.",
              tag: "Multi-channel",
            },
            {
              icon: <BarChart3 size={26} />,
              title: "Reconciliation on autopilot",
              desc: "Every kobo lands in the right ledger, matched to the right student, fee, and department with no manual sorting.",
              tag: "No more spreadsheets",
            },
            {
              icon: <Shield size={26} />,
              title: "Traceable and audit-ready",
              desc: "Every transaction is traceable and dispute-ready.",
              tag: "Audit-ready",
            },
            {
              icon: <Building2 size={26} />,
              title: "All your dues in one place",
              desc: "Tuition, hostel, faculty, SUG, departmental: one dashboard, one source of truth, with separate ledgers for each group.",
              tag: "All-in-one",
            },
            {
              icon: <Sparkles size={26} />,
              title: "Built for campuses here",
              desc: "Designed with bursars, SUG execs, and student leaders across universities.",
              tag: "Made for us",
            },
          ].map((s) => (
            <div key={s.title} className="solution-card">
              <div className="solution-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="solution-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

          {/* ── SHOWCASE ── */}
      <section className="showcase-section" id="showcase">
        <div className="section-head-center">
          <div className="section-eyebrow">What's next?</div>
          <h2 className="section-h2">A new chapter for <em>campus finance.</em></h2>
          <p>Mira quietly powers a calmer, smarter way to move money on campus.</p>
        </div>
        <ProfessionalSlider />
      </section>

          {/* ── DASHBOARD ── */}
      <section className="dashboard-section" id="dashboard">
        <div className="db-header">
          <div className="section-eyebrow">Organisation Dashboard</div>
          <h2 className="section-h2">Your school's financial control room</h2>
          <p>One view. Every payment. Live. The Mira dashboard gives bursars, principals, and admins full sight of school finances.</p>
        </div>
        <div className="db-features-grid">
          {[
            { icon: <BarChart3 size={22} />, title: "Live analytics", desc: "Track collections by class, department, and payment type updated as money comes in." },
            { icon: <Users size={22} />, title: "Student management", desc: "Sync your student register and check anyone's payment status with one click." },
            { icon: <CreditCard size={22} />, title: "Multi-fee management", desc: "Handle tuition, PTA, hostel, uniform, and exam fees separately or bundled." },
            { icon: <Building2 size={22} />, title: "Multi-branch support", desc: "Run multiple campuses from one account, with separate financial reporting per site." },
          ].map(f => (
            <div key={f.title} className="db-feature">
              <div className="db-feat-icon">{f.icon}</div>
              <div className="db-feat-text">
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <div className="section-eyebrow">How It Works</div>
          <h2 className="section-h2">Up and running in<br />under 10 minutes</h2>
        </div>
        <div className="how-grid">
          {[
            { num: "A", icon: <Building2 size={22} />, title: "Register Your Institution", body: "Sign up with your school details. Our onboarding team verifies and activates your account within 24 hours." },
            { num: "B", icon: <Users size={22} />, title: "Import Your Students", body: "Upload your student register." },
            { num: "C", icon: <CreditCard size={22} />, title: "Set Up Fee Schedules", body: "Define your fee structure amounts, due dates, and applicable classes. Mira does the rest." },
            { num: "D", icon: <Bell size={22} />, title: "Notify Parents", body: "Students and parents receive instant payment alerts via SMS, email, or WhatsApp." },
            { num: "E", icon: <TrendingUp size={22} />, title: "Collect & Reconcile", body: "Watch payments flow into your dashboard in real time, fully reconciled and audit-ready." },
            { num: "F", icon: <Shield size={22} />, title: "Settle & Report", body: "Funds settle to your school account on schedule. Download reports for your accounts department." },
          ].map(step => (
            <div key={step.num} className="how-card">
              <div className="how-num">{step.num}</div>
              <div className="how-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

    
    


         {/* ── CTA ── */}
      <section className="cta-section">
        <div className="section-eyebrow" style={{ color: "rgb(95, 107, 172)", position: "relative" }}>Ready to transform your school?</div>
        <h2 className="section-h2">Join 10+ department & Institution <em>already collecting smarter.</em></h2>
        <p>Start your free 30-day trial today. No card. No contracts. Just clarity.</p>
        <div className="cta-actions">
         <GetStartedButton />
               <BookDemoButton />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;