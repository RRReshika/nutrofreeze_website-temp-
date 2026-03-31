import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { Navbar } from "../components/Navbar";

export function AboutPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Dark Navbar would go here, assuming it's absolute/fixed or we just place it */}
      <Navbar />

      <HeroSection />
      <ValuesSection />
      <FlavourfulSection />
      
    </div>
  );
}

function HeroSection() {
  return (
    <div style={{ position: "relative", backgroundColor: "#00B2A9", minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px", overflow: "hidden" }}>
      {/* Background Graphic */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1, opacity: 0.15, pointerEvents: "none" }}>
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M400 0C400 0 450 200 600 250C750 300 800 400 800 400C800 400 650 450 600 600C550 750 400 800 400 800C400 800 350 650 200 600C50 550 0 400 0 400C0 400 150 350 200 200C250 50 400 0 400 0Z" fill="#ffffff"/>
        </svg>
      </div>

      {/* Sparkles */}
      <Sparkle top="25%" left="15%" size={50} delay={0} />
      <Sparkle top="60%" left="10%" size={70} delay={1} />
      <Sparkle top="45%" right="12%" size={50} delay={0.5} />
      <Sparkle top="75%" right="15%" size={40} delay={1.5} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "0 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Bangers', cursive", fontSize: "28px", color: "#231F20", marginBottom: "20px", letterSpacing: "1px" }}
        >
          ABOUT US
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "clamp(80px, 12vw, 150px)",
            lineHeight: 0.85,
            color: "#231F20",
            margin: "0 0 40px 0",
            letterSpacing: "2px",
            textTransform: "uppercase"
          }}
        >
          VEGETARIAN DONE<br />BETTER
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(16px, 2vw, 22px)",
            lineHeight: 1.5,
            color: "#231F20",
            maxWidth: "800px",
            margin: "0 auto",
            fontWeight: 500
          }}
        >
          Based out of Mississauga and Brampton, Ontario, we proudly supply Canadian-made, home-style paneer, ghee, makhani, and a wide range of samosas and mithais. By connecting tradition to the modern world, we preserve our culinary heritage and bring a bit of NutroFreeze's magic to every day.
        </motion.p>
      </div>

      {/* Badges */}
      <div className="hidden md:block" style={{ position: "absolute", bottom: "10%", left: "10%", zIndex: 20 }}>
        <MadeInCanadaBadge />
      </div>
      <div className="hidden md:block" style={{ position: "absolute", bottom: "15%", right: "8%", zIndex: 20 }}>
        <VegetarianBadge />
      </div>
    </div>
  );
}

function Sparkle({ top, left, right, bottom, size, delay }: { top?: string, left?: string, right?: string, bottom?: string, size: number, delay: number }) {
  return (
    <motion.div
      style={{ position: "absolute", top, left, right, bottom, width: size, height: size, zIndex: 5 }}
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, delay, ease: "easeInOut" } }}
    >
      <svg viewBox="0 0 100 100" fill="white">
        <path d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z" />
      </svg>
    </motion.div>
  );
}

function MadeInCanadaBadge() {
  return (
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "#231F20", color: "white", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #231F20" }}
    >
      <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <path id="canada-text-path" d="M 30,100 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
        </defs>
        <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
        <text fill="white" style={{ fontSize: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: "bold", letterSpacing: "2px" }}>
          <textPath href="#canada-text-path" startOffset="0%">MADE IN CANADA • FABRIQUÉ AU CANADA • </textPath>
        </text>
      </svg>
      {/* Maple leaf placeholder */}
      <svg viewBox="0 0 24 24" fill="white" style={{ width: "60px", height: "60px" }}>
        <path d="M12 2 L15 9 L22 10 L17 15 L19 22 L12 18 L5 22 L7 15 L2 10 L9 9 Z" />
      </svg>
    </motion.div>
  );
}

