import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

// Brars-style spinning mandala decoration
function SpinMandala({ size = 100, color = "#c4b5fd" }: { size?: number; color?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      animate={{ rotate: 360 }}
      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      style={{ display: "block", opacity: 0.22 }}
    >
      {[0, 45, 90, 135].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <ellipse cx="60" cy="32" rx="6" ry="26" fill={color} />
          <ellipse cx="60" cy="88" rx="6" ry="26" fill={color} />
        </g>
      ))}
      {[22.5, 67.5, 112.5, 157.5].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <ellipse cx="60" cy="36" rx="4" ry="20" fill={color} opacity="0.5" />
          <ellipse cx="60" cy="84" rx="4" ry="20" fill={color} opacity="0.5" />
        </g>
      ))}
      <circle cx="60" cy="60" r="10" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="60" cy="60" r="22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
    </motion.svg>
  );
}

const socialLinks = [
  {
    platform: "Instagram",
    handle: "@nutrofreeze",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    platform: "Facebook",
    handle: "/nutrofreeze",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    platform: "TikTok",
    handle: "@nutrofreeze",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

// Doubled so the marquee loops seamlessly
const gridPhotos = [
  { id: 1, img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=500&q=80", caption: "Freeze Dried Fruits" },
  { id: 2, img: "https://images.unsplash.com/photo-1711205229065-89353695a869?w=500&q=80", caption: "Baby Nutrition" },
  { id: 3, img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=500&q=80", caption: "Pure Vegetables" },
  { id: 4, img: "https://images.unsplash.com/photo-1473340186413-a68ba9c2564e?w=500&q=80", caption: "Ready to Eat" },
  { id: 5, img: "https://images.unsplash.com/photo-1595265185654-f7b3c41c9a57?w=500&q=80", caption: "Berry Goodness" },
  { id: 6, img: "https://images.unsplash.com/photo-1615592602926-a3bfacbc1cbd?w=500&q=80", caption: "Crunchy Snacks" },
  { id: 7, img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=500&q=80", caption: "Family Nutrition" },
  { id: 8, img: "https://images.unsplash.com/photo-1716801564904-5605f562b664?w=500&q=80", caption: "Just Add Water" },
];

// Inject the marquee keyframe once via a style tag
const MARQUEE_STYLE = `
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
`;

export function SocialMedia() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Duplicate photos for seamless loop
  const loopPhotos = [...gridPhotos, ...gridPhotos];

  return (
    <section id="social" className="overflow-hidden" ref={ref}>
      <style>{MARQUEE_STYLE}</style>

      {/* ── Top hero CTA ── */}
      <div
        className="relative flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #134e4a 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#7c3aed]/15 translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-white/5" />

        {/* Spinning mandala — Brars style */}
        <div className="absolute top-4 right-6 pointer-events-none">
          <SpinMandala size={140} color="#c4b5fd" />
        </div>
        <div className="absolute bottom-4 left-8 pointer-events-none">
          <SpinMandala size={90} color="#5eead4" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div
            className="mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "5px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}
          >
            Join the community
          </div>
          <h2
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(42px, 9vw, 110px)",
              color: "white",
              textTransform: "uppercase",
              lineHeight: 0.92,
              letterSpacing: "0.03em",
              marginBottom: "24px",
            }}
          >
            FOLLOW<br />
            <span style={{ color: "#c4b5fd" }}>@NUTROFREEZE</span><br />
            FOODCULTURE<br />FOR MORE
          </h2>
        </motion.div>

        {/* Social buttons */}
        <motion.div
          className="relative z-10 flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-2xl justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {socialLinks.map((s) => (
            <motion.a
              key={s.platform}
              href="#"
              className="flex-1 flex items-center justify-between px-5 py-3.5 rounded-full group transition-all"
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                minWidth: "170px",
              }}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(0,0,0,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-3 text-white">
                {s.icon}
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 600 }}>
                  {s.platform}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-[#c4b5fd] group-hover:text-[#0f172a] flex items-center justify-center text-white transition-all">
                <ArrowRight size={13} />
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* ── Continuous horizontal photo strip ── */}
      <div style={{ overflow: "hidden", background: "#0f172a", padding: "0" }}>
        <div className="marquee-track">
          {loopPhotos.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className="relative flex-shrink-0 group cursor-pointer overflow-hidden"
              style={{ width: "clamp(200px, 22vw, 300px)", height: "clamp(200px, 22vw, 300px)" }}
            >
              <img
                src={photo.img}
                alt={photo.caption}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                className="group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                style={{ background: "rgba(13,148,136,0)", }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(13,148,136,0.6)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(13,148,136,0)")}
              >
                <p
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-3"
                  style={{ fontFamily: "'Bangers', cursive", fontSize: "18px", letterSpacing: "0.04em", color: "white", textTransform: "uppercase" }}
                >
                  {photo.caption}
                </p>
              </div>
              {/* Instagram tag */}
              <div
                className="absolute top-2 left-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "10px", fontWeight: 600, color: "white" }}>
                  Instagram
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
