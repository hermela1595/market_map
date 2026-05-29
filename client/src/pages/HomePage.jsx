import { Link } from "react-router-dom";

export default function HomePage() {
  const impactStats = [
    {
      label: "Stronger local visibility",
      value: "1 Platform",
      detail:
        "A central marketplace where sellers from different regions can be discovered by more buyers.",
    },
    {
      label: "Faster buyer decisions",
      value: "24/7 Access",
      detail:
        "Shoppers compare product details and offers quickly without traveling between markets.",
    },
    {
      label: "Community trust",
      value: "Clear listings",
      detail:
        "Structured product details and direct contact support safer and more transparent trade.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.35),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.24),_transparent_45%)]" />

      <main className="relative mx-auto max-w-6xl px-6 pb-20 pt-14 sm:px-10 lg:px-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal">
            <p className="inline-flex items-center rounded-full border border-teal-300/40 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-200 reveal-delay-1">
              MarketMap Ethiopia
            </p>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl reveal-delay-2">
              A trusted digital marketplace built for local communities.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg reveal-delay-3">
              MarketMap helps buyers find genuine products faster, gives sellers
              better visibility, and supports safer transactions through clear
              listings and direct communication.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300/90 reveal-delay-4">
              From neighborhood entrepreneurs to growing businesses, the
              platform makes it easier to reach customers, compare options, and
              build trust across regions in Ethiopia.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 reveal-delay-5">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Go to Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="relative reveal reveal-delay-2">
            <div className="absolute -inset-4 rounded-3xl bg-teal-300/20 blur-2xl" />

            <div className="relative rounded-3xl border border-white/20 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=80"
                alt="People shopping together in a local market"
                className="h-64 w-full rounded-2xl object-cover sm:h-72"
                loading="lazy"
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
                  alt="Fresh produce from local sellers"
                  className="h-28 w-full rounded-xl object-cover sm:h-32"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=900&q=80"
                  alt="Small business owner serving customers"
                  className="h-28 w-full rounded-xl object-cover sm:h-32"
                  loading="lazy"
                />
              </div>

              <p className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                MarketMap connects real community commerce: local products,
                trusted sellers, and informed buyers.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3 reveal reveal-delay-3">
          <article className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-teal-200/40">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-200">
              Better access
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
              Buyers can discover products from different regions in one place,
              reducing search time and improving price comparison.
            </p>
          </article>

          <article className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-teal-200/40">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-200">
              Local growth
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
              Small sellers gain digital visibility, attract new customers, and
              grow sustainably with better market reach.
            </p>
          </article>

          <article className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-teal-200/40">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-200">
              Trust and safety
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
              Structured listings and clear seller interactions help build a
              more reliable buying and selling environment.
            </p>
          </article>
        </section>

        <section className="mt-14 reveal reveal-delay-4">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Community impact
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200/90 sm:text-base">
              MarketMap supports community-driven commerce by improving access
              to information and opportunities. Buyers find quality products,
              while sellers expand beyond their immediate neighborhoods.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {impactStats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-teal-200/20 bg-slate-900/60 p-5"
                >
                  <p className="text-2xl font-black text-teal-300">
                    {item.value}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold uppercase tracking-wide text-teal-100">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200/85">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
