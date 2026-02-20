"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  MapPin,
  GraduationCap,
  Globe,
  Heart,
  MessageSquare,
  Search
} from "lucide-react";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="flex flex-col items-center bg-black text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[95vh] w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=1974&auto=format&fit=crop"
            alt="Artistic background"
            className="w-full h-full object-cover opacity-30 scale-105"
          />
        </motion.div>

        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
          </span>
          Official Platform for AAU Students
        </motion.div>

        <motion.h1
          className="max-w-5xl text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          {...fadeIn}
        >
          THE NEXT PHASE OF <br />
          <span className="text-gray-500 italic">AAU EXCELLENCE</span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-2xl text-base text-gray-400 sm:text-lg font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Bridging the gap between freshman curiosity and senior expertise across all Addis Ababa University campuses.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link href="/sign-up">
            <Button size="lg" className="group h-16 px-10 text-sm bg-white text-black hover:bg-gray-200 transition-all duration-300 rounded-full font-bold tracking-widest flex items-center justify-center">
              JOIN THE CIRCLE
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/blogs">
            <Button size="lg" className="h-16 px-10 text-sm bg-black text-white border border-white/20 hover:bg-white/5 rounded-full font-bold tracking-widest backdrop-blur-md flex items-center justify-center transition-all">
              EXPLORE STORIES
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Campus Connections Section - NEW */}
      <section className="w-full py-32 px-4 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center justify-center mb-20 gap-8">
            <div className="w-full">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mx-auto">ONE HUB. <br />SIX MILES APART.</h2>
              <p className="mt-6 text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                Whether you're in the tech labs of 5-Kilo, the historic halls of 6-Kilo, or the medical wards of Black Lion, your academic support network is now unified.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono text-gray-600">
              <span className="h-px w-20 bg-gray-800"></span>
              EST. 2026 / AAU
              <span className="h-px w-20 bg-gray-800"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { name: "6-Kilo (Main)", icon: MapPin, desc: "Arts, Social Sciences, and Law" },
              { name: "5-Kilo (AAiT)", icon: Globe, desc: "Technology and Engineering" },
              { name: "4-Kilo (CNCS)", icon: Search, desc: "Natural and Computational Sciences" }
            ].map((campus, i) => (
              <motion.div
                key={i}
                className="group relative p-10 bg-black border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden"
                {...fadeIn}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <campus.icon size={80} />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{campus.name}</h3>
                <p className="text-gray-500 font-light">{campus.desc}</p>
                <div className="mt-8 h-1 w-0 bg-white group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Masterpiece Stats Section */}
      <section className="w-full py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.02)_0%,_transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
            {[
              { label: "Active Mentors", value: "250+", sub: "EXPERTS READY" },
              { label: "Study Resources", value: "1.2k", sub: "CURATED FILES" },
              { label: "AAU Communities", value: "45+", sub: "ACTIVE HUBS" },
              { label: "Success Rate", value: "94%", sub: "STUDENT GROWTH" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center justify-center group relative px-8"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                {/* Visual Accent */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-white/20 group-hover:h-12 transition-all duration-700" />

                <span className="text-5xl md:text-6xl font-black tracking-tighter text-white transition-all duration-500 group-hover:scale-105 group-hover:text-gray-300">
                  {stat.value}
                </span>

                <div className="mt-4 flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white whitespace-nowrap">
                    {stat.label}
                  </span>
                  <div className="h-px w-8 bg-white/20 my-3 group-hover:w-16 transition-all duration-500" />
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest leading-none">
                    {stat.sub}
                  </span>
                </div>

                {/* Vertical Divider for Desktop */}
                {i < 3 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Masterpiece Features Section */}
      <section className="w-full py-40 px-4 bg-black relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              {
                num: "01",
                icon: Users,
                title: "ELITE MENTORSHIP",
                desc: "Get direct access to top-performing seniors who have mastered the AAU curriculum. Real-world insights, not just theory."
              },
              {
                num: "02",
                icon: BookOpen,
                title: "CURATED VAULT",
                desc: "Digital library of AAU past exams, lecture notes, and department-specific guides that you won't find anywhere else."
              },
              {
                num: "03",
                icon: Trophy,
                title: "EXAM SIMULATOR",
                desc: "Adaptive practice tests modeled after AAU's rigorous examination style. Know where you stand before the final day."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="group relative p-12 bg-zinc-950/50 border border-white/5 hover:border-white/20 transition-all duration-700 overflow-hidden flex flex-col items-center text-center"
              >
                {/* Background Number Accent */}
                <span className="absolute -right-4 -top-8 text-[120px] font-black text-white/[0.02] group-hover:text-white/[0.05] transition-all duration-700 pointer-events-none">
                  {feature.num}
                </span>

                <div className="mb-10 relative">
                  <div className="h-16 w-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white group-hover:border-white transition-all duration-500 transform group-hover:-rotate-12">
                    <feature.icon className="h-6 w-6 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-6 w-6 border-r border-b border-white/20 group-hover:border-white transition-colors" />
                </div>

                <h3 className="text-2xl font-bold tracking-[0.2em] mb-6 uppercase text-white group-hover:tracking-[0.3em] transition-all duration-500">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-relaxed font-light text-sm max-w-xs group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>

                <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-[10px] font-mono tracking-[0.5em] text-white">RESERVE ACCESS</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Voices Section - NEW */}
      <section className="w-full py-32 px-4 bg-[#050505]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 uppercase">Student Heartbeat</h2>
            <div className="h-1 w-20 bg-white mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Semhar G.",
                dept: "Software Engineering, 5-Kilo",
                text: "Finding a senior mentor through this platform made my transition to university so much smoother. I knew exactly what to prioritize from week one."
              },
              {
                name: "Yohannes B.",
                dept: "Economics, 6-Kilo",
                text: "The past exam vault is a goldmine. It's organized by course code, which makes studying for AAU midterms ten times more efficient."
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="p-10 border border-white/5 bg-white/5 relative"
                {...fadeIn}
              >
                <div className="absolute -top-4 -left-4 text-white/10">
                  <MessageSquare size={48} />
                </div>
                <p className="text-lg italic text-gray-300 mb-6 font-light">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 font-mono">{testimonial.dept}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Masterpiece Final CTA Section */}
      <section className="w-full py-60 px-4 bg-black relative overflow-hidden">
        {/* Artistic Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_70%)] pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <motion.div
            className="flex flex-col items-center text-center"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-12 flex flex-col items-center">
              <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-white mb-8" />
              <span className="text-[10px] font-mono tracking-[0.6em] text-white/40 uppercase mb-4">Final Call</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 max-w-5xl leading-[0.9] text-white group uppercase">
              SHAPE THE <span className="text-gray-500 italic">FUTURE</span> OF <br />
              ADDIS ABABA UNIVERSITY
            </h2>

            <p className="mt-8 text-gray-400 max-w-xl text-lg font-light tracking-wide uppercase leading-relaxed">
              Experience the convergence of heritage and <br />
              academic innovation. Join the elite circle.
            </p>

            <div className="mt-16 flex flex-col sm:flex-row gap-8 items-center justify-center w-full">
              <Link href="/dashboard/apply" className="w-full sm:w-auto">
                <Button className="h-20 px-12 bg-black text-white border border-white hover:bg-white hover:text-black transition-all duration-500 rounded-none font-bold tracking-[0.3em] text-[10px] w-full min-w-[280px]">
                  APPLY AS MENTOR
                </Button>
              </Link>
              <div className="hidden sm:block h-px w-12 bg-white/10" />
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button className="h-20 px-12 bg-white text-black hover:bg-gray-200 transition-all duration-500 rounded-none font-bold tracking-[0.3em] text-[10px] w-full min-w-[280px]">
                  JOIN AS MENTEE
                </Button>
              </Link>
            </div>

            <div className="mt-24 h-20 w-[1px] bg-gradient-to-t from-transparent via-white/20 to-white" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
