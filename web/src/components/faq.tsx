"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does w3show work?",
      answer:
        "w3show provides a simple platform to create beautiful project showcases. Upload your projects, customize with our templates, and share with the world. It's that simple.",
    },
    {
      question: "Can I use my own domain?",
      answer:
        "Yes! All plans include custom domain support. You can connect your own domain or use our free subdomain.",
    },
    {
      question: "What kind of projects can I showcase?",
      answer:
        "Any type of project! Web applications, mobile apps, designs, art, writing, videos, and more. Our templates are flexible and support various media types.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes, our Starter plan is completely free and includes up to 3 projects, basic templates, and community support.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time. No long-term contracts or hidden fees.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about w3show
          </p>
        </div>

        <div className="mt-16 mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span className="font-medium text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
