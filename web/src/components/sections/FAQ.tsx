import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../Reveal";
import { Icon } from "../ui/Icon";
import { faqs } from "../../data/content";

function FaqItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!bodyRef.current || !innerRef.current) return;
      const height = innerRef.current.offsetHeight;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(bodyRef.current, { height: isOpen ? height : 0 });
        gsap.set(innerRef.current, { opacity: isOpen ? 1 : 0, y: 0 });
        return;
      }

      gsap.to(bodyRef.current, {
        height: isOpen ? height : 0,
        duration: 0.45,
        ease: "power3.inOut",
      });
      gsap.to(innerRef.current, {
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : -6,
        duration: 0.35,
        ease: "power2.out",
        delay: isOpen ? 0.08 : 0,
      });
    },
    { dependencies: [isOpen] }
  );

  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${isOpen ? "border-dice-blue/30 bg-white shadow-[0_22px_60px_-30px_rgba(0,102,255,0.35)] dark:border-dice-cyan/30 dark:bg-white/10 dark:shadow-[0_22px_60px_-30px_rgba(0,0,0,0.5)]" : "border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-white/5"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
      >
        <span className="font-display text-base font-semibold text-dice-ink dark:text-white sm:text-lg">{question}</span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen ? "rotate-180 border-dice-blue bg-dice-blue text-white" : "border-slate-200 text-slate-500 dark:border-white/15 dark:text-slate-400"
          }`}
        >
          <Icon name="chevron" className="h-4 w-4" />
        </span>
      </button>
      <div ref={bodyRef} className="h-0 overflow-hidden px-5 sm:px-7">
        <div ref={innerRef} className="pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[0.95rem]">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28 lg:py-32">
      <Container className="mx-auto flex max-w-3xl flex-col gap-12 sm:gap-16">
        <SectionHeading
          title="Questions? We've Got Answers"
          subtitle="Everything you need to know about getting connected, staying secure, and managing your plan."
        />

        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 0.05}>
              <FaqItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
