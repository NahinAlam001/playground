
import { Cpu } from 'lucide-react';
import Link from 'next/link';

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? 5 : size === "md" ? 6 : 8;
  const textSize = size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl";

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Cpu className={`h-${iconSize} w-${iconSize} text-primary group-hover:text-accent transition-colors`} />
      <span className={`font-bold ${textSize} text-foreground group-hover:text-accent transition-colors`}>
        Profile Forge
      </span>
    </Link>
  );
}
