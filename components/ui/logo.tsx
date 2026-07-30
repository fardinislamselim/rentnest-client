import Link from "next/link";
import { House } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function Logo({ className, iconClassName, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 transition-all duration-300 select-none",
        className
      )}
    >
      {/* Icon Container with Glassy Blue Gradient / Shadow */}
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-100/50 dark:border-blue-900/30 shadow-sm shadow-blue-100/20 dark:shadow-none group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors duration-300">
        {/* Soft pulsing background glow on hover */}
        <div className="absolute inset-0 rounded-xl bg-blue-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* House Icon */}
        <House
          className={cn(
            "h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 relative z-10",
            iconClassName
          )}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <span className="font-heading text-xl font-bold tracking-tight flex items-center">
          <span className="text-foreground transition-colors duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            Rent
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent transition-all duration-300">
            Nest
          </span>
          {/* A small accent dot after the text */}
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 ml-0.5 group-hover:scale-125 transition-transform duration-300" />
        </span>
      )}
    </Link>
  );
}

export default Logo;
