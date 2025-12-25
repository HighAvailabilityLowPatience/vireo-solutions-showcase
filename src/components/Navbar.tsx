import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "What We Do", href: "#what-we-do" },
    { name: "Business Solutions", href: "/business-solutions" },
    { name: "Crafted by VVS", href: "/solutions" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/" + href);
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Vireo Vitalis Solutions" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith("#")) {
                  e.preventDefault();
                  scrollToSection(link.href);
                }
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="border-border">
                Admin
              </Button>
            </Link>
          )}
          {user ? (
            <span className="text-sm text-muted-foreground">{user.email}</span>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
          )}
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="#contact">Contact Us</a>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border">
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }
                  }}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-border" />
              {isAdmin && (
                <Link to="/admin" className="text-lg font-medium text-foreground">
                  Admin
                </Link>
              )}
              {user ? (
                <span className="text-sm text-muted-foreground">{user.email}</span>
              ) : (
                <Link to="/auth" className="text-lg font-medium text-foreground">
                  Sign In
                </Link>
              )}
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                <a href="#contact">Contact Us</a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
