import Link from "next/link";
import { 
  Heart,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaGithub 
} from "react-icons/fa";

import Container from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/careers", label: "Careers" },
  { href: "/blogs", label: "Blog & News" },
  { href: "/terms", label: "Terms of Service" },
];

const supportLinks = [
  { href: "/help", label: "Help Center" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Support Contact" },
];

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-600 dark:hover:text-blue-400" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-sky-500 dark:hover:text-sky-400" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-600 dark:hover:text-pink-400" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-700 dark:hover:text-blue-400" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub", color: "hover:text-zinc-950 dark:hover:text-zinc-300" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-zinc-50/50 dark:bg-zinc-950/20 py-12 transition-all duration-300">
      <Container>
        {/* Top Section: Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-border/40">
          
          {/* Logo and Description */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mt-2">
              Discover, rent, and list properties with confidence. RentNest makes property management and searching easy, transparent, and efficient.
            </p>
            {/* Contact details */}
            <div className="flex flex-col gap-2 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>123 RentNest St, Suite 456, Real Estate City</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>info@rentnest.com</span>
              </div>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-sm font-bold tracking-wider uppercase text-foreground">
              Quick Links
            </span>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-sm font-bold tracking-wider uppercase text-foreground">
              Company
            </span>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-sm font-bold tracking-wider uppercase text-foreground">
              Support
            </span>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
          
          {/* Copyright text */}
          <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span>&copy; {new Date().getFullYear()} RentNest. All rights reserved.</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1 group cursor-default">
              Made with 
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 group-hover:scale-125 group-hover:animate-pulse transition-all duration-300" /> 
              in Dhaka
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => {
              const IconComp = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`text-muted-foreground transition-all duration-300 hover:scale-115 ${social.color}`}
                >
                  <IconComp className="h-5 w-5" />
                </a>
              );
            })}
          </div>

        </div>
      </Container>
    </footer>
  );
}

export default Footer;
