import { IconSparklesThree } from "@intentui/icons";
import { Code, Globe, Palette, Shield, Zap } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Code,
      title: "Developer First",
      description:
        "Built with modern web technologies. Full TypeScript support, API-first architecture, and extensive documentation.",
    },
    {
      icon: Palette,
      title: "Beautiful Templates",
      description:
        "Professionally designed templates that adapt to your brand. Customizable themes and layouts for any project type.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized for performance with edge deployment. Your showcases load instantly anywhere in the world.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with automatic SSL certificates. 99.9% uptime guarantee with global CDN.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Deploy globally with one click. Automatic optimization for different regions and devices.",
    },
    {
      icon: IconSparklesThree,
      title: "AI-Powered",
      description:
        "Smart suggestions for your content. Automatic SEO optimization and performance recommendations.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-3xl">
            Everything you need to showcase your work
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed for modern developers and creators
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="relative group">
              <div className="flex flex-col items-start p-6 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
