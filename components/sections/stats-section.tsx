"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Building2, Users, MapPin, Smile } from "lucide-react";
import Container from "@/components/layout/container";

const STATS = [
  {
    value: "10K+",
    label: "Properties",
    description: "Verified rental homes & spaces",
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
  },
  {
    value: "5K+",
    label: "Happy Tenants",
    description: "Living in their dream rentals",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
    bgLight: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400",
  },
  {
    value: "250+",
    label: "Cities",
    description: "Across all major divisions",
    icon: MapPin,
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
  },
  {
    value: "98%",
    label: "Satisfaction",
    description: "Positive landlord & tenant reviews",
    icon: Smile,
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function StatsSection() {
  return (
    <section className="py-12 lg:py-16 bg-muted/30 border-y border-border/40 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-48 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 blur-3xl pointer-events-none" />

      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        >
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-background/80 dark:bg-zinc-900/80 border border-border/60 shadow-sm hover:shadow-lg hover:border-blue-500/30 backdrop-blur-sm transition-all duration-300"
              >
                {/* Icon & Glow */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgLight} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Live Stat
                  </span>
                </div>

                {/* Number & Label */}
                <div>
                  <h3 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </h3>
                  <p className="text-base font-bold text-foreground mt-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
