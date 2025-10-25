'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";

export default function Dashboard() {
    
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [cursorBlack, setCursorBlack] = useState(false);
    const [cursorExpand, setCursorExpand] = useState(true);

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

  return (
    <>
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#18181b',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Josefin Sans', 'Space Mono', monospace, sans-serif",
      }}
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
          @font-face {
            font-family: 'Space Mono';
            src: url('/fonts/SpaceMono-Regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}
      </style>
      <h1 style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 700,
        fontSize: '2.5rem',
        marginBottom: '1rem',
        letterSpacing: '0.04em',
      }}>
        Dashboard
      </h1>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '1.1rem',
        color: '#d1d5db',
        textAlign: 'center',
        maxWidth: 480,
      }}>
        Welcome to your dashboard. This is a placeholder page. Add your dashboard content here.
      </p>
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
      </>

  );
}
