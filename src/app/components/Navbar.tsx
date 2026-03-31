import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import logoImage from "figma:asset/03e425ef142c13c416fab01ab43d6bd3c5981222.png";

const productCategories = [
  { label: "Fruits", emoji: "🍓", img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=80&q=80" },
  { label: "Vegetables", emoji: "🥦", img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=80&q=80" },
  { label: "Baby Food", emoji: "👶", img: "https://images.unsplash.com/photo-1711205229065-89353695a869?w=80&q=80" },
  { label: "Gym Food", emoji: "💪", img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=80&q=80" },
  { label: "Snacks", emoji: "🥨", img: "https://images.unsplash.com/photo-1615592602926-a3bfacbc1cbd?w=80&q=80" },
];

const productTypes = [
  { label: "Vegan", icon: "🌸" },
  { label: "Gelatin Free", icon: "✅" },
  { label: "Gluten Free", icon: "🌾" },
  { label: "Halal", icon: "🌿" },
];

const navLinks = [
  { label: "Products", hasMega: true },
  { label: "Recipes", href: "/recipes" },
  { label: "About Us", href: "/about" },
  { label: "Reviews", href: "/reviews" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveLink(label);
    if (label === "Products") setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActiveLink(null);
      setMegaOpen(false);
    }, 120);
  };

  return (
    <nav className="bg-[#0f172a] sticky top-0 z-50" style={{ fontFamily: "'Space Grotesk'" }}>
      {/* Main bar */}
      <div className="max-w-[1340px] mx-auto px-8 h-[102px] flex items-center justify-between relative">

        {/* Left links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(link.label)}
              onMouseLeave={handleMouseLeave}
            >
              {link.href ? (
                <Link
                  to={link.href}
                  className="flex items-center gap-1.5 py-2 transition-colors duration-200"
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.2px",
                    color: "rgba(255,255,255,0.78)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  className="flex items-center gap-1.5 py-2 transition-colors duration-200"
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.2px",
                    color: activeLink === link.label ? "#5eead4" : "rgba(255,255,255,0.78)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {link.label}
                  {link.hasMega && (
                    <ChevronDown
                      size={13}
                      style={{ transform: megaOpen && link.hasMega ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  )}
                </button>
              )}
            </div>
          ))}

          {/* ── Search button: "Search" label + rounded-square icon — exactly like Brars ── */}
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMegaOpen(false); }}
            aria-label="Search"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: searchOpen ? "#5eead4" : "rgba(255,255,255,0.78)",
              transition: "color 0.2s",
              letterSpacing: "0.2px",
            }}>
              Search
            </span>
            {/* Rounded square icon box */}
            <span style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: searchOpen ? "#5eead4" : "#2d3748",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
              flexShrink: 0,
            }}>
              <Search size={14} color={searchOpen ? "#0f172a" : "white"} />
            </span>
          </button>
        </div>

        {/* Center logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 select-none" style={{ textDecoration: "none" }}>
          <img
            src={logoImage}
            alt="NutroFreeze"
            style={{ width: "200px", height: "150px", objectFit: "contain" }}
          />
        </Link>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <motion.a
            href="#products"
            className="flex items-center gap-2 border border-white/20 text-white px-5 py-2.5 rounded-full hover:border-[#5eead4] hover:text-[#5eead4] transition-all"
            style={{ fontSize: "13px", fontWeight: 600 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Find Product
            <span className="w-5 h-5 rounded-full bg-[#0d9488] flex items-center justify-center text-white" style={{ fontSize: "9px" }}>▶</span>
          </motion.a>
          <motion.a
            href="#"
            className="flex items-center gap-2 bg-[#7c3aed] text-white px-5 py-2.5 rounded-full hover:bg-[#6d28d9] transition-all"
            style={{ fontSize: "13px", fontWeight: 700 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Shopping Cart
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Search panel ── thick dark border, white card, cream inner bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              backgroundColor: "#0f172a",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "14px 24px 18px",
            }}
          >
            {/* White card with thick dark border — exactly Brars */}
            <div
              style={{
                maxWidth: "1340px",
                margin: "0 auto",
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "14px",
                border: "2.5px solid #1c1c1e",
                boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
              }}
            >
              {/* Cream inner bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f5ece0",
                  borderRadius: "10px",
                  padding: "6px 6px 6px 20px",
                  gap: "12px",
                }}
              >
                <Search size={18} color="#a0856a" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  autoFocus
                  onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "17px",
                    color: "#374151",
                    padding: "12px 0",
                  }}
                />
                <button
                  style={{
                    backgroundColor: "#1c1c1e",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px 40px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    flexShrink: 0,
                    letterSpacing: "0.3px",
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mega Menu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-40"
            onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1340px] mx-auto px-8 py-8 grid grid-cols-3 gap-8">

              {/* Column 1: Product Categories */}
              <div>
                <p
                  className="mb-5 uppercase tracking-widest text-gray-400"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "3px" }}
                >
                  Product Categories
                </p>
                <div className="space-y-2">
                  {productCategories.map((cat) => (
                    <a
                      key={cat.label}
                      href="#products"
                      className="flex items-center justify-between group py-2 px-3 rounded-xl hover:bg-[#f0fdf9] transition-all"
                      onClick={() => setMegaOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100"
                          style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                        >
                          <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
                        </div>
                        <span
                          className="text-gray-900 group-hover:text-[#0d9488] transition-colors"
                          style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}
                        >
                          {cat.label}
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-[#0f172a] group-hover:bg-[#0d9488] flex items-center justify-center transition-colors flex-shrink-0">
                        <ArrowRight size={13} color="white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 2: Type of Products */}
              <div>
                <p
                  className="mb-5 uppercase tracking-widest text-gray-400"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "3px" }}
                >
                  Type of Products
                </p>
                <div className="space-y-2">
                  {productTypes.map((type) => (
                    <a
                      key={type.label}
                      href="#products"
                      className="flex items-center justify-between group py-3 px-3 rounded-xl hover:bg-[#faf5ff] transition-all"
                      onClick={() => setMegaOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl bg-[#ede9fe] flex items-center justify-center flex-shrink-0"
                          style={{ fontSize: "22px" }}
                        >
                          {type.icon}
                        </div>
                        <span
                          className="text-gray-900 group-hover:text-[#7c3aed] transition-colors"
                          style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}
                        >
                          {type.label}
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-[#0f172a] group-hover:bg-[#7c3aed] flex items-center justify-center transition-colors flex-shrink-0">
                        <ArrowRight size={13} color="white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 3: Featured */}
              <div>
                <p
                  className="mb-5 uppercase tracking-widest text-gray-400"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "3px" }}
                >
                  Featured
                </p>
                <div
                  className="rounded-2xl overflow-hidden relative"
                  style={{ background: "linear-gradient(145deg, #0f4c45 0%, #134e4a 60%, #1a1a2e 100%)", minHeight: "300px" }}
                >
                  <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-[#0d9488]/30" />
                  <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-[#7c3aed]/20" />
                  <div className="relative z-10 p-6">
                    <span
                      className="inline-block px-3 py-1 rounded-full bg-[#5eead4]/20 text-[#5eead4] mb-4"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}
                    >
                      New Arrival
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Gagalin', sans-serif",
                        fontSize: "32px",
                        fontWeight: 900,
                        color: "white",
                        lineHeight: 1.0,
                        letterSpacing: "-0.5px",
                        marginBottom: "10px",
                      }}
                    >
                      Berry Power<br />Blend
                    </h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: "20px" }}>
                      Premium frozen mixed berry blend — strawberries, blueberries & raspberries. Vegan, gelatin free, no added sugar.
                    </p>
                    <img
                      src="https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=200&q=80"
                      alt="Berry Blend"
                      className="absolute bottom-0 right-0 w-28 h-24 object-cover rounded-tl-2xl opacity-80"
                    />
                    <a
                      href="#products"
                      onClick={() => setMegaOpen(false)}
                      className="inline-flex items-center gap-2 bg-white text-[#0f172a] px-5 py-2.5 rounded-full hover:bg-[#5eead4] transition-colors"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700 }}
                    >
                      View Product <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#161c2d] border-t border-white/8 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                link.href ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block py-3 border-b border-white/5 transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href="#"
                    className="block py-3 text-white/75 hover:text-[#5eead4] border-b border-white/5 transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 600 }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <a href="#products" className="w-full text-center border border-white/20 text-white py-3 rounded-full" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "14px" }}>
                  Find Product
                </a>
                <a href="#" className="w-full text-center bg-[#7c3aed] text-white py-3 rounded-full" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "14px" }}>
                  Shopping Cart
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
