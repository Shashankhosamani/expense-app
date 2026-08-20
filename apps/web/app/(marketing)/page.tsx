import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
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
  Lock,
  Eye,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Logo } from "@/components/layout/Logo";

const PREVIEW_TXNS = [
  { name: "Blinkit", cat: "Groceries", amt: "₹642.50", icon: ShoppingCart, bg: "#C2EDDA", fg: "#23935C" },
  { name: "Swiggy", cat: "Food", amt: "₹389.00", icon: Utensils, bg: "#FFE9D6", fg: "#FFB766" },
  { name: "Uber", cat: "Transport", amt: "₹214.00", icon: Car, bg: "#FAFDFE", fg: "#2C6E8F" },
  { name: "Netflix", cat: "Subscriptions", amt: "₹199.00", icon: Tv, bg: "#FEEAE3", fg: "#F43A09" },
];

const STEP_SPREADS = [
  {
    n: "01",
    pose: "You link your phone once.",
    poseDetail: "Costiq reads incoming bank and UPI SMS on-device — nothing else.",
    icon: MessageSquare,
    answer: "Every transaction SMS is caught the moment it lands.",
    answerDetail: "No app to open, no forwarding, no manual step after this one.",
  },
  {
    n: "02",
    pose: "A message arrives: “Debited INR 642.50…”",
    poseDetail: "Raw bank SMS — merchant, amount, and reference buried in bank-speak.",
    icon: Sparkles,
    answer: "Blinkit · Groceries · ₹642.50",
    answerDetail: "Parsed, matched to a merchant, and sorted into a category instantly.",
  },
  {
    n: "03",
    pose: "The month adds up quietly in the background.",
    poseDetail: "No spreadsheet, no end-of-month reconciliation.",
    icon: PieChart,
    answer: "Budgets and history are already current.",
    answerDetail: "Open Costiq and the picture is already drawn.",
  },
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

const BEFORE_LIST = ["Typing every expense into an app after the fact", "A spreadsheet nobody updates past week two", "Finding out you're over budget from your bank, not before"];
const AFTER_LIST = ["No manual entry, ever", "Works with any Indian bank or UPI app", "Your data stays on your account, always exportable"];

const WHAT_CHANGES = [
  "You stop opening your banking app just to check what you spent — Costiq already knows.",
  "Categorization holds up even for UPI merchants with inconsistent or unfamiliar names.",
  "You check a dashboard instead of reconstructing a month from memory.",
];

const FAQS = [
  { q: "Do I need to enter expenses manually?", a: "No — Costiq reads bank and UPI SMS automatically. You can still add expenses by hand when needed." },
  { q: "Which banks are supported?", a: "Most major Indian banks and UPI apps that send transaction SMS. New formats are added regularly." },
  { q: "Is my SMS data private?", a: "Only transaction-pattern messages are parsed. The message is decrypted only for the seconds it takes to read the amount and merchant, then it's gone." },
  { q: "Can I use Costiq on both web and Android?", a: "Yes — your account syncs across both automatically." },
  { q: "What happens to messages Costiq isn't sure about?", a: "They land in a review queue where you confirm or discard them before they count." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col text-ink">
      <MarketingHeader />

      {/* Spread 1 — hero: the claim, paired against the mechanism itself */}
      <section className="min-h-[42rem] sm:min-h-screen flex flex-col sm:flex-row bg-navy">
        <div className="flex-1 flex flex-col justify-center gap-6 px-5 sm:px-16 py-14 sm:py-0 max-w-[40rem]">
          <span className="self-start text-xs font-bold uppercase tracking-wider text-brand bg-white/10 px-3 py-1.5 rounded-full">
            Made for UPI &amp; bank SMS
          </span>
          <h1 className="text-[2rem] sm:text-[3.25rem] leading-[1.1] tracking-tight font-extrabold text-white text-wrap-pretty">
            Your bank texts you. Costiq does the rest.
          </h1>
          <p className="text-lg leading-7 text-[#AFC8D1] text-wrap-pretty">
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
            <a href="#how" className="flex items-center gap-1.5 text-[0.9375rem] font-bold text-white">
              See how it works <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="hidden sm:block w-px bg-white/10" aria-hidden />

        <div className="flex-1 flex items-center justify-center px-5 sm:px-16 py-10 sm:py-0 bg-navy-2">
          <div className="w-full max-w-[22rem] flex flex-col gap-3">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-[#7B96A1]">A message arrives</span>
            <div className="rounded-2xl bg-[#152B34] border border-[#1E3742] px-4 py-3.5 text-[0.8125rem] leading-[1.35rem] text-[#B9CCD3] font-medium">
              INR 642.50 debited from A/c XX4521 on 20-08-26 to BLINKIT UPI. Avl Bal: INR 18,940.12. Not you? Call
              1800-XXX-XXXX.
            </div>
            <div className="flex items-center gap-2 pl-1 text-[0.6875rem] font-bold uppercase tracking-wider text-[#7B96A1]">
              <ArrowRight size={13} className="rotate-90" /> parsed instantly
            </div>
            <div className="rounded-2xl bg-surface-raised px-5 py-4 flex items-center gap-3 shadow-2xl">
              <span className="w-9.5 h-9.5 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#C2EDDA" }}>
                <ShoppingCart size={17} style={{ color: "#23935C" }} />
              </span>
              <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className="text-[0.9375rem] font-bold">Blinkit</span>
                <span className="text-xs font-medium text-ink-4">Groceries · just now</span>
              </span>
              <span className="text-[0.9375rem] font-extrabold">₹642.50</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spread 2 — how it works: three pose/answer pairs */}
      <section id="how" className="flex flex-col gap-10 px-5 sm:px-16 py-14 sm:py-24 bg-white">
        <div className="flex flex-col gap-3 max-w-[40rem] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">How it works</span>
          <h2 className="text-[1.625rem] sm:text-4xl font-extrabold tracking-tight">From SMS to insight, no step of your own</h2>
        </div>
        <div className="flex flex-col gap-px max-w-[64rem] mx-auto w-full bg-border-2 rounded-2xl overflow-hidden">
          {STEP_SPREADS.map((s) => (
            <div key={s.n} className="flex flex-col sm:flex-row bg-white">
              <div className="flex-1 flex gap-4 px-6 sm:px-10 py-8 sm:py-10">
                <span className="text-[1.75rem] font-extrabold text-border-4 leading-none shrink-0">{s.n}</span>
                <div className="flex flex-col gap-1.5">
                  <span className="text-base font-bold">{s.pose}</span>
                  <span className="text-[0.8125rem] leading-5 text-ink-2">{s.poseDetail}</span>
                </div>
              </div>
              <div className="hidden sm:block w-px bg-border-3 my-8" aria-hidden />
              <div className="flex-1 flex gap-4 px-6 sm:px-10 py-8 sm:py-10 bg-surface sm:bg-transparent">
                <span className="w-10 h-10 rounded-[0.625rem] bg-success-tint flex items-center justify-center shrink-0">
                  <s.icon size={18} className="text-success" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <span className="text-base font-bold">{s.answer}</span>
                  <span className="text-[0.8125rem] leading-5 text-ink-2">{s.answerDetail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spread 3 — privacy mechanism: encrypted pose, brief-read answer */}
      <section id="privacy" className="min-h-[34rem] flex flex-col sm:flex-row bg-navy">
        <div className="flex-1 flex flex-col justify-center gap-4 px-5 sm:px-16 py-12 sm:py-0 max-w-[28rem]">
          <span className="w-11 h-11 rounded-[0.625rem] bg-white/10 flex items-center justify-center">
            <Lock size={19} className="text-[#7B96A1]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-brand">Every SMS, encrypted</span>
          <p className="text-[0.9375rem] leading-6 text-[#AFC8D1]">
            Your message leaves your phone encrypted. It stays that way until it's Claude's turn to read it.
          </p>
        </div>
        <div className="hidden sm:block w-px bg-white/10" aria-hidden />
        <div className="flex-1 flex flex-col justify-center gap-4 px-5 sm:px-16 py-12 sm:py-0 max-w-[28rem]">
          <span className="w-11 h-11 rounded-[0.625rem] bg-success-tint flex items-center justify-center">
            <Eye size={19} className="text-success" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">Read for seconds, then gone</span>
          <p className="text-[0.9375rem] leading-6 text-white text-wrap-pretty">
            Claude decrypts it only long enough to read the amount and merchant — kept separate from any other
            token on your account, never a standing line into your messages.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="flex flex-col gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-surface">
        <div className="flex flex-col gap-3 max-w-[40rem] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Features</span>
          <h2 className="text-[1.625rem] sm:text-4xl font-extrabold tracking-tight">Everything you need, nothing you don&apos;t</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(14.375rem,1fr))] gap-5 max-w-[68.75rem] mx-auto w-full">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-3.5 p-7 bg-white rounded-2xl border border-border-2">
              <span className="w-9.5 h-9.5 rounded-[0.5625rem] bg-success-tint flex items-center justify-center">
                <f.icon size={18} className="text-success" />
              </span>
              <span className="text-base font-bold">{f.title}</span>
              <span className="text-[0.8125rem] leading-5 text-ink-2">{f.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Proof spread — screenshot paired with the claim */}
      <section className="flex flex-wrap items-center gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-white">
        <div className="flex-1 min-w-[16.25rem] flex justify-center">
          <div className="w-[min(17.5rem,80vw)] aspect-[280/580] bg-navy rounded-[2rem] p-3 shadow-2xl">
            <div className="w-full h-full bg-surface-raised rounded-[1.25rem] overflow-hidden p-5 flex flex-col gap-3.5">
              <span className="text-[0.9375rem] font-bold">Where it went</span>
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
        <div className="flex-1 min-w-[21.25rem] flex flex-col gap-5 max-w-[32.5rem]">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">See it in action</span>
          <h2 className="text-2xl sm:text-[2.125rem] font-extrabold tracking-tight">
            A clear picture of every rupee, every month
          </h2>
          <p className="text-base leading-[1.625rem] text-ink-2">
            Category breakdowns, budget tracking, and a full history — all built from the messages already landing
            in your inbox.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-2">
            <div className="flex flex-col gap-2.5">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-4">
                <X size={13} /> Before
              </span>
              {BEFORE_LIST.map((c) => (
                <span key={c} className="text-sm text-ink-3 leading-5">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-success">
                <Check size={13} /> With Costiq
              </span>
              {AFTER_LIST.map((c) => (
                <span key={c} className="text-sm font-medium leading-5">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing spread */}
      <section id="pricing" className="flex flex-col gap-12 px-5 sm:px-16 py-14 sm:py-24 bg-surface">
        <div className="flex flex-col gap-3 max-w-[40rem] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">Pricing</span>
          <h2 className="text-[1.625rem] sm:text-4xl font-extrabold tracking-tight">Free to start</h2>
        </div>
        <div className="flex flex-wrap gap-6 max-w-[56.25rem] mx-auto w-full">
          <div className="flex-1 min-w-[16.25rem] flex flex-col gap-5 p-8 rounded-2xl border border-border-2 bg-white">
            <div className="flex flex-col gap-1.5">
              <span className="text-[0.9375rem] font-bold">Free</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[2.5rem] font-extrabold">₹0</span>
                <span className="text-[0.8125rem] font-medium text-ink-3">/month</span>
              </div>
              <span className="text-[0.8125rem] leading-5 text-ink-3">Everything on this page, today.</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {["Unlimited SMS parsing", "Category budgets", "Full review queue", "Web and Android"].map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <Check size={15} />
                  <span className="text-[0.8125rem] font-medium">{perk}</span>
                </div>
              ))}
            </div>
            <Link
              href="/sign-in"
              className="mt-auto rounded-lg px-4 py-3.5 text-sm font-bold text-center bg-surface text-ink"
            >
              Start free
            </Link>
          </div>
          <div className="flex-1 min-w-[16.25rem] flex flex-col gap-5 p-8 rounded-2xl border border-navy bg-navy text-surface">
            <div className="flex flex-col gap-1.5">
              <span className="text-[0.9375rem] font-bold">Plus</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[1.75rem] font-extrabold">Coming soon</span>
              </div>
              <span className="text-[0.8125rem] leading-5 text-[#AFC8D1]">
                Unlimited history, exports, and priority review — pricing not set yet.
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {["Everything in Free", "Unlimited history & export", "Priority review queue"].map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <Check size={15} />
                  <span className="text-[0.8125rem] font-medium">{perk}</span>
                </div>
              ))}
            </div>
            <button
              disabled
              className="mt-auto rounded-lg px-4 py-3.5 text-sm font-bold text-center bg-white/10 text-[#AFC8D1] cursor-not-allowed"
            >
              Notify me
            </button>
          </div>
        </div>
      </section>

      {/* What changes — unattributed, no invented identities */}
      <section className="flex flex-col gap-10 px-5 sm:px-16 py-14 sm:py-24 bg-white">
        <div className="flex flex-col gap-3 max-w-[40rem] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">What changes</span>
          <h2 className="text-[1.625rem] sm:text-4xl font-extrabold tracking-tight">
            People stop tracking. Costiq doesn&apos;t.
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(14.375rem,1fr))] gap-5 max-w-[68.75rem] mx-auto w-full">
          {WHAT_CHANGES.map((c) => (
            <div key={c} className="flex flex-col gap-4 p-7 bg-surface rounded-2xl">
              <span className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center">
                <Sparkles size={16} className="text-success" />
              </span>
              <span className="text-sm leading-[1.375rem] text-wrap-pretty">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ — literal question/answer pairs */}
      <section id="faq" className="flex flex-col gap-8 px-5 sm:px-16 py-14 sm:py-24 bg-surface">
        <div className="flex flex-col gap-3 max-w-[40rem] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">FAQ</span>
          <h2 className="text-[1.625rem] sm:text-4xl font-extrabold tracking-tight">Common questions</h2>
        </div>
        <div className="flex flex-col gap-px max-w-[54rem] mx-auto w-full bg-border-2 rounded-2xl overflow-hidden">
          {FAQS.map((f) => (
            <div key={f.q} className="flex flex-col sm:flex-row bg-white">
              <span className="sm:w-[18rem] shrink-0 px-6 py-5.5 text-[0.9375rem] font-bold">{f.q}</span>
              <div className="hidden sm:block w-px bg-border-3 my-5.5" aria-hidden />
              <span className="px-6 py-5.5 sm:py-5.5 text-[0.8125rem] leading-[1.3125rem] text-ink-2">{f.a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Closing spread — before/after, one motion to the CTA */}
      <section className="flex flex-col sm:flex-row bg-navy">
        <div className="flex-1 flex flex-col justify-center gap-3 px-5 sm:px-16 py-12 sm:py-24">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7B96A1]">Before</span>
          <p className="text-lg leading-7 text-[#7E9CA7] line-through decoration-[#3A5560]">
            Typing every expense in by hand, at the end of a month you can barely remember.
          </p>
        </div>
        <div className="hidden sm:block w-px bg-white/10" aria-hidden />
        <div className="flex-1 flex flex-col justify-center items-start gap-5 px-5 sm:px-16 py-12 sm:py-24">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">After</span>
          <h2 className="text-[1.625rem] sm:text-[2.375rem] font-extrabold tracking-tight text-white max-w-[26rem] text-wrap-pretty">
            Stop typing your expenses. Let your bank do it.
          </h2>
          <Link href="/sign-in" className="bg-brand hover:bg-brand-dark text-white rounded-lg px-7.5 py-4 text-base font-bold">
            Create free account
          </Link>
        </div>
      </section>

      <footer className="flex flex-col gap-8 px-5 sm:px-16 pt-12 pb-8 bg-white border-t border-border-3">
        <div className="flex flex-wrap gap-8 sm:gap-12">
          <div className="flex flex-col gap-3 flex-[2_1_13.75rem] max-w-[17.5rem]">
            <Logo size={28} textClassName="text-[1.0625rem]" />
            <span className="text-[0.8125rem] leading-5 text-ink-4">
              Bank SMS in, categorized expenses out. Built for UPI and Indian banks.
            </span>
          </div>
          <div className="grid grid-cols-3 gap-8 flex-[3_1_16.25rem]">
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
