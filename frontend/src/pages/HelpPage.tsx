import { useState, useMemo } from "react";
import {
  Search,
  Compass,
  Route,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type HelpCategory = "general" | "routes" | "tracking" | "feedback";
type HelpChipType = "track" | "routes" | "schedule" | "issue";

interface FAQItem {
  id: string;
  category: HelpCategory;
  question: string;
  answer: string;
}

// Mock FAQ data
const FAQ_DATA: FAQItem[] = [
  {
    id: "1",
    category: "general",
    question: "How do I book a bus ticket?",
    answer:
      "Currently, AmravatiTransit provides live bus tracking. You can book tickets directly at the bus stand or through partner apps. Check the app for real-time bus schedules and stops.",
  },
  {
    id: "2",
    category: "general",
    question: "Is the app free to use?",
    answer:
      "Yes! AmravatiTransit is completely free. Track buses, check schedules, and get notifications at no cost.",
  },
  {
    id: "3",
    category: "general",
    question: "What cities does AmravatiTransit cover?",
    answer:
      "Currently, we cover Amravati city and nearby areas (Badnera, Navsari, University routes). Expansion to other cities is planned.",
  },
  {
    id: "4",
    category: "routes",
    question: "How many routes are available?",
    answer:
      "We have 20+ bus routes covering all major parts of Amravati. Check the Routes page to see all available options.",
  },
  {
    id: "5",
    category: "routes",
    question: "Can I view the route details?",
    answer:
      "Yes! Tap any route to see all stops, distances, frequencies, and first/last bus times. You can also view the route on the map.",
  },
  {
    id: "6",
    category: "routes",
    question: "How often do buses run?",
    answer:
      "Frequency varies by route (every 15-90 minutes). Check the Schedule page or route details for specific frequencies.",
  },
  {
    id: "7",
    category: "tracking",
    question: "How accurate is the live tracking?",
    answer:
      "Our GPS-based tracking is updated every 10 seconds for real-time accuracy. Bus locations are accurate within 50 meters.",
  },
  {
    id: "8",
    category: "tracking",
    question: "Why is my bus not showing on the map?",
    answer:
      "Some buses may not have GPS enabled or might be in offline areas. Try refreshing the app or checking the schedule.",
  },
  {
    id: "9",
    category: "tracking",
    question: "Can I set arrival reminders?",
    answer:
      "Yes! Tap 'Set Reminder' on the schedule or stop details. You'll get a push notification 5 minutes before the bus arrives.",
  },
  {
    id: "10",
    category: "feedback",
    question: "How do I report a problem?",
    answer:
      "Go to Help > Report Issue or contact us via email/WhatsApp. Please provide route number, stop name, and detailed description.",
  },
  {
    id: "11",
    category: "feedback",
    question: "Can I suggest a new route?",
    answer:
      "Absolutely! Send your suggestion to support@amravatitransit.in with details about the proposed route and expected demand.",
  },
];

const HELP_CHIPS: Array<{ id: HelpChipType; label: string; icon: typeof Compass }> = [
  { id: "track", label: "Track Bus", icon: Compass },
  { id: "routes", label: "Route Info", icon: Route },
  { id: "schedule", label: "Schedule", icon: Clock },
  { id: "issue", label: "Report Issue", icon: AlertCircle },
];

const CATEGORY_LABELS: Record<HelpCategory, string> = {
  general: "General",
  routes: "Routes",
  tracking: "Tracking",
  feedback: "Feedback",
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChip, setSelectedChip] = useState<HelpChipType | null>(null);

  // Filter FAQ based on search and selected chip
  const filteredFAQ = useMemo(() => {
    let filtered = FAQ_DATA;

    if (selectedChip) {
      const categoryMap: Record<HelpChipType, HelpCategory> = {
        track: "tracking",
        routes: "routes",
        schedule: "general",
        issue: "feedback",
      };
      filtered = filtered.filter((f) => f.category === categoryMap[selectedChip]);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.question.toLowerCase().includes(query) ||
          f.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedChip]);

  // Group FAQ by category
  const groupedFAQ = CATEGORY_LABELS &&
    Object.entries(CATEGORY_LABELS).reduce(
      (acc, [cat, label]) => {
        const items = filteredFAQ.filter((f) => f.category === cat);
        if (items.length > 0) {
          acc[cat] = { label, items };
        }
        return acc;
      },
      {} as Record<string, { label: string; items: FAQItem[] }>
    );

  const clearSearch = () => setSearchQuery("");
  const clearChip = () => setSelectedChip(null);

  return (
    <div className="w-full bg-background pb-24 lg:pb-0">
      {/* HERO SECTION */}
      <div className="px-4 py-6 space-y-4">
        <div className="bg-card border border-white/8 rounded-[16px] p-6">
          <h1 className="text-foreground font-bold text-[22px] mb-1">
            How can we help?
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            Find answers or contact us
          </p>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-white/8 rounded-[26px] px-4 py-3 pl-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QUICK HELP CHIPS */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {HELP_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const isActive = selectedChip === chip.id;

            return (
              <button
                key={chip.id}
                onClick={() => setSelectedChip(isActive ? null : chip.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-white/10 text-muted-foreground hover:border-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                {chip.label}
              </button>
            );
          })}
        </div>
        {selectedChip && (
          <button
            onClick={clearChip}
            className="text-primary text-xs font-bold mt-3 hover:opacity-80 transition-opacity"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* FAQ SECTION */}
      <div className="px-4 py-6">
        <h2 className="text-foreground font-bold text-sm mb-4 uppercase tracking-wide">
          Frequently Asked
        </h2>

        {Object.keys(groupedFAQ).length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No matches found for "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFAQ).map(([cat, { label, items }]) => (
              <div key={cat}>
                {/* Category Label */}
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wide mb-3 px-1">
                  {label}
                </h3>

                {/* Accordion */}
                <Accordion type="single" collapsible className="space-y-2">
                  {items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="bg-card border border-white/8 rounded-[12px] px-4 data-[state=open]:bg-card"
                    >
                      <AccordionTrigger className="text-foreground font-bold text-sm py-4 hover:no-underline hover:opacity-80 transition-opacity">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-xs pb-4 pt-0">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTACT SECTION */}
      <div className="px-4 py-6">
        <h2 className="text-foreground font-bold text-sm mb-4 uppercase tracking-wide">
          Still need help?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Email Card */}
          <a
            href="mailto:support@amravatitransit.in"
            className="bg-card border border-white/8 rounded-[12px] p-4 flex flex-col items-center text-center hover:border-white/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-foreground font-bold text-sm mb-1">Email Us</h3>
            <p className="text-muted-foreground text-xs">
              support@amravatitransit.in
            </p>
          </a>

          {/* Phone Card */}
          <a
            href="tel:+917212551234"
            className="bg-card border border-white/8 rounded-[12px] p-4 flex flex-col items-center text-center hover:border-white/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-foreground font-bold text-sm mb-1">Call Us</h3>
            <p className="text-muted-foreground text-xs">1800-XXX-XXXX</p>
          </a>

          {/* WhatsApp Card */}
          <a
            href="https://wa.me/917212551234"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-white/8 rounded-[12px] p-4 flex flex-col items-center text-center hover:border-white/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-foreground font-bold text-sm mb-1">WhatsApp</h3>
            <p className="text-muted-foreground text-xs">Chat now</p>
          </a>
        </div>
      </div>

      {/* FOOTER STRIP */}
      <div className="px-4 py-6 border-t border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">AmravatiTransit v1.0.0</p>
        </div>
        <button className="w-full px-4 py-3 border-2 border-primary text-primary font-bold rounded-[12px] hover:bg-primary/10 transition-colors text-sm">
          Send Feedback
        </button>
      </div>
    </div>
  );
}
