"use client";
import React, { useEffect, useState } from "react";

export default function ScrollTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(500);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const currentScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setScrolled(currentScroll);
    setShowScrollTop(window.scrollY >= window.innerHeight);
    const totalScrollHeight = Math.max(
      document.documentElement.scrollHeight - document.documentElement.clientHeight,
      1
    );
    setScrollHeight(totalScrollHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dashOffset = (() => {
    if (scrollHeight <= 0) return 307.919;
    const offset = 307.919 - (scrolled / scrollHeight) * 307.919;
    return isNaN(offset) ? 307.919 : Math.max(0, Math.min(307.919, offset));
  })();

  return (
    <div
      className={`progress-wrap ${showScrollTop ? "active-progress" : ""}`}
      onClick={scrollToTop}
      style={{ display: showScrollTop ? 'block' : 'none' }}
    >
      <svg
        className="progress-circle svg-content"
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          style={{
            strokeDasharray: "307.919, 307.919",
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
    </div>
  );
}
