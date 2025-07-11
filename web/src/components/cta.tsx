import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to showcase your work?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers who trust w3show with their portfolios
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View examples
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
  );
}
