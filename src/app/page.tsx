import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  ClipboardList,
  Layers3,
  Menu,
  PackageCheck,
  ScanLine,
  ShieldCheck,
  Truck,
} from "lucide-react";

const services = [
  {
    icon: PackageCheck,
    title: "Inventory control",
    description:
      "Know what is in stock, what is moving, and what needs your attention.",
  },
  {
    icon: BarChart3,
    title: "Clear reporting",
    description:
      "Turn everyday inventory activity into simple, useful decisions.",
  },
  {
    icon: Truck,
    title: "Order fulfillment",
    description:
      "Keep purchasing, receiving, and shipping moving in one place.",
  },
];

const benefits = [
  "Real-time stock visibility",
  "Fewer costly stockouts",
  "Simple team workflows",
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fa] text-[#1f2937]">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label="Stockwise home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#953002] text-[#fffaf4] shadow-[0_8px_24px_rgba(149,48,2,0.2)]">
            <Layers3 size={21} strokeWidth={2.4} />
          </span>

          <span className="text-lg font-bold tracking-tight">
            stockwise
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-[#725f57] md:flex"
          aria-label="Main navigation"
        >
          <a
            className="transition-colors hover:text-[#953002]"
            href="#services"
          >
            Services
          </a>

          <a
            className="transition-colors hover:text-[#953002]"
            href="#about"
          >
            About us
          </a>

          <a
            className="transition-colors hover:text-[#953002]"
            href="#contact"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#953002] transition-colors hover:bg-[#953002]/8 sm:px-4"
          >
            Sign in
          </a>

          <a
            href="/signup"
            className="rounded-lg bg-[#953002] px-4 py-2.5 text-sm font-semibold text-[#fffaf4] shadow-[0_8px_20px_rgba(149,48,2,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#762500] sm:px-5"
          >
            Sign up
          </a>

          <button
            className="rounded-lg p-2 text-[#953002] md:hidden"
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>
        </div>
      </header>

      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section
        id="top"
        className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          {/* =====================================================
              HERO TEXT
          ===================================================== */}

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffb401]/40 bg-[#ffb401]/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#953002]">
              <span className="size-1.5 rounded-full bg-[#ffb401]" />

              Inventory, simplified
            </div>

            <h1 className="max-w-lg text-balance text-5xl font-bold leading-[1.03] tracking-[-0.055em] text-[#281914] sm:text-6xl lg:text-[4.6rem]">
              Inventory clarity.
              <br />

              <span className="text-[#953002]">
                Built into every move.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-pretty text-base leading-7 text-[#725f57] sm:text-lg">
              A smarter, calmer way to manage inventory. Keep your products
              moving and your team focused on what matters next.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#953002] px-5 py-3.5 text-sm font-semibold text-[#fffaf4] shadow-[0_12px_26px_rgba(149,48,2,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#762500]"
              >
                Get started free

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7d8cc] bg-[#fffaf4] px-5 py-3.5 text-sm font-semibold text-[#953002] transition-colors hover:border-[#953002]/30 hover:bg-[#fff3e8]"
              >
                Explore services

                <ChevronRight size={17} />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#8b766b]">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="flex items-center gap-1.5"
                >
                  <Check
                    size={14}
                    className="text-[#2f80ed]"
                    strokeWidth={2.5}
                  />

                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* =====================================================
              HERO IMAGE / DASHBOARD
              
              NEW:
              - Smooth floating animation
              - Slight rotation normally
              - Straightens on hover
              - Continues floating on hover
          ===================================================== */}

          <div className="relative min-h-[390px] overflow-hidden rounded-[1.75rem] bg-[#953002] shadow-[0_24px_60px_rgba(86,38,18,0.16)] sm:min-h-[480px]">
            {/* Background */}
            <div
              className="absolute inset-0 bg-[#f2eee9]"
              aria-hidden="true"
            />

            {/* =================================================
                ANIMATED IMAGE
            ================================================= */}

            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/inventory-dashboard-hero.png"
                alt="Inventory management dashboard with stock charts and warehouse tools"
                className="stockwise-hero-image absolute inset-0 size-full object-cover object-center"
              />
            </div>

            {/* Bottom dark gradient */}
            <div
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#281914]/60 to-transparent"
              aria-hidden="true"
            />

            {/* =================================================
                HERO IMAGE CONTENT
            ================================================= */}

            <div className="relative flex h-full min-h-[390px] flex-col justify-between p-5 sm:min-h-[480px] sm:p-7">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#fffaf4]/90 px-3 py-1.5 text-xs font-bold text-[#953002] shadow-sm">
                  Inventory control, simplified
                </span>

                <span className="flex size-9 items-center justify-center rounded-full bg-[#ffb401] text-[#281914] shadow-sm">
                  <ScanLine size={17} />
                </span>
              </div>

              <div className="max-w-xs text-[#fffaf4]">
                <p className="text-sm font-semibold text-[#fffaf4]/85">
                  Your operation at a glance
                </p>

                <p className="mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  See stock clearly.
                  <br />
                  Move with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}

      <section
        id="services"
        className="border-y border-[#eaded4] bg-[#fffdf9] px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2f80ed]">
                Everything in one view
              </p>

              <h2 className="mt-3 max-w-md text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Tools that keep your operation moving.
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-6 text-[#725f57]">
              From your first product to your next thousand, stockwise grows
              with the way you work.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {services.map(
              ({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-[#eaded4] bg-[#fffaf4] p-6 transition-all hover:-translate-y-1 hover:border-[#ffb401]/60 hover:shadow-[0_12px_30px_rgba(149,48,2,0.07)]"
                >
                  <span className="mb-7 flex size-11 items-center justify-center rounded-xl bg-[#953002]/9 text-[#953002]">
                    <Icon size={21} />
                  </span>

                  <h3 className="text-lg font-bold tracking-tight">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#725f57]">
                    {description}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}

      <section
        id="about"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-12 lg:py-24"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#953002]">
            Why stockwise
          </p>

          <h2 className="mt-3 max-w-lg text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
            Inventory should give you clarity, not more work.
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#725f57]">
            We bring the essential tools together in a workspace your whole
            team can understand. No clutter, no steep learning curve, just a
            better way to stay ready.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="flex items-center gap-4 rounded-xl bg-[#953002] p-5 text-[#fffaf4]">
            <ClipboardList size={22} />

            <div>
              <p className="font-bold">
                One source of truth
              </p>

              <p className="mt-1 text-sm text-[#fffaf4]/75">
                Everyone sees the same picture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-[#eaf2ff] p-5 text-[#174a96]">
            <ShieldCheck size={22} />

            <div>
              <p className="font-bold">
                Made to be dependable
              </p>

              <p className="mt-1 text-sm text-[#174a96]/75">
                Your operation, handled with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer
        id="contact"
        className="border-t border-[#eaded4] px-5 py-8 sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#8b766b] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-[#953002]">
            stockwise
          </span>

          <span>
            Simple inventory management for teams that keep things moving.
          </span>

          <a
            href="mailto:hello@stockwise.example"
            className="font-medium text-[#953002] hover:underline"
          >
            Get in touch
          </a>
        </div>
      </footer>
    </main>
  );
}