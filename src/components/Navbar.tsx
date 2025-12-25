import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
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
        <nav className="hidden md:flex items-center gap-2">
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
              className="group relative px-4 py-2 text-sm font-medium text-muted-foreground 
                border border-primary/20 rounded-full 
                bg-background/50 backdrop-blur-sm
                hover:text-foreground hover:border-primary/50 
                hover:shadow-[0_0_20px_hsl(258_89%_66%/0.3)]
                hover:bg-primary/5
                transition-all duration-300
                before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 
                before:w-0 before:h-[2px] before:rounded-full
                before:bg-gradient-to-r before:from-primary before:via-purple-400 before:to-primary
                before:transition-all before:duration-300 
                hover:before:w-2/3"
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  {user.email}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
          )}
          <Button 
            asChild 
            className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] text-primary-foreground border border-primary/30 shadow-[0_0_20px_hsl(258_89%_66%/0.4)] hover:bg-[position:100%_0] hover:shadow-[0_0_30px_hsl(258_89%_66%/0.6)] transition-all duration-500"
          >
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
            <nav className="flex flex-col gap-4 mt-8">
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
                  className="relative px-4 py-3 text-lg font-medium text-foreground 
                    border-l-2 border-primary/30 
                    bg-gradient-to-r from-primary/5 to-transparent
                    hover:border-primary hover:from-primary/15 hover:to-primary/5
                    hover:shadow-[inset_0_0_20px_hsl(258_89%_66%/0.1)]
                    transition-all duration-300"
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
                <>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  <Button 
                    variant="ghost" 
                    onClick={() => signOut()} 
                    className="text-lg font-medium text-foreground justify-start p-0 h-auto"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" className="text-lg font-medium text-foreground">
                  Sign In
                </Link>
              )}
              <Button 
                className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] text-primary-foreground border border-primary/30 shadow-[0_0_20px_hsl(258_89%_66%/0.4)] hover:bg-[position:100%_0] hover:shadow-[0_0_30px_hsl(258_89%_66%/0.6)] transition-all duration-500 w-full"
              >
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
