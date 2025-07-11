import { CTA } from "@/components/cta";
import { FAQ } from "@/components/faq";
import { Features } from "@/components/feature";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
import { SocialProof } from "@/components/social";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <SocialProof />
      <FAQ />
      <CTA />
    </main>
  );
}
