"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlusCircle, Sparkles } from "lucide-react";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 lg:p-16 text-white shadow-2xl shadow-blue-500/20"
        >
          {/* Decorative background circles/glows */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

          {/* Dotted pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm border border-white/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Start Your Journey Today</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
            >
              Ready to Find Your Dream Home?
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl"
            >
              Whether you are looking for your next apartment or want to list your rental property for thousands of verified renters, RentNest is here for you.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-2"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer py-6 px-8 text-base group"
              >
                <Link href="/properties" className="flex items-center justify-center gap-2">
                  <span>Browse Properties</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer py-6 px-8 text-base group"
              >
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span>List Property</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
