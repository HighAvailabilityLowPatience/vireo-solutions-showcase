import { Cloud, Sparkles, Code } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Cloud,
    title: "Cloud Strategy",
    description:
      "Seamless cloud migration, architecture design, and optimization to modernize your infrastructure and reduce costs.",
  },
  {
    icon: Sparkles,
    title: "Digital Transformation",
    description:
      "Reimagine your workflows and business processes with cutting-edge technology solutions that drive efficiency.",
  },
  {
    icon: Code,
    title: "Custom Development",
    description:
      "Bespoke software solutions tailored precisely to your unique business requirements and growth objectives.",
  },
];

const WhatWeDoSection = () => {
  return (
    <section id="what-we-do" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What We Do
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We partner with businesses to deliver innovative technology solutions
            that transform operations and accelerate growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="p-8 bg-card border-border hover:border-primary/50 hover:-translate-y-2 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
