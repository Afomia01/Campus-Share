import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { ArrowRight, Share2, Shield, Zap, Globe, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

// --- UI Components ---

const Button = ({ children, className, variant = "primary" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
        ${
          variant === "primary"
            ? "bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            : "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm"
        }
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

const Spotlight = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-white/10 bg-gray-900/50 overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

// --- Sections ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
    <div className="flex items-center gap-3">
      <img
        src="/campus-share.png"
        alt="CampusShare Logo"
        className="h-16 w-auto object-contain"
      />
      <span className="font-bold text-xl tracking-tight text-white">
        Campus Share
      </span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
      <a href="#features" className="hover:text-white transition-colors">
        Features
      </a>
      <a href="#showcase" className="hover:text-white transition-colors">
        Showcase
      </a>
      <a href="#about" className="hover:text-white transition-colors">
        About
      </a>
    </div>
    <div className="flex items-center gap-4">
      <Link
        to="/login"
        className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
      >
        Log in
      </Link>
      <Button variant="secondary" className="px-5 py-2 text-xs">
        <Link to="/register">Get Started</Link>
      </Button>
    </div>
  </nav>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6">
            v2.0 is now live
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-gradient">
            Knowledge has no <br /> boundaries.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A decentralized academic resource sharing platform designed for the
            modern university ecosystem. Fast, secure, and open.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
              Start Exploring <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Abstract UI Representation */}
      <motion.div
        style={{ y: y1, rotateX: 15 }}
        className="mt-24 relative w-full max-w-6xl perspective-1000"
      >
        <div className="relative rounded-xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9]">
          {/* Mock UI Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          {/* Mock UI Body */}
          <div className="p-8 grid grid-cols-12 gap-6 h-full">
            <div className="col-span-3 space-y-4">
              <div className="h-8 w-3/4 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
              <div className="mt-8 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-full bg-white/5 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="col-span-9 space-y-6">
              <div className="h-64 w-full bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5 p-6 flex items-end">
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-white/10 rounded" />
                  <div className="h-4 w-96 bg-white/5 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-white/5 rounded-xl border border-white/5"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, className }) => (
  <Spotlight className={`p-8 flex flex-col h-full ${className}`}>
    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 text-white">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </Spotlight>
);

const Features = () => {
  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Engineered for <br />{" "}
            <span className="text-gray-500">academic excellence.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Share2}
            title="Peer-to-Peer Sharing"
            description="Directly share resources with students across departments without centralized bottlenecks."
            className="md:col-span-2"
          />
          <FeatureCard
            icon={Shield}
            title="Verified Content"
            description="Community-driven verification ensures that only high-quality, relevant materials rise to the top."
          />
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Optimized for speed with a Go backend and edge caching for instant resource retrieval."
          />
          <FeatureCard
            icon={Globe}
            title="Universal Access"
            description="Accessible from any device, anywhere. Your campus resources in your pocket."
            className="md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
};

const Showcase = () => {
  return (
    <section id="showcase" className="py-32 px-6 bg-white/2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <h2 className="text-3xl md:text-5xl font-bold">The Dashboard</h2>
          <p className="text-gray-400 max-w-md mt-4 md:mt-0">
            A sneak peek into the interface your friend is building. Clean,
            intuitive, and data-rich.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10" />

          {/* Placeholder for Screenshot */}
          <div className="aspect-[16/10] w-full bg-gray-900 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />

            <div className="z-20 text-center p-8">
              <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20">
                <BookOpen size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Resource Hub
              </h3>
              <p className="text-gray-400">
                Centralized management for all your study materials
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-gray-500 text-sm">
        © 2025 CampusShare. Open Source.
      </div>
      <div className="flex gap-6">
        <a
          href="#"
          className="text-gray-500 hover:text-white transition-colors"
        >
          GitHub
        </a>
        <a
          href="#"
          className="text-gray-500 hover:text-white transition-colors"
        >
          Twitter
        </a>
        <a
          href="#"
          className="text-gray-500 hover:text-white transition-colors"
        >
          Discord
        </a>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="bg-[#030712] text-white selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Footer />
    </div>
  );
}
