import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-extrabold text-foreground mb-2">Help & Support</h1>
      <p className="text-muted-foreground text-sm mb-8">Get help with AmravatiTransit</p>

      <div className="space-y-4">
        {[
          { icon: HelpCircle, title: "FAQs", desc: "Find answers to common questions about routes, schedules, and more." },
          { icon: MessageCircle, title: "Live Chat", desc: "Chat with our support team for real-time assistance." },
          { icon: Phone, title: "Call Us", desc: "Helpline: +91 721 255 1234 (Mon-Sat, 8AM-8PM)" },
          { icon: Mail, title: "Email Support", desc: "Write to support@amravatitransit.in" },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
