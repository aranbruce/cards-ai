import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { CategoryConfig } from "@/lib/category-pages"

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function CardVisual({ config }: { config: CategoryConfig }) {
  return (
    <div className="relative grid min-h-[460px] place-items-center">
      {/* Back card 2 */}
      <div
        className="absolute overflow-hidden rounded-lg shadow-[0_14px_28px_-14px_rgba(20,14,6,0.16)]"
        style={{
          width: 212,
          height: 288,
          opacity: 0.85,
          transform: "rotate(7deg) translate(62px, 8px)",
          background: config.backGradient2,
        }}
      />
      {/* Back card 1 */}
      <div
        className="absolute overflow-hidden rounded-lg shadow-[0_14px_28px_-14px_rgba(20,14,6,0.16)]"
        style={{
          width: 236,
          height: 322,
          opacity: 0.92,
          transform: "rotate(-9deg) translate(-58px, 18px)",
          background: config.backGradient1,
        }}
      />
      {/* Front card */}
      <div
        className="relative z-10 overflow-hidden rounded-lg bg-[#fdfaf4]"
        style={{
          width: 300,
          height: 408,
          boxShadow:
            "0 40px 80px -36px rgba(20,14,6,0.34), 0 14px 28px -14px rgba(20,14,6,0.16)",
        }}
      >
        <div
          className="absolute top-4 right-4 left-4 overflow-hidden rounded-[5px]"
          style={{ bottom: 96 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: config.frontGradient }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(135deg, transparent 0 14px, rgba(0,0,0,0.045) 14px 15px)",
            }}
          />
        </div>
        <div
          className="absolute inset-x-0 bottom-6 px-5 text-center text-[23px] font-medium tracking-[-0.01em] text-[#1a1611]"
          style={{ lineHeight: 1.2 }}
        >
          {config.cardTitle}
        </div>
      </div>

      {/* Signature float 1 — top right */}
      <div
        className="absolute top-[34px] right-[-26px] z-20 flex items-center gap-[9px] rounded-xl border border-border bg-card px-3 py-2 text-xs"
        style={{ boxShadow: "0 18px 36px -18px rgba(20,14,6,0.32)" }}
      >
        <span
          className="size-5 shrink-0 rounded-full"
          style={{ background: config.sigFloat1.color }}
        />
        <div>
          <div className="font-medium">{config.sigFloat1.count}</div>
          <div className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
            {config.sigFloat1.recency}
          </div>
        </div>
      </div>

      {/* Signature float 2 — bottom left */}
      <div
        className="absolute bottom-[60px] left-[-34px] z-20 flex items-center gap-[9px] rounded-xl border border-border bg-card px-3 py-2"
        style={{ boxShadow: "0 18px 36px -18px rgba(20,14,6,0.32)" }}
      >
        <span
          className="size-5 shrink-0 rounded-full"
          style={{ background: config.sigFloat2.color }}
        />
        <div className="text-sm leading-tight">
          <div>{config.sigFloat2.note}</div>
          <div className="text-xs text-muted-foreground">
            {config.sigFloat2.name}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CategoryLandingPage({ config }: { config: CategoryConfig }) {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-x-12 px-6 md:px-15 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.15em] text-brand uppercase">
              {config.badge}
            </p>
            <h1 className="mt-5 text-4xl leading-[0.95] font-semibold tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl">
              {config.h1Line1}
              <br />
              <span className="text-muted-foreground">{config.h1Muted}</span>
              <br />
              <span className="text-brand">{config.h1Pop}</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-muted-foreground">
              {config.lede}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/create">
                  {config.ctaText}
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    Free
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <CardVisual config={config} />
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {/* TODO: Add gallery */}
      {/* <section id="examples" className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-15">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.15em] text-brand uppercase">
              {config.galleryEyebrow}
            </p>
            <h2 className="mt-4 text-3xl leading-[1.02] font-semibold tracking-[-0.03em] md:text-4xl lg:text-5xl">
              {config.galleryTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {config.gallerySub}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {config.gallery.map((item, i) => (
              <article key={i}>
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-card">
                  <div
                    className="absolute inset-0"
                    style={{ background: item.gradient }}
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium">
                    {item.pill}
                  </span>
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 backdrop-blur-sm">
                    <span className="text-xs font-medium">{item.forText}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.sigCount}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm font-medium">{item.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {item.subtitle}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section> */}

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-15">
          <p className="font-mono text-[11px] tracking-[0.15em] text-brand uppercase">
            How it works
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl leading-[1.02] font-semibold tracking-[-0.03em] md:text-4xl lg:text-5xl">
            {config.howTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {config.howSub}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {config.steps.map((step) => (
              <div key={step.n}>
                <div className="font-mono text-sm text-muted-foreground/60">
                  {step.n}
                </div>
                <h3 className="mt-2 text-lg font-semibold tracking-[-0.015em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-15">
          <p className="font-mono text-[11px] tracking-[0.15em] text-brand uppercase">
            {config.usesEyebrow}
          </p>
          <h2 className="mt-4 text-3xl leading-[1.02] font-semibold tracking-[-0.03em] md:text-4xl lg:text-5xl">
            {config.usesTitle}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {config.uses.map((use, i) => (
              <Link
                key={i}
                href="/create"
                className="block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="mb-3 grid size-10 place-items-center rounded-lg text-lg leading-none"
                  style={{ background: use.color }}
                  aria-hidden
                >
                  {use.emoji}
                </div>
                <h3 className="text-sm font-semibold tracking-[-0.015em]">
                  {use.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {use.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-15">
          <p className="font-mono text-[11px] tracking-[0.15em] text-brand uppercase">
            {config.faqEyebrow}
          </p>
          <h2 className="mt-4 text-3xl leading-[1.02] font-semibold tracking-[-0.03em] md:text-4xl lg:text-5xl">
            {config.faqTitle}
          </h2>
          <div className="mt-10">
            {config.faqs.map((faq, i) => (
              <details key={i} className="group border-b border-border py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium tracking-[-0.015em]">
                  {faq.q}
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border transition-transform group-open:rotate-45 group-open:border-foreground group-open:bg-foreground group-open:text-background">
                    <PlusIcon />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RELATED CATEGORIES ===== */}
      {/* TODO: Add related categories */}
      {/* <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-15">
          <p className="font-mono text-[11px] tracking-[0.15em] text-brand uppercase">
            More occasions
          </p>
          <h2 className="mt-4 text-3xl leading-[1.02] font-semibold tracking-[-0.03em] md:text-4xl lg:text-5xl">
            Not a {config.label.toLowerCase().replace(" cards", "")}? We&apos;ve
            got the rest
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The same one-link, everyone-signs flow works for every occasion
            worth marking
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {otherCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/browse/${cat.slug}`}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="aspect-video w-full"
                  style={{ background: cat.frontGradient }}
                />
                <div className="p-4">
                  <h3 className="text-base font-medium tracking-[-0.02em]">
                    {cat.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {cat.shortDesc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* ===== CTA BAND ===== */}
      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-[1440px] px-6 py-24 text-center md:px-15">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl lg:text-5xl">
            {config.ctaBandTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            {config.ctaBandSub}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/create">
                {config.ctaText}
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                  Free
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
