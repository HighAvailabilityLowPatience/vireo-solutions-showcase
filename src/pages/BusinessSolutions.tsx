import { Globe, Cloud, Users, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Globe,
    title: "Website Redesigns",
    description:
      "Transform your digital presence with modern, responsive, and conversion-optimized website designs that captivate your audience.",
    features: ["UX/UI Design", "Mobile-First Approach", "Performance Optimization", "SEO Integration"],
  },
  {
    icon: Cloud,
    title: "Cloud Migrations",
    description:
      "Seamlessly migrate your infrastructure to the cloud with zero downtime and maximum security, unlocking scalability and cost savings.",
    features: ["AWS, Azure, GCP", "Data Migration", "Security Hardening", "Cost Optimization"],
  },
  {
    icon: Users,
    title: "Bespoke IT Consulting",
    description:
      "Strategic technology guidance tailored to your business goals, helping you navigate complex decisions with confidence.",
    features: ["Technology Audits", "Roadmap Planning", "Vendor Selection", "Risk Assessment"],
  },
  {
    icon: Lightbulb,
    title: "Digital Strategy",
    description:
      "Develop a comprehensive digital strategy that aligns technology investments with business objectives for maximum ROI.",
    features: ["Digital Maturity Assessment", "Innovation Workshops", "KPI Development", "Change Management"],
  },
];

const BusinessSolutions = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Business Solutions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive IT services designed to accelerate your digital transformation
            and drive sustainable business growth.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6 flex-1">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-6 bg-card border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Let's discuss how our solutions can help you achieve your technology goals
            and drive meaningful business outcomes.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 gap-2"
          >
            Schedule a Consultation
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessSolutions;
