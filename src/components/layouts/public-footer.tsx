import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/constants/routes";

// =============================================================================
// Public Footer — Matches Stitch design footer
// =============================================================================

const footerLinks = {
  platform: {
    title: "PLATFORM",
    links: [
      { label: "Q-Bank", href: ROUTES.SUBJECTS },
      { label: "Study Guides", href: "#" },
      { label: "Pricing", href: ROUTES.PRICING },
    ],
  },
  legal: {
    title: "LEGAL",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
  support: {
    title: "SUPPORT",
    links: [
      { label: "Contact Support", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
};

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className }: PublicFooterProps) {
  return (
    <footer
      className={cn(
        "bg-primary text-primary-foreground",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <Logo size="lg" className="[&_span]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70" />
            <p className="text-sm text-primary-foreground/70 mt-3 leading-relaxed">
              Precision Practice Performance. Your ultimate medical entrance exam
              companion.
            </p>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} MDCAT in Second. Precision Practice
            Performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
