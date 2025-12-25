import { Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <img src={logo} alt="Vireo Vitalis Solutions" className="h-12 w-auto opacity-80" />

          {/* Company Name & Contact */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <h3 className="text-sm font-semibold text-foreground">Vireo Vitalis Solutions</h3>
            <a
              href="mailto:support@vireovitalis.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              support@vireovitalis.com
            </a>
          </div>
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
