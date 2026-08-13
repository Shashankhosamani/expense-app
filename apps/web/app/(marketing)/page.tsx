import Link from "next/link";
import {
  ArrowRight,
  Check,
  MessageSquare,
  Sparkles,
  PieChart,
  Zap,
  Tags,
  ShieldCheck,
  Target,
  History,
  Smartphone,
  ShoppingCart,
  Utensils,
  Car,
  Tv,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Logo } from "@/components/layout/Logo";

const PREVIEW_TXNS = [
  { name: "Blinkit", cat: "Groceries", amt: "₹642.50", icon: ShoppingCart, bg: "#C2EDDA", fg: "#23935C" },
  { name: "Swiggy", cat: "Food", amt: "₹389.00", icon: Utensils, bg: "#FFE9D6", fg: "#FFB766" },
  { name: "Uber", cat: "Transport", amt: "₹214.00", icon: Car, bg: "#FAFDFE", fg: "#2C6E8F" },
  { name: "Netflix", cat: "Subscriptions", amt: "₹199.00", icon: Tv, bg: "#FEEAE3", fg: "#F43A09" },
];

const STEPS = [
  { icon: MessageSquare, title: "Connect once", body: "Link your phone. Costiq reads incoming bank and UPI SMS — nothing else." },
  { icon: Sparkles, title: "Auto-categorized", body: "Every transaction is parsed, matched to a merchant, and sorted into a category instantly." },
  { icon: PieChart, title: "See the picture", body: "Budgets, category breakdowns, and history update themselves as messages arrive." },
];

const FEATURES = [
  { icon: Zap, title: "Real-time capture", body: "New expenses appear the moment your bank texts you." },
  { icon: Tags, title: "Smart categorization", body: "Merchant-aware sorting that gets more accurate over time." },
  { icon: ShieldCheck, title: "Review queue", body: "Ambiguous messages wait for your say before they count." },
  { icon: Target, title: "Budgets that hold", body: "Set monthly limits per category and track pace in real time." },
  { icon: History, title: "Full change history", body: "Every edit to a transaction is logged and reversible." },
  { icon: Smartphone, title: "Web and Android", body: "Same data, same categories, wherever you check it." },
];

const CATS = [
  { name: "Food & dining", amt: "₹3,210", color: "#F43A09", pct: "58%" },
  { name: "Groceries", amt: "₹2,140", color: "#23935C", pct: "39%" },
  { name: "Transport", amt: "₹1,480", color: "#2C6E8F", pct: "27%" },
  { name: "Subscriptions", amt: "₹890", color: "#FFB766", pct: "16%" },
];

const CHECKS = [
  "No manual entry, ever",
  "Works with any Indian bank or UPI app",
  "Your data stays on your account, always exportable",
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    desc: "Everything you need to get started.",
    dark: false,
    perks: ["Unlimited SMS parsing", "1 budget category set", "30-day history"],
    cta: "Start free",
  },
  {
    name: "Plus",
    price: "₹99",
    period: "/month",
    desc: "For households and heavier tracking.",
    dark: true,
    perks: ["Everything in Free", "Unlimited budgets", "Full history & export", "Priority review queue"],
    cta: "Start Plus",
  },
];

const TESTIMONIALS = [
  { quote: "I stopped opening my banking app just to check what I spent. Costiq already knows.", name: "Ananya R.", role: "Product designer", initial: "A" },
  { quote: "Categorization is scary accurate, even for UPI merchants with weird names.", name: "Rohit S.", role: "Freelancer", initial: "R" },
  { quote: "Finally a tracker that doesn't need me to do anything.", name: "Meera K.", role: "Analyst", initial: "M" },
];

