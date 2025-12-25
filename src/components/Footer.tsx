import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Company Name */}
          <h3 className="text-sm font-semibold text-foreground">Vireo Vitalis Solutions</h3>

          {/* Contact */}
          <a
            href="mailto:support@vireovitalis.com"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            support@vireovitalis.com
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vireo Vitalis Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
