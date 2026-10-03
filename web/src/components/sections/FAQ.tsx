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
    <div className="border-b border-slate-200 dark:border-white/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
      >
        <span className="font-display text-[0.98rem] font-semibold text-dice-navy dark:text-white sm:text-[1.05rem]">{question}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen ? "rotate-180 bg-dice-accent text-white" : "bg-dice-sky text-dice-accent dark:bg-white/6 dark:text-dice-cyan"
          }`}
        >
          <Icon name="chevron" className="h-4 w-4" />
        </span>
      </button>
      <div ref={bodyRef} className="h-0 overflow-hidden">
        <div ref={innerRef} className="max-w-2xl pb-6 pr-12 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[0.95rem]">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-16 py-12 sm:py-14 lg:py-16">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <SectionHeading
          title="Questions? We've got answers"
          subtitle="Everything you need to know about getting connected and managing your pass."
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <Reveal stagger className="flex flex-col border-t border-slate-200 dark:border-white/10">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
            />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
