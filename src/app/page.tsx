'use client';

import Particles from "@/components/Particles";
import LaserFlow from '@/components/LaserFlow';
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FaDiscord, FaMedium, FaTwitter as FaXTwitter, FaGithub } from "react-icons/fa";
import LogoLoop from '@/components/LogoLoop';

export default function Home() {

  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.85]);
  
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBlack, setCursorBlack] = useState(false);
  const [cursorExpand, setCursorExpand] = useState(true);

  const techLogos = [
  { src: "/eth.png", alt: "Company 1" },
  { src: "/mlh.png", alt: "Company 2" },
  { src: "/valora.png", alt: "Company 3" },
  { src: "/alchemy.png", alt: "Company 4" },
  { src: "/devpost.png", alt: "Company 5" },
];

const tech2Logos = [
  { src: "/eth.png", alt: "Company 1" },
  { src: "/mlh.png", alt: "Company 2" },
  { src: "/valora.png", alt: "Company 3" },
  { src: "/alchemy.png", alt: "Company 4" },
  { src: "/devpost.png", alt: "Company 5" },
];
  


  useEffect(() => {
    let animationFrameId: number;
    let mouseX = cursor.x;
    let mouseY = cursor.y;

    const updateCursor = () => {
      setCursor({ x: mouseX, y: mouseY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          updateCursor();
          animationFrameId = 0;
        });
      }
    };

    const handleMouseDown = () => setCursorExpand(false);
    const handleMouseUp = () => setCursorExpand(true);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = '';
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
    
  }, []);

  // Add refs for in-view detection
  const [submissionsRef, submissionsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [hackersRef, hackersInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '30px',
          position: 'fixed',
          top: 0,
          left: 0,
          background: '#fff',
          color: '#222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          fontSize: '0.8rem',
          zIndex: 100,
          boxShadow:'0 1px 8px 0 rgba(243,232,232,0.04)',
          letterSpacing: '0.01em',
          fontFamily: '"Space Mono", monospace',
        }}
      >
        <style>
          {`
            @font-face {
              font-family: 'Space Mono';
              src: url('/fonts/SpaceMono-Regular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            .dashboard-link {
              position: relative;
              color: blue;
              text-decoration: none;
              margin-left: 4px;
              margin-right: 4px;
              font-weight: 700;
              font-family: "Space Mono", monospace;
              cursor: none;
              transition: color 0.2s;
            }
            .dashboard-link .underline {
              content: '';
              position: absolute;
              left: 0;
              bottom: -2px;
              width: 100%;
              height: 2px;
              background: blue;
              border-radius: 2px;
              transform: scaleX(0);
              transform-origin: left;
              transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
            }
            .dashboard-link:hover .underline {
              transform: scaleX(1);
            }
          `}
        </style>
        Hey developer!, View your <span>
          <a
            href="/admin-dash"
            className="dashboard-link"
          >
            dashboard
            <span className="underline"></span>
          </a>
        </span> here
      </div>
      <motion.nav
        style={{ opacity, top: 30 }} 
        className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-full py-5 z-50 backdrop-blur-md border-b border-white/20 shadow-lg transition-all duration-500"
      >
        <style>
          {`
            @font-face {
              font-family: 'Josefin Sans';
              src: url('/fonts/JosefinSans-VariableFont_wght.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            .nav-items {
              display: flex;
              gap: 2.5rem;
              align-items: center;
              position: absolute;
              right: 2.5rem;
              top: 50%;
              transform: translateY(-50%);
            }
            .nav-link {
              color: #fff;
              font-family: 'Josefin Sans', sans-serif;
              font-size: 1.05rem;
              font-weight: 500;
              letter-spacing: 0.03em;
              text-decoration: none;
              position: relative;
              padding: 2px 0;
              transition: color 0.18s;
              cursor: none;
              border-right: 2px solid #fff;
              padding-right: 1.8rem;
            }
            .nav-link:last-child {
              border-right: none;
              padding-right: 0;
            }
            .nav-link:hover {
              
            }
            .nav-link::after {
              content: '';
              position: absolute;
              left: 0;
              bottom: -2px;
              width: 70%;
              height: 2px;
              background: #fff;
              border-radius: 1px;
              transform: scaleX(0);
              transform-origin: left;
              transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
            }
            .nav-link:hover::after {
              transform: scaleX(1);
            }
          `}
        </style>
        <span style={{
          color: '#fff',
          fontWeight: 600,
          fontSize: '1.8rem',
          letterSpacing: '0.05em',
          marginLeft: '2.9rem',
          fontFamily: "'Josefin Sans', sans-serif",
        }}>
          DeVerify
        </span>
        <div className="nav-items">
          <a href="/pricings" className="nav-link">About</a>
          <a href="/about" className="nav-link">Pricings</a>
          <a href="/support" className="nav-link">Docs</a>
          <a href="/devtools" className="nav-link">Support</a>
        </div>
      </motion.nav>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'black',
          zIndex: 0,
          
        }}
      >
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="default-cursor"
        style={{
          position: 'fixed',
          left: cursor.x - 10,
          top: cursor.y - 10,
          width: 20,
          height: 20,
          zIndex: 9999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'none',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <line x1="10" y1="9" x2="10" y2="5" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateY(-4px)' : 'translateY(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <line x1="10" y1="11" x2="10" y2="15" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateY(4px)' : 'translateY(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <line x1="9" y1="10" x2="5" y2="10" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateX(-4px)' : 'translateX(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <line x1="11" y1="10" x2="15" y2="10" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </svg>
      </div>
      <div className="tagline-section">
        <style>
          {`
            @font-face {
              font-family: 'Space Mono';
              src: url('/fonts/SpaceMono-Regular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            .main-tagline {
              font-family: 'Space Mono', monospace;
              font-size: 1.25rem;
              color: #fff;
              line-height: 1.7;
              font-weight: 500;
              letter-spacing: 0.01em;
              max-width: 650px; /* expanded width */
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              margin-left: 4vw;
              z-index: 10;
              background: none;
              border: none;
              box-shadow: none;
              padding: 0;
            }
            .main-tagline-btns {
              display: flex;
              gap: 1.5rem;
              margin-top: 2.2rem;
            }
            .main-tagline-btn {
              font-family: 'Space Mono', monospace;
              font-size: 1.08rem;
              font-weight: 600;
              color: #fff;
              background: transparent;
              border: 2px solid #fff;
              border-radius: 999px;
              padding: 0.75rem 2.2rem;
              cursor: none;
              transition: background 0.18s, color 0.18s, border 0.18s;
              outline: none;
            }
            .main-tagline-btn:hover {
              background: rgba(255,255,255,0.12);
              color: #fff;
              border: 2px solid #fff;
            }
            @media (max-width: 900px) {
              .main-tagline {
                font-size: 1rem;
                max-width: 95vw;
                margin-left: 2vw;
              }
              .main-tagline-btn {
                font-size: 1rem;
                padding: 0.6rem 1.5rem;
              }
            }
          `}
        </style>
        <div className="half-land">
        <div className="main-tagline">
          Deverify is an AI-powered judging assistant that analyzes hackathon submissions, verifies authenticity, and scores projects objectively — helping judges focus on creativity, not code checks.
          <div className="main-tagline-btns">
            <button className="main-tagline-btn">Learn More</button>
            <a
              href="https://discord.gg/nm2rtqHp"
              target="_blank"
              rel="noopener noreferrer"
              className="main-tagline-btn"
              style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}
            >
              Join Us
            </a>
          </div>
        </div>
        <div className="mt-23">
          <LaserFlow />
        </div>
      </div>
      {/* Infobar with running text */}
      <div
        style={{
          width: "100vw",
          height: "38px",
          background: "rgba(243,232,232,1)",
          overflow: "hidden",
          position: "relative",
          zIndex: 11,
          marginTop: "-4.5rem", // bring it more up
          display: "flex",
          alignItems: "center",
        }}
      >
        <style>
          {`
            .infobar-marquee {
              display: inline-block;
              white-space: nowrap;
              will-change: transform;
              animation: infobar-marquee-move 14s linear infinite;
              font-family: 'Space Mono', monospace;
              font-size: 1rem;
              color: #222;
              font-weight: 500;
              letter-spacing: 0.01em;
              padding-left: 100vw;
            }
            @keyframes infobar-marquee-move {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100vw); }
            }
          `}
        </style>
        <span className="infobar-marquee">
          🚀 Deverify is live! Join our Discord for updates & support — https://discord.gg/nm2rtqHp 🚀
        </span>
      </div>
      
      <div
        style={{
          position: "absolute",
          top: "34%",
          right: "3vw",
          transform: "translateY(-50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/landguy.png"
          alt="Landing Guy"
          width={220}
          height={220}
          style={{
            maxWidth: "18vw",
            height: "auto",
            minWidth: "120px",
            opacity: 0.97,
            userSelect: "none",
          }}
          draggable={false}
          priority
        />
      </div>
      {/* Bento grid below infobar and image */}
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "15.5rem",
          marginBottom: "2.5rem",
          zIndex: 1,
          position: "relative",
          flexDirection: "column",
        }}
      >
        <style>
          {`
            .bento-grid {
              display: grid;
              grid-template-columns: repeat(4, minmax(140px, 1fr));
              gap: 2.2rem;
              width: 80vw;
              max-width: 950px;
              margin: 0 auto;
            }
            .bento-card {
              background: rgba(255,255,255,0.07);
              border-radius: 1.2rem;
              border: 1.5px solid rgba(255,255,255,0.13);
              box-shadow: 0 4px 32px 0 rgba(0,0,0,0.08);
              padding: 2.2rem 1.2rem 1.5rem 1.2rem;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              min-height: 120px;
              position: relative;
              transition: box-shadow 0.18s, border 0.18s, background 0.18s;
              font-family: 'Space Mono', monospace;
              backdrop-filter: blur(6px) saturate(180%);
              -webkit-backdrop-filter: blur(6px) saturate(180%);
            }
            .bento-title {
              font-size: 1.08rem;
              color: #fff;
              font-weight: 600;
              margin-bottom: 0.6rem;
              letter-spacing: 0.01em;
            }
            .bento-value {
              font-size: 2.1rem;
              font-weight: 700;
              color: #fff;
              letter-spacing: 0.01em;
              line-height: 1.1;
            }
            .bento-sub {
              font-size: 0.98rem;
              color: #d1d5db;
              margin-top: 0.2rem;
              font-weight: 400;
              letter-spacing: 0.01em;
            }
            .bento-card2 {
              background: rgba(255,255,255,0.07);
              border-radius: 1.2rem;
              border: 1.5px solid rgba(255,255,255,0.13);
              box-shadow: 0 4px 32px 0 rgba(0,0,0,0.08);
              padding: 2.2rem 1.2rem 1.5rem 1.2rem;
              margin-top: 2.2rem;
              width: 80vw;
              max-width: 950px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              min-height: 120px;
              font-family: 'Space Mono', monospace;
              backdrop-filter: blur(6px) saturate(180%);
              -webkit-backdrop-filter: blur(6px) saturate(180%);
            }
            @media (max-width: 900px) {
              .bento-grid {
                grid-template-columns: 1fr 1fr;
                gap: 1.2rem;
                width: 96vw;
              }
              .bento-card2 {
                width: 96vw;
                max-width: 100vw;
                padding: 1.2rem 0.7rem 1.1rem 0.7rem;
                min-height: 90px;
              }
              .bento-card {
                padding: 1.2rem 0.7rem 1.1rem 0.7rem;
                min-height: 90px;
              }
              .bento-title { font-size: 0.98rem; }
              .bento-value { font-size: 1.4rem; }
              .bento-sub { font-size: 0.85rem; }
            }
          `}
        </style>
        <div className="bento-grid">
          <div className="bento-card">
            <div className="bento-title">Hackathons Listed</div>
            <div className="bento-value">23</div>
            <div className="bento-sub">Total hackathons listed on DeVerify</div>
          </div>
          <div className="bento-card" ref={submissionsRef}>
            <div className="bento-title">Submissions</div>
            <div className="bento-value">
              {submissionsInView ? <CountUp end={1542} duration={2} separator="," /> : "0"}+
            </div>
            <div className="bento-sub">Projects analyzed & scored</div>
          </div>
          <div className="bento-card" ref={hackersRef}>
            <div className="bento-title">Hackers</div>
            <div className="bento-value">
              {hackersInView ? <CountUp end={4800} duration={2} separator="," /> : "0"}+
            </div>
            <div className="bento-sub">Unique participants</div>
          </div>
          <div className="bento-card">
            <div className="bento-title">NFT Mints (Monthly)</div>
            <div className="bento-value">312</div>
            <div className="bento-sub">Project NFTs minted this month</div>
          </div>
        </div>
        <div className="bento-card2">
          <div className="bento-title">Total Funding</div>
          <div className="bento-value">$134,567</div>
          <div className="bento-sub">Total funding awarded to projects</div>
        </div>
      </div>
      
      {/* Move partners section OUTSIDE the absolutely positioned/overflow-hidden parent */}
      <div className="partners max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 mt-50" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
          {/* Left: headline */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-white">
              The <em className="italic font-small">purpose-driven</em> blockchain
              <br />
              ecosystem building a trillion-dollar
              <br />
              onchain economy
            </h2>
          </div>
          {/* Right: CTA */}
          <div className="w-full lg:w-auto shrink-0">
            <a
              href="#explore"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide bg-transparent border border-white hover:bg-white hover:text-black transition text-white cursor-none"
              aria-label="Explore the Celo ecosystem"
            >
              Explore the Celo ecosystem →
            </a>
          </div>
        </div>
      </div>
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={68}
        gap={120}
        scaleOnHover
        ariaLabel="Technology partners"
      />
      <div className="mt-15 mb-50">
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="right"
        logoHeight={68}
        gap={120}
        scaleOnHover
        ariaLabel="Technology partners"
      />
      </div>
      <footer className="w-full border-t border-white/20 text-white backdrop-blur-md bg-transparent cursor-none">
        <style>
          {`
            @font-face {
              font-family: 'Space Mono';
              src: url('/fonts/SpaceMono-Regular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Josefin Sans';
              src: url('/fonts/JosefinSans-VariableFont_wght.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            .footer-spacemono {
              font-family: 'Space Mono', monospace !important;
            }
            .footer-josefin {
              font-family: 'Josefin Sans', sans-serif !important;
              letter-spacing: 0.04em;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 footer-spacemono cursor-none">
          <div className="col-span-1">
            <h1 className="text-3xl font-bold tracking-wide footer-josefin">DeVerify</h1>
            <p className="text-sm text-gray-400 mt-2">
              AI-assisted judging for fairer, faster hackathons.
            </p>

            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">
                Get updates from the <span className="footer-josefin"> DeVerify </span> team:
              </p>
              <div className="flex items-center bg-white/5 border border-white/30 rounded-md overflow-hidden w-full max-w-sm">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent text-white px-3 py-2 placeholder-gray-400 text-sm outline-none"
                />
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 transition text-white">
                  →
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3"><span className="footer-josefin">DeVerify </span>for</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white cursor-none">Judges</a></li>
              <li><a href="#" className="hover:text-white cursor-none">Organizers</a></li>
              <li><a href="#" className="hover:text-white cursor-none">Participants</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white cursor-none">Docs</a></li>
              <li><a href="#" className="hover:text-white cursor-none">API Reference</a></li>
              <li><a href="#" className="hover:text-white cursor-none">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Connect</h3>
            <div className="flex items-center space-x-3 cursor-none">
              <a href="#" className="p-2 border border-white/30 rounded-md hover:bg-white/10 transition cursor-none"><FaDiscord size={18} /></a>
              <a href="#" className="p-2 border border-white/30 rounded-md hover:bg-white/10 transition cursor-none"><FaMedium size={18} /></a>
              <a href="#" className="p-2 border border-white/30 rounded-md hover:bg-white/10 transition cursor-none"><FaXTwitter size={18} /></a>
              <a href="#" className="p-2 border border-white/30 rounded-md hover:bg-white/10 transition cursor-none"><FaGithub size={18} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-20 text-xs text-gray-500 text-center py-4 footer-spacemono">
          © 2025 <span className="footer-josefin">DeVerify</span> • Built with ❤️ by Team 0DAY • All rights reserved
        </div>
      </footer>
      </div>
      
    </>
  );
}