function VegetarianBadge() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      style={{ width: "180px", height: "180px", borderRadius: "50%", backgroundColor: "#9D7BCE", color: "white", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg viewBox="0 0 180 180" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <path id="veg-text-path" d="M 20,90 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
        </defs>
        <text fill="white" style={{ fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: "bold", letterSpacing: "2px" }}>
          <textPath href="#veg-text-path" startOffset="0%">VEGETARIAN • 100% • VÉGÉTARIEN • 100% • </textPath>
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "40px", fontFamily: "'Bangers', cursive", lineHeight: 1 }}>100%</span>
      </div>
    </motion.div>
  );
}

function ValuesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div style={{ backgroundColor: "#ffffff", padding: "120px 20px", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "60px" }}>
        
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div ref={ref} className="flex-1" style={{ textAlign: "left" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{ fontFamily: "'Bangers', cursive", fontSize: "28px", color: "#231F20", marginBottom: "20px", letterSpacing: "1px" }}
            >
              OUR VALUES
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(60px, 8vw, 110px)",
                lineHeight: 0.85,
                color: "#231F20",
                margin: "0 0 30px 0",
                letterSpacing: "1px"
              }}
            >
              TRADITION,<br />NUTRITION,<br />CONNECTION
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "20px",
                lineHeight: 1.6,
                color: "#231F20",
                maxWidth: "500px",
                fontWeight: 500,
                margin: 0
              }}
            >
              Simply put, we're a company that cares. We care about ingredients sourced from the regions they're authentically from. We care about better recipes, as close to home-cooked as possible, without preservatives or filler. And we care about bringing people together—like good food always does.
            </motion.p>
          </div>

          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ borderRadius: "48px", overflow: "hidden", height: "clamp(400px, 50vw, 600px)" }}
          >
            <img 
              src="https://images.unsplash.com/photo-1592498546551-222538011a27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGluJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzQ2MjExNjd8MA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Chef cooking" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}

function FlavourfulSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);

  return (
    <div ref={ref} style={{ backgroundColor: "#ffffff", padding: "160px 20px", position: "relative", minHeight: "1000px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      
      {/* Floating Images */}
      <motion.div className="hidden md:block" style={{ position: "absolute", top: "15%", left: "15%", width: "220px", height: "140px", borderRadius: "24px", overflow: "hidden", zIndex: 5, y: y1 }}>
        <img src="https://images.unsplash.com/photo-1713298324627-f2738016a25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0d28lMjBjaGVmcyUyMHRhbGtpbmclMjBpbiUyMGtpdGNoZW58ZW58MXx8fHwxNzc0NjIxMTcyfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Chefs" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>

      <motion.div className="hidden md:block" style={{ position: "absolute", top: "25%", right: "5%", width: "320px", height: "400px", borderRadius: "24px", overflow: "hidden", zIndex: 15, y: y2 }}>
        <img src="https://images.unsplash.com/photo-1637778138739-cd649774ca78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGVhdGluZyUyMGJ1cmdlcnMlMjBvdXRkb29yc3xlbnwxfHx8fDE3NzQ2MjExNzd8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Eating burgers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>

      <motion.div className="hidden md:block" style={{ position: "absolute", bottom: "5%", left: "0%", width: "350px", height: "250px", borderRadius: "24px", overflow: "hidden", zIndex: 15, y: y3 }}>
        <img src="https://images.unsplash.com/photo-1761956330384-9b99136c3393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMG9mJTIwZnJpZW5kcyUyMHNpdHRpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NzQ2MjExODJ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Group sitting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>

      <motion.div className="hidden md:block" style={{ position: "absolute", bottom: "10%", right: "8%", width: "200px", height: "200px", borderRadius: "24px", overflow: "hidden", zIndex: 5, y: y4 }}>
        <img src="https://images.unsplash.com/photo-1592498546551-222538011a27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGluJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzQ2MjExNjd8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Details" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "1100px" }}>
        <h2
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "clamp(70px, 12vw, 160px)",
            lineHeight: 0.85,
            color: "#231F20",
            margin: 0,
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}
        >
          LIFE SHOULD<br />
          ALWAYS BE<br />
          <span style={{ color: "#9D7BCE" }}>THIS FLAVOURFUL</span>
        </h2>
      </div>

    </div>
  );
}
