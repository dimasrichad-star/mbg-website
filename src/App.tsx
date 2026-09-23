import { useEffect, useRef, useState } from "react";

/* ─── Color tokens ─── */
// BG:     #0f1480  (deep cobalt blue)
// ACCENT: #d4ff00  (neon chartreuse yellow)
// TEXT:   #ffffff
// BLUE2:  #1a22cc  (mid blue for cards/panels)

/* ─── MBG Logo SVG ─── */
function MBGLogo({ className = "", size = 100 }: { className?: string; size?: number }) {
  return(
   <img src="/LOGO3D1.png" width="400" height="400" alt="Logo atas"/>
  );
}

/* ─── Lightning bolt ornament ─── */
function LightningBolt({
  className = "",
  color = "#d4ff00",
  size = 80,
  opacity = 0.5,
  style: extraStyle,
}: {
  className?: string;
  color?: string;
  size?: 140;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 50 80"
      fill="none"
      className={className}
      style={{ opacity, ...extraStyle }}
    >
      <polygon
        points="30,0 10,45 25,45 20,80 45,30 28,30"
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

/* ─── Particles ─── */
function Particles({ count = 40 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 10,
    size: 1 + Math.random() * 2,
    color: i % 2 === 0 ? "#d4ff00" : "#ffffff",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-4px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            animation: `particle-drift ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Waveform ─── */
function Waveform({ bars = 16 }: { bars?: number }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] rounded-full opacity-80"
          style={{ animationDelay: `${i * 0.07}s`, background: "#d4ff00" }}
        />
      ))}
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Schedule", href: "#schedule" },
    { label: "Gallery", href: "#gallery" },
    { label: "Booking", href: "#booking" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nav-blur border-b border-white/10" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <LightningBolt size={18} opacity={1} />
          <span className="font-['Rajdhani'] font-bold text-xl tracking-widest text-[#d4ff00]" style={{ textShadow: "0 0 12px #d4ff0080" }}>
            MBG
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="font-['Rajdhani'] font-semibold text-sm tracking-widest text-white/70 hover:text-[#d4ff00] transition-colors uppercase"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

       

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-6 bg-[#d4ff00] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#d4ff00] transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#d4ff00] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden nav-blur border-t border-white/10 px-6 pb-6 pt-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block py-3 font-['Rajdhani'] font-semibold tracking-widest uppercase text-white/80 hover:text-[#d4ff00] border-b border-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            className="block mt-4 text-center btn-neon px-5 py-3 font-['Rajdhani'] font-bold tracking-widest uppercase bg-[#d4ff00] text-[#0f1480] rounded-sm"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at top, #1a22cc 0%, #0f1480 40%, #080d60 100%)" }}
    >
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img
          src="bk.webp"
          alt="DJ performance"
          className="w-full h-full object-cover opacity-100 mix-blend-luminosity"
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, #1a22dd60 0%, #0f148090 60%, #080d60 100%)" }} />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Particles */}
      <Particles count={45} />

      {/* Big background lightning bolts */}
   {/* Kiri atas */}
      <div className="absolute left-60 top-1/4 opacity-100 pointer-events-none">
        <img 
          src="/loki.webp" 
          alt="decoration" 
          className="w-[220px] h-[340px] object-contain drop-shadow-[0_0_12px_#d4ff00] animate-pulse [animation-duration:1.5s]" 
        />
      </div>

      {/* Kanan atas */}
      <div className="absolute right-60 top-1/4 opacity-100 pointer-events-none">
        <img 
          src="/loka.webp" 
          alt="decoration" 
          className="w-[220px] h-[340px] object-contain drop-shadow-[0_0_12px_#d4ff00] animate-pulse [animation-duration:2.5s]" 
        />
      </div>

      {/* Kiri bawah */}
      <div className="absolute left-1/3 bottom-24 opacity-80 pointer-events-none">
        <img 
          src="/loka.webp" 
          alt="decoration" 
          className="w-[80px] h-[130px] object-contain animate-pulse [animation-duration:1.8s]" 
        />
      </div>

      {/* Kanan bawah */}
      <div className="absolute right-1/3 bottom-24 opacity-80 pointer-events-none">
        <img 
          src="/loki.webp" 
          alt="decoration" 
          className="w-[70px] h-[110px] object-contain animate-pulse [animation-duration:2.2s]" 
        />
      </div>
      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #d4ff0015 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #ffffff08 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
        {/* MBG Logo */}
        <div className="flex justify-center mb-6 animate-float">
          <MBGLogo size={380} />
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#d4ff00]" />
          <LightningBolt size={14} opacity={1} />
          <p className="font-['Rajdhani'] text-base md:text-xl tracking-[0.3em] text-white/90 uppercase">
            POSITIVE PIBES.
          </p>
          <LightningBolt size={14} opacity={1} />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#d4ff00]" />
        </div>

        <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed">
          Lewat kombinasi lagu-lagu hits dan remix koplo yang ramah di telinga,MBG selalu sukses bawa vibe asik yang bikin siapa saja lepas, seru-seruan, dan joget bareng dari awal sampai akhir set.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#booking"
            className="btn-neon px-10 py-4 border border-white/30 text-white font-['Rajdhani'] font-bold text-lg tracking-[0.25em] uppercase rounded-sm hover:border-[#d4ff00] hover:text-[#d4ff00] hover:scale-105 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}
          >
            <span style={{ color: "rgb(212, 255, 0)" }}>booking</span>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 flex justify-center">
          <div className="flex flex-col items-center gap-2 animate-float">
            <span className="text-white/30 text-xs font-['Rajdhani'] tracking-widest uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#d4ff00] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      }),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: "50+", label: "Events Performed" },
    { value: "100%", label: "Pure Energy" },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080d60 0%, #0f1480 50%, #0a0f70 100%)" }}
    >
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(to right, transparent, #d4ff00, transparent)" }} />

      {/* Glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #d4ff0008 0%, transparent 70%)" }} />

      {/* Lightning ornaments */}
      <LightningBolt className="absolute top-12 right-20 animate-lightning" size={45} opacity={0} />
      <LightningBolt className="absolute bottom-12 left-16 animate-pulse-glow" size={30} opacity={0} />

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="reveal font-['Rajdhani'] tracking-[0.4em] text-sm uppercase mb-4" style={{ color: "#d4ff00", textShadow: "0 0 12px #d4ff0060" }}>
              Who We Are
            </p>
            <h2 className="reveal reveal-delay-1 font-['Rajdhani'] font-bold text-2xl md:text-4xl leading-tight text-white mb-6">
  TEAM DJ-LEAD KARAOKE<br />
  <span style={{ color: "#d4ff00" }}> LAKI LAKI </span> YANG ENERGIK DAN MENAWAN
</h2>
            <p className="reveal reveal-delay-2 text-white/70 text-base leading-relaxed mb-4">
              Siap hidupkan acaramu lewat konsep party karaoke interaktif yang seru dan penuh energi! Kami membawakan musik remix lintas genre—mulai dari Pop, Timur, Reggae, hingga hits 90-an—dalam balutan irama koplo yang asyik untuk bergoyang.Di sini, pengunjung tidak hanya duduk menonton, tetapi diajak aktif berinteraksi, bernyanyi, dan berjoget bersama. Mau acaramu jadi unforgettable? Yuk, undang kami sekarang!

            </p>
            <p className="reveal reveal-delay-3 text-white/55 text-base leading-relaxed mb-8">  
Mau tempat atau acara kamu jadi unforgettable? Yuk undang Kami. 
            </p>
            <div className="reveal reveal-delay-4 flex items-center gap-4">
              <span className="font-['Rajdhani'] tracking-widest text-sm uppercase" style={{ color: "#d4ff00" }}>
                Live Performance Ready
              </span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`reveal reveal-delay-${i + 1} p-6 rounded-sm text-center group cursor-default transition-all duration-300`}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,255,0,0.2)", backdropFilter: "blur(12px)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#d4ff0070";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px #d4ff0020";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,255,0,0.2)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div className="font-['Rajdhani'] font-black text-5xl mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: "#d4ff00", textShadow: "0 0 20px #d4ff0060" }}>
                    {s.value}
                  </div>
                  <div className="font-['Rajdhani'] tracking-widest text-xs uppercase text-white/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal mt-4 relative overflow-hidden rounded-sm w-full max-w-full md:w-[65kalo0px] md:h-[400px] flex items-center justify-center">
              <img
                src="/be4.webp"
                alt="DJ equipment"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute inset-0 border border-[#d4ff0020] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Gigs Schedule ─── */
export function Schedule() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target
              .querySelectorAll(".reveal")
              .forEach((el) => el.classList.add("visible"));
          }
        }),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const gigs = [
 
    {
      date: "AUG 29",
      day: "Sabtu",
      name: "Malam Puncak Kemerdekaan",
      venue: "Gunung Sindur",
      city: "Bogor",
      time: "18:00 – selesai",
      tag: "FESTIVAL",
    },
    {
      date: "SEP 05",
      day: "Sabtu",
      name: "Malam Puncak Kemerdekaan",
      venue: "Kali Mulya",
      city: "Depok",
      time: "16:00 – selesai",
      tag: "FESTIVAL",
    },
    {
      date: "SEP 20",
      day: "Minggu",
      name: "HUT PMI",
      venue: "PMI BOGOR",
      city: "Bogor",
      time: "09:00 – selesai",
      tag: "EVENT",
    },
       {
      date: "SEP 27",
      day: "Minggu",
      name: "TRANS TV Festival",
      venue: "Lap. Panahan Stadion Pakansari",
      city: "Bogor",
      time: "06:00 – selesai",
      tag: "FESTIVAL",
    },
       {
      date: "OKT 04",
      day: "Minggu",
      name: "Dies Natalis PNJ",
      venue: "Politeknik Negeri Jakarta",
      city: "Depok",
      time: "09:00 – selesai",
      tag: "EVENT",
    },
  ];

  return (
    <section
      id="schedule"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0f70 0%, #070a48 70%, #0f1480 100%)",
      }}
    >
      {/* ── Background Image & Gradient Overlay ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="bk.png"
          alt="DJ performance"
          className="w-full h-full object-cover opacity-100 mix-blend-luminosity"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, #1a22dd60 0%, #0f148090 60%, #080d60 100%)",
          }}
        />
      </div>

      {/* Decorative Border Accent */}
      <div
        className="absolute top-0 left-0 w-full h-px z-10"
        style={{
          background:
            "linear-gradient(to right, transparent, #ffffff40, transparent)",
        }}
      />

      <LightningBolt
        className="absolute bottom-16 right-8 animate-pulse-glow z-10"
        size={40}
        opacity={0.15}
      />

      {/* ── Main Content Container ── */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p
            className="reveal font-['Rajdhani'] tracking-[0.4em] text-sm uppercase mb-4"
            style={{ color: "#d4ff00", textShadow: "0 0 12px #d4ff0060" }}
          >
            Upcoming event
          </p>
          <h2 className="reveal reveal-delay-1 font-['Rajdhani'] font-bold text-[clamp(2.5rem,5vw,4rem)] text-white leading-tight">
            EVENT{" "}
            <span
              style={{ color: "#d4ff00", textShadow: "0 0 20px #d4ff0050" }}
            >
              SCHEDULE
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gigs.map((g, i) => (
            <div
              key={`${g.date}-${g.name}-${i}`}
              className={`reveal reveal-delay-${(i % 4) + 1} group p-6 rounded-sm cursor-default transition-all duration-300`}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(212, 255, 0, 0.15)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#d4ff0060";
                el.style.boxShadow = "0 0 24px #d4ff0015";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(212,255,0,0.15)";
                el.style.boxShadow = "none";
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className="font-['Rajdhani'] font-black text-3xl"
                    style={{
                      color: "#d4ff00",
                      textShadow: "0 0 12px #d4ff0060",
                    }}
                  >
                    {g.date}
                  </div>
                  <div className="font-['Rajdhani'] text-xs tracking-widest text-white/40 uppercase">
                    {g.day}
                  </div>
                </div>
                <span
                  className="font-['Rajdhani'] text-xs tracking-widest uppercase px-3 py-1 rounded-sm"
                  style={{
                    color: "#d4ff00",
                    borderColor: "#d4ff0040",
                    border: "1px solid #d4ff0030",
                    background: "#d4ff0010",
                  }}
                >
                  {g.tag || "GIG"}
                </span>
              </div>

              <h3 className="font-['Rajdhani'] font-bold text-lg text-white tracking-wide mb-3 group-hover:text-[#d4ff00] transition-colors">
                {g.name}
              </h3>

              <div className="space-y-1.5 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{g.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏙</span>
                  <span>{g.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕙</span>
                  <span>{g.time}</span>
                </div>
              </div>

              <div
                className="mt-4 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #d4ff0050, transparent)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery ─── */
/* ─── Gallery ─── */
function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target
              .querySelectorAll(".reveal")
              .forEach((el) => el.classList.add("visible"));
        }),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const photos = [
    { url: "/11.JPG", alt: "Gallery photo 11" },
    { url: "/2.jpeg", alt: "Gallery photo 2" },
    { url: "/3.jpeg", alt: "Gallery photo 3" },
    { url: "/4.jpeg", alt: "Gallery photo 4" },
    { url: "/5.jpeg", alt: "Gallery photo 5" },
    { url: "/6.jpeg", alt: "Gallery photo 6" },
    { url: "/7.jpeg", alt: "Gallery photo 7" },
    { url: "/8.jpeg", alt: "Gallery photo 8" },
    { url: "/9.jpeg", alt: "Gallery photo 9" },
    { url: "/10.jpeg", alt: "Gallery photo 10" },
     
  ];

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0f1480 0%, #111890 50%, #0f1480 100%)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #d4ff00, transparent)",
        }}
      />

      <LightningBolt
        className="absolute top-20 left-10 animate-lightning"
        size={50}
        opacity={0.15}
      />
      <LightningBolt
        className="absolute bottom-20 right-10 animate-pulse-glow"
        size={35}
        opacity={0.15}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p
            className="reveal font-['Rajdhani'] tracking-[0.4em] text-sm uppercase mb-4"
            style={{ color: "#d4ff00", textShadow: "0 0 12px #d4ff0060" }}
          >
            Visual Highlights
          </p>
          <h2 className="reveal reveal-delay-1 font-['Rajdhani'] font-bold text-[clamp(2.5rem,5vw,4rem)] text-white leading-tight">
            THE{" "}
            <span
              style={{ color: "#d4ff00", textShadow: "0 0 20px #d4ff0050" }}
            >
              GALLERY
            </span>
          </h2>
        </div>

        {/* Grid teratur: 1 kolom di HP, 2 kolom di Tablet, 3 kolom di Desktop */}
        <div className="reveal grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((p, i) => (
            <div
              key={i}
              className="gallery-item relative overflow-hidden rounded-sm cursor-pointer transition-all duration-300 group aspect-[3/4]"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onClick={() => setLightbox(p.url)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "#d4ff0050";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <img
                src={p.url}
                alt={p.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: "rgba(15,20,128,0.5)" }}
              >
                <div
                  className="px-4 py-2 rounded-sm font-['Rajdhani'] tracking-widest text-xs uppercase"
                  style={{
                    background: "rgba(15,20,128,0.8)",
                    border: "1px solid #d4ff0050",
                    color: "#d4ff00",
                  }}
                >
                  View
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer backdrop-blur-md"
          style={{ background: "rgba(10,14,90,0.95)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-[#d4ff00] transition-colors font-['Rajdhani'] text-2xl"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox}
            alt="Fullscreen view"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-sm"
            style={{ border: "1px solid #d4ff0030" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

/* ─── Booking ─── */
/* ─── Booking ─── */
function Booking() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      }),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const eventTypes = ["Nightclubs & Bars", "Music Festivals", "Weddings", "Private Parties", "Corporate Events", "Birthday Bashes"];

  return (
    <section
      id="booking"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0f1480 0%, #0a0f70 100%)" }}
    >
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(to right, transparent, #d4ff00, transparent)" }} />

      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img
          src="bk.webp"
          alt="DJ performance"
          className="w-full h-full object-cover opacity-100 mix-blend-luminosity"
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, #1a22dd60 0%, #0f148090 60%, #080d60 100%)" }} />
      </div>

      {/* Glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #d4ff0006 0%, transparent 70%)" }} />
      </div>

      {/* Lightning */}
      <LightningBolt className="absolute top-16 left-16 animate-lightning" size={55} opacity={0.22} />
      <LightningBolt className="absolute top-24 right-24 animate-pulse-glow" size={40} opacity={0.18} />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="reveal font-['Rajdhani'] tracking-[0.4em] text-sm uppercase mb-4" style={{ color: "#d4ff00", textShadow: "0 0 12px #d4ff0060" }}>
          Get In Touch
        </p>
        <h2 className="reveal reveal-delay-1 font-['Rajdhani'] font-bold text-[clamp(2.5rem,6vw,5rem)] text-white leading-tight mb-4">
          BOOK <span style={{ color: "#d4ff00", textShadow: "0 0 24px #d4ff0060" }}>MBG</span>
        </h2>
        <p className="reveal reveal-delay-2 text-white/60 text-lg max-w-xl mx-auto mb-8">
          Ready to make your event unforgettable? We perform at all types of events — bring the energy, bring the crowd.
        </p>

        <div className="reveal reveal-delay-2 flex flex-wrap justify-center gap-3 mb-10">
          {eventTypes.map((t) => (
            <span
              key={t}
              className="px-4 py-2 rounded-sm font-['Rajdhani'] tracking-widest text-xs uppercase"
              style={{ background: "rgba(212,255,0,0.07)", border: "1px solid rgba(212,255,0,0.2)", color: "#d4ff00", backdropFilter: "blur(8px)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="reveal reveal-delay-3">
          <a
            href="https://wa.me/6285719303666?text=Halo%20MBG!%20Saya%20ingin%20memesan%20jasa%20Anda%20untuk%20acara%20saya.%20Tolong%20kirimkan%20jadwal%20ketersediaan%20dan%20daftar%20harganya"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon inline-flex items-center gap-4 px-10 py-5 text-white font-['Rajdhani'] font-bold text-xl tracking-[0.2em] uppercase rounded-sm hover:scale-105 transition-all duration-300"
            style={{ background: "#25D366", boxShadow: "0 0 30px rgba(37,211,102,0.4)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            BOOK VIA WHATSAPP
          </a> 
        </div>

        {/* Socials */}
        <div className="reveal reveal-delay-4 flex justify-center gap-6 mt-12">
          {[
            { 
              name: "Instagram", 
              color: "#E1306C", 
              href: "https://www.instagram.com/mbg.maribergoyanggembira?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==", 
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> 
            },
            { 
              name: "TikTok", 
              color: "#ffffff", 
              href: "https://www.tiktok.com/@officialmbg?_r=1&_t=ZS-98v3xK6bXhk", 
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.21 8.21 0 004.79 1.52V6.76a4.85 4.85 0 01-1.02-.07z" /></svg> 
            },
          ].map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-sm transition-all duration-300 hover:scale-110"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = s.color;
                el.style.color = s.color;
                el.style.boxShadow = `0 0 20px ${s.color}40`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.color = "rgba(255,255,255,0.5)";
                el.style.boxShadow = "none";
              }}
              aria-label={s.name}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ─── Footer ─── */
function Footer() {
  return (
    <footer
      className="relative py-12 px-6 overflow-hidden"
      style={{ background: "#080d60", borderTop: "1px solid rgba(212,255,0,0.12)" }}
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #d4ff0004 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="font-['Rajdhani'] font-bold text-2xl tracking-[0.3em]" style={{ color: "#d4ff00", textShadow: "0 0 12px #d4ff0080" }}>
                MBG
              </span>
            </div>
            <p className="font-['Rajdhani'] text-white/40 text-sm tracking-widest">MARI BERGOYANG GEMBIRA</p>
            <p className="text-white/30 text-xs mt-1 italic">"POSITIVE PIBES."</p>
          </div>

          <div className="opacity-25 hidden md:block">
            <Waveform bars={24} />
          </div>

          <div className="flex gap-6 text-xs font-['Rajdhani'] tracking-widest uppercase text-white/30">
            {["Home", "About", "Schedule", "Gallery", "Booking"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#d4ff00] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-white/20 text-xs font-['Rajdhani'] tracking-widest">
            © 2026 BENG — Mari Bergoyang Gembira. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/20 text-xs font-['Rajdhani'] tracking-widest">
            <LightningBolt size={10} opacity={0.5} />
            <span>FEEL THE BEAT. MOVE THE NIGHT.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Floating WhatsApp ─── */
function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {hovered && (
        <div
          className="px-4 py-2 rounded-sm font-['Rajdhani'] tracking-widest text-xs uppercase whitespace-nowrap animate-slide-up"
          style={{ background: "rgba(15,20,128,0.9)", border: "1px solid rgba(37,211,102,0.4)", color: "white", backdropFilter: "blur(12px)", boxShadow: "0 0 20px rgba(37,211,102,0.3)" }}
        >
          Book MBG
        </div>
      )}
      <a
        href="[https://wa.me/6285719303666?text=Halo%20MBG!%20Saya%20ingin%20memesan%20jasa%20Anda%20untuk%20acara%20saya.%20Tolong%20kirimkan%20jadwal%20ketersediaan%20dan%20daftar%20harganya]."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.5)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Book MBG via WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

/* ─── Root ─── */
export default function App() {
  return (
    <div className="min-h-screen text-white" style={{ background: "#0f1480" }}>
      <Navbar />
      <Hero />
      <About />
      <Schedule />
      <Gallery />
      <Booking />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
