import { Globe, Star, Users } from "lucide-react";

export function SocialProof() {
  const testimonials = [
    {
      content:
        "w3show transformed how I present my work. The templates are beautiful and the platform is incredibly easy to use.",
      author: "Sarah Chen",
      role: "Frontend Developer",
      company: "Vercel",
    },
    {
      content:
        "Finally, a platform that understands developers. The API-first approach and TypeScript support are game-changers.",
      author: "Marcus Rodriguez",
      role: "Full Stack Developer",
      company: "Stripe",
    },
    {
      content:
        "Our team uses w3show for all client presentations. It's professional, fast, and our clients love the experience.",
      author: "Emma Thompson",
      role: "Design Director",
      company: "Figma",
    },
  ];

  return (
    <section className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by developers worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers who showcase their work with w3show
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                &quot;{testimonial.content}&quot;
              </p>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>10,000+ developers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>150+ countries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
