import { motion } from "motion/react";
import { Instagram, Facebook, Twitter, Youtube, Heart } from "lucide-react";

const footerLinks = {
  Products: ["Dahi Ke Kebab", "Veg Samosa", "Aloo Tikki", "Paneer Veg Bites", "Spring Rolls", "Party Packs"],
  Company: ["About Us", "Our Story", "Careers", "News & Media", "Sustainability"],
  Recipes: ["Starters", "Chaat Ideas", "Fusion Recipes", "Party Platters", "Quick Meals"],
  Help: ["Find a Retailer", "FAQ", "Contact Us", "Wholesale Enquiries"],
};

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-[#111] text-white/60">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div
              className="text-white mb-6"
              style={{
                fontFamily: "'Gagalin', sans-serif",
                fontSize: "30px",
                fontWeight: 900,
                background: "linear-gradient(135deg, #5eead4 0%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NutroFreeze
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.8 }}>
              Proud Canadian frozen food brand bringing authentic South Asian snacks to families across North America. Made with love, from our family to yours.
            </p>

            <div className="flex items-center gap-2 mt-4 mb-6">
              <span style={{ fontSize: "20px" }}>🍁</span>
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, color: "#5eead4" }}
              >
                Proud Family Recipe · Made in Canada
              </span>
            </div>

            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#0d9488] hover:border-[#0d9488] hover:text-white transition-all text-white/60"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 800, color: "white", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}
              >
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-[#5eead4] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap justify-center gap-6">
          {["🏆 Canadian Food Award 2023", "⭐ Best Frozen Snack", "🌿 No Artificial Preservatives", "✅ Halal Certified", "🍁 Made in Canada"].map((a) => (
            <span key={a} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", letterSpacing: "1px" }}>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>
            © 2026 Nutrofreeze Foods Inc. All rights reserved.
          </p>
          <p className="flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>
            Made with <Heart size={12} className="text-[#5eead4]" fill="currentColor" /> in Mississauga, Canada
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="hover:text-[#5eead4] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}