const FAQS = [
  { q: "Do I need to enter expenses manually?", a: "No — Costiq reads bank and UPI SMS automatically. You can still add expenses by hand when needed." },
  { q: "Which banks are supported?", a: "Most major Indian banks and UPI apps that send transaction SMS. New formats are added regularly." },
  { q: "Is my SMS data private?", a: "Only transaction-pattern messages are parsed; nothing else is read, stored, or shared." },
  { q: "Can I use Costiq on both web and Android?", a: "Yes — your account syncs across both automatically." },
  { q: "What happens to messages Costiq isn't sure about?", a: "They land in a review queue where you confirm or discard them before they count." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col text-ink">
      <MarketingHeader />

      <section className="flex flex-wrap items-center gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-surface overflow-hidden">
        <div className="flex-1 min-w-[320px] flex flex-col gap-6 max-w-[560px]">
          <span className="self-start text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-tint px-3 py-1.5 rounded-full">
            Made for UPI &amp; bank SMS
          </span>
          <h1 className="text-[32px] sm:text-[56px] leading-[1.1] tracking-tight font-extrabold">
            Your bank texts you. Costiq does the rest.
          </h1>
          <p className="text-lg leading-7 text-ink-2 text-wrap-pretty">
            Costiq reads your bank and UPI SMS, sorts every rupee into a category automatically, and shows you
            exactly where your money went — no manual entry, no spreadsheets.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/sign-in"
              className="bg-brand hover:bg-brand-dark text-white rounded-lg px-6.5 py-4 text-base font-bold"
            >
              Create free account
            </Link>
            <a href="#how" className="flex items-center gap-1.5 text-[15px] font-bold text-ink">
              See how it works <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-wrap gap-7 pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[22px] font-extrabold">40k+</span>
              <span className="text-xs font-medium text-ink-4">messages parsed daily</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[22px] font-extrabold">₹0</span>
              <span className="text-xs font-medium text-ink-4">manual entry needed</span>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[280px] flex justify-center">
          <div className="w-[min(320px,86vw)] aspect-[320/560] bg-navy rounded-[34px] p-3.5 shadow-2xl">
            <div className="w-full h-full bg-surface-raised rounded-[22px] overflow-hidden flex flex-col">
              <div className="px-5 pt-5.5 pb-4 flex flex-col gap-1 border-b border-border-3">
                <span className="text-xs font-medium text-ink-4">August 2026</span>
                <span className="text-[34px] font-extrabold tracking-tight">₹10,427.50</span>
                <span className="text-xs font-medium text-ink-4">of ₹18,000 budget</span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {PREVIEW_TXNS.map((t) => (
                  <div key={t.name} className="flex items-center gap-2.5">
                    <span
                      className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: t.bg }}
                    >
                      <t.icon size={16} style={{ color: t.fg }} />
                    </span>
                    <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <span className="text-[13px] font-semibold">{t.name}</span>
                      <span className="text-[11px] font-medium text-ink-4">{t.cat}</span>
                    </span>
                    <span className="text-[13px] font-bold">{t.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="flex flex-col gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-white">
        <div className="flex flex-col gap-3 max-w-[640px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">How it works</span>
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight">From SMS to insight in three steps</h2>
        </div>
        <div className="flex flex-wrap gap-6 max-w-[1100px] mx-auto w-full">
          {STEPS.map((s) => (
            <div key={s.title} className="flex-1 min-w-[240px] flex flex-col gap-4 p-7 bg-surface rounded-2xl">
              <span className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center">
                <s.icon size={20} className="text-brand" />
              </span>
              <span className="text-lg font-bold">{s.title}</span>
              <span className="text-sm leading-[22px] text-ink-2">{s.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="flex flex-col gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-surface">
        <div className="flex flex-col gap-3 max-w-[640px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Features</span>
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight">Everything you need, nothing you don&apos;t</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5 max-w-[1100px] mx-auto w-full">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-3.5 p-7 bg-white rounded-2xl border border-border-2">
              <span className="w-9.5 h-9.5 rounded-[9px] bg-success-tint flex items-center justify-center">
                <f.icon size={18} className="text-success" />
              </span>
              <span className="text-base font-bold">{f.title}</span>
              <span className="text-[13px] leading-5 text-ink-2">{f.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-white">
        <div className="flex-1 min-w-[260px] flex justify-center">
          <div className="w-[min(280px,80vw)] aspect-[280/580] bg-navy rounded-[32px] p-3 shadow-2xl">
            <div className="w-full h-full bg-surface-raised rounded-[20px] overflow-hidden p-5 flex flex-col gap-3.5">
              <span className="text-[15px] font-bold">Where it went</span>
              {CATS.map((c) => (
                <div key={c.name} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="flex-1 text-xs font-medium">{c.name}</span>
                    <span className="text-xs font-bold">{c.amt}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border-3 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: c.pct, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[340px] flex flex-col gap-5 max-w-[520px]">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">See it in action</span>
          <h2 className="text-2xl sm:text-[34px] font-extrabold tracking-tight">
            A clear picture of every rupee, every month
          </h2>
          <p className="text-base leading-[26px] text-ink-2">
            Category breakdowns, budget tracking, and a full history — all built from the messages already landing
            in your inbox.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            {CHECKS.map((c) => (
              <div key={c} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-success-tint flex items-center justify-center shrink-0">
                  <Check size={12} className="text-success" />
                </span>
                <span className="text-sm font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="flex flex-col gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-surface">
        <div className="flex flex-col gap-3 max-w-[640px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Pricing</span>
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight">Free to start, simple to grow</h2>
        </div>
        <div className="flex flex-wrap gap-6 max-w-[900px] mx-auto w-full">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`flex-1 min-w-[260px] flex flex-col gap-5 p-8 rounded-2xl border ${
                p.dark ? "bg-navy border-navy text-surface" : "bg-white border-border-2 text-ink"
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[15px] font-bold">{p.name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[40px] font-extrabold">{p.price}</span>
                  <span className={`text-[13px] font-medium ${p.dark ? "text-[#AFC8D1]" : "text-ink-3"}`}>
                    {p.period}
                  </span>
                </div>
                <span className={`text-[13px] leading-5 ${p.dark ? "text-[#AFC8D1]" : "text-ink-3"}`}>{p.desc}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {p.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2">
                    <Check size={15} />
                    <span className="text-[13px] font-medium">{perk}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/sign-in"
                className={`mt-auto rounded-lg px-4 py-3.5 text-sm font-bold text-center ${
                  p.dark ? "bg-brand text-white" : "bg-surface text-ink"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-10 px-5 sm:px-16 py-14 sm:py-24 bg-white">
        <div className="flex flex-col gap-3 max-w-[640px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Loved by early users</span>
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight">
            People stop tracking. Costiq doesn&apos;t.
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5 max-w-[1100px] mx-auto w-full">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col gap-4 p-7 bg-surface rounded-2xl">
              <span className="text-sm leading-[22px] text-wrap-pretty">&quot;{t.quote}&quot;</span>
              <div className="flex items-center gap-2.5 mt-auto">
                <span className="w-8 h-8 rounded-full bg-[#FFB766] flex items-center justify-center text-[13px] font-bold">
                  {t.initial}
                </span>
                <div className="flex flex-col gap-px">
                  <span className="text-[13px] font-bold">{t.name}</span>
                  <span className="text-[11px] font-medium text-ink-4">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="flex flex-col gap-8 px-5 sm:px-16 py-14 sm:py-24 bg-surface">
        <div className="flex flex-col gap-3 max-w-[640px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">FAQ</span>
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight">Common questions</h2>
        </div>
        <div className="flex flex-col gap-px max-w-[760px] mx-auto w-full bg-border-2 rounded-2xl overflow-hidden">
          {FAQS.map((f) => (
            <div key={f.q} className="flex flex-col gap-2 px-6 py-5.5 bg-white">
              <span className="text-[15px] font-bold">{f.q}</span>
              <span className="text-[13px] leading-[21px] text-ink-2">{f.a}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 px-5 sm:px-16 py-14 sm:py-24 bg-navy text-center">
        <h2 className="text-[26px] sm:text-[38px] font-extrabold tracking-tight text-surface max-w-[560px]">
          Stop typing your expenses. Let your bank do it.
        </h2>
        <p className="text-base leading-[26px] text-[#AFC8D1] max-w-[460px]">
          Free to start. Two minutes to set up. No card required.
        </p>
        <Link href="/sign-in" className="bg-brand hover:bg-brand-dark text-white rounded-lg px-7.5 py-4 text-base font-bold">
          Create free account
        </Link>
      </section>

      <footer className="flex flex-col gap-8 px-5 sm:px-16 pt-12 pb-8 bg-white border-t border-border-3">
        <div className="flex flex-wrap gap-8 sm:gap-12">
          <div className="flex flex-col gap-3 flex-[2_1_220px] max-w-[280px]">
            <Logo size={28} textClassName="text-[17px]" />
            <span className="text-[13px] leading-5 text-ink-4">
              Bank SMS in, categorized expenses out. Built for UPI and Indian banks.
            </span>
          </div>
          <div className="grid grid-cols-3 gap-8 flex-[3_1_260px]">
            {[
              { title: "Product", links: ["How it works", "Features", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-4">{col.title}</span>
                {col.links.map((l) => (
                  <a key={l} href="#" className="text-sm font-medium text-ink">
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border-3">
          <span className="text-xs text-ink-4">© 2026 Costiq. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="text-xs font-medium text-ink-4">Privacy</a>
            <a href="#" className="text-xs font-medium text-ink-4">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
