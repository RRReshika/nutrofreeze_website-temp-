import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronRight } from "lucide-react";

export function NewsletterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      {/* Split Background */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "50%", backgroundColor: "#ffffff", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "50%", bottom: 0, left: 0, right: 0, backgroundColor: "#231F20", zIndex: 1 }} />

      <div ref={ref} style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "100px 20px 140px" }}>
        
        {/* Animated Dark Clouds Silhouette (Top Edge of Dark Background) */}
        <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", width: "100%", height: "250px", zIndex: 2, display: "flex", justifyContent: "center" }}>
          <motion.svg
            viewBox="0 0 1200 400"
            fill="#231F20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", minWidth: "1100px", height: "100%", objectFit: "cover", overflow: "visible" }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            preserveAspectRatio="none"
          >
            {/* Wavy top edge of the dark section */}
            <path d="M0,800 L0,300 Q100,260 200,280 T400,230 T600,180 T800,230 T1000,270 T1200,300 L1200,800 Z" />
            <ellipse cx="250" cy="260" rx="110" ry="80" />
            <ellipse cx="450" cy="200" rx="130" ry="100" />
            <ellipse cx="650" cy="150" rx="160" ry="120" />
            <ellipse cx="850" cy="200" rx="130" ry="100" />
            <ellipse cx="1050" cy="260" rx="110" ry="70" />
          </motion.svg>
        </div>

        {/* The Purple Card */}
        <div style={{ position: "relative", zIndex: 5, maxWidth: "900px", margin: "0 auto" }}>
          
          {/* Yellow Starburst Badge (Left) */}
          <div style={{ position: "absolute", left: "-80px", top: "0px", zIndex: 10, width: "160px", height: "160px" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: 0 }}
            >
              <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
                {/* A 16-point starburst */}
                <polygon
                  points="80,0 90,30 120,10 115,40 150,35 130,60 160,80 130,100 150,125 115,120 120,150 90,130 80,160 70,130 40,150 45,120 10,125 30,100 0,80 30,60 10,35 45,40 40,10 70,30"
                  fill="#facc15"
                />
              </svg>
            </motion.div>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", color: "#231F20", lineHeight: 1.1, textAlign: "center" }}>
                SINCE<br/>2024<br/>DEPUIS
              </span>
            </div>
          </div>

          {/* Purple Circle Badge (Top Right) */}
          <div style={{ position: "absolute", right: "-40px", top: "-40px", zIndex: 10, width: "150px", height: "150px" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: 0 }}
            >
              <svg viewBox="0 0 150 150" style={{ width: "100%", height: "100%" }}>
                <circle cx="75" cy="75" r="75" fill="#6B2D4F" />
                <defs>
                  <path id="arc-top" d="M 15,75 a 60,60 0 1,1 120,0" />
                  <path id="arc-bottom" d="M 135,75 a 60,60 0 1,1 -120,0" />
                </defs>
                <text fill="white" style={{ fontSize: "14px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "bold", letterSpacing: "1.5px" }}>
                  <textPath href="#arc-top" startOffset="50%" textAnchor="middle">NEW & IMPROVED NUTROFREEZE</textPath>
                </text>
                <text fill="white" style={{ fontSize: "14px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "bold", letterSpacing: "1.5px" }}>
                  <textPath href="#arc-bottom" startOffset="50%" textAnchor="middle">NEW & IMPROVED NUTROFREEZE</textPath>
                </text>
              </svg>
            </motion.div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Bangers', cursive", fontSize: "40px", color: "white" }}>NF</span>
            </div>
          </div>

          {/* Orange Circle Badge (Bottom Right) */}
          <div style={{ position: "absolute", right: "-70px", bottom: "-60px", zIndex: 10, width: "180px", height: "180px" }}>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: 0 }}
            >
              <svg viewBox="0 0 180 180" style={{ width: "100%", height: "100%" }}>
                <circle cx="90" cy="90" r="90" fill="#E85D04" />
                <defs>
                  <path id="arc-orange" d="M 20,90 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
                </defs>
                <text fill="white" style={{ fontSize: "11px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "bold", letterSpacing: "1.5px" }}>
                  <textPath href="#arc-orange" startOffset="0%">PROUD FAMILY RECIPE MADE IN CANADA RECETTE FIÈREMENT FAMILIALE </textPath>
                </text>
              </svg>
            </motion.div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "50px" }}>🍁</span>
            </div>
          </div>

          {/* Card Content */}
          <div style={{ 
            backgroundColor: "#C8B6E2", 
            borderRadius: "48px", 
            padding: "80px 60px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(60px, 8vw, 110px)",
                color: "#231F20",
                textTransform: "uppercase",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                margin: "0 0 24px 0"
              }}
            >
              FREEZE UP YOUR<br />INBOX
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "18px",
                color: "#231F20",
                marginBottom: "40px"
              }}
            >
              Get special offers and all the latest products, recipes, and news delivered to your inbox!
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              onSubmit={e => e.preventDefault()}
              style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}
            >
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Full Name*"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    flex: "1 1 250px",
                    padding: "20px 24px",
                    borderRadius: "16px",
                    border: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    color: "#231F20",
                    outline: "none"
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address*"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: "1 1 300px",
                    padding: "20px 24px",
                    borderRadius: "16px",
                    border: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    color: "#231F20",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 20px 16px 32px",
                    backgroundColor: "#231F20",
                    color: "white",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: "bold",
                    fontSize: "18px",
                    flexShrink: 0
                  }}
                >
                  Submit
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "white",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <ChevronRight size={18} color="#231F20" />
                  </div>
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginTop: "16px" }}>
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{
                    marginTop: "4px",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "#231F20",
                    border: "2px solid #231F20",
                    borderRadius: "4px"
                  }}
                />
                <label htmlFor="agree" style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "#231F20",
                  lineHeight: 1.4,
                  cursor: "pointer",
                  maxWidth: "400px"
                }}>
                  *Yes, I would like to receive updates, promotions, and offers from NutroFreeze's Retail & Restaurants. I understand I can unsubscribe at any time.
                </label>
              </div>
            </motion.form>

          </div>
        </div>
      </div>
    </div>
  );
}