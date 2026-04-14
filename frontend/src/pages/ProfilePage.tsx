import { useState } from "react";
import { User, Mail, Phone, MapPin, Bookmark, History, Settings, Bell, LogOut, Heart, ArrowRight, Edit2, Save, X, Star, Clock, DollarSign, Shield, Lock } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  totalTrips: number;
  avatar: string;
}

interface FavoriteRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  frequency: number;
}

interface RecentTrip {
  id: string;
  route: string;
  date: string;
  time: string;
  duration: string;
  rating?: number;
}

interface PaymentMethod {
  id: string;
  type: "card" | "wallet";
  name: string;
  lastDigits: string;
  isDefault: boolean;
}

const mockProfile: UserProfile = {
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 9876543210",
  location: "Amravati, Maharashtra",
  memberSince: "January 2024",
  totalTrips: 127,
  avatar: "RS",
};

const mockFavoriteRoutes: FavoriteRoute[] = [
  { id: "1", name: "Route 4", from: "Rajapeth", to: "Cotton Market", frequency: 23 },
  { id: "2", name: "Route 7", from: "Railway Station", to: "University", frequency: 18 },
  { id: "3", name: "Route 12", from: "Airport", to: "City Center", frequency: 12 },
];

const mockRecentTrips: RecentTrip[] = [
  { id: "1", route: "Route 4 (Rajapeth → Cotton Market)", date: "Today", time: "09:30 AM", duration: "25 min", rating: 5 },
  { id: "2", route: "Route 7 (Railway Station → University)", date: "Yesterday", time: "02:15 PM", duration: "18 min", rating: 4 },
  { id: "3", route: "Route 4 (Rajapeth → Cotton Market)", date: "Apr 12", time: "08:45 AM", duration: "27 min" },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: "1", type: "card", name: "HDFC Debit Card", lastDigits: "4521", isDefault: true },
  { id: "2", type: "wallet", name: "AmravatiTransit Wallet", lastDigits: "****", isDefault: false },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "payments" | "settings">("overview");
  const adminLoginUrl = import.meta.env.VITE_ADMIN_LOGIN_URL ?? "http://localhost:5184/login";

  const handleEditChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-background min-h-screen pb-24 lg:pb-8">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-40 bg-card border-b border-white/8 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold text-foreground">My Profile</h1>
          <div className="flex gap-2">
            <a
              href={adminLoginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-primary"
              title="Open Admin Panel"
            >
              <Lock className="w-5 h-5" />
            </a>
            <button
              onClick={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== PROFILE HEADER CARD ===== */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-card border border-white/8 rounded-[20px] p-4 flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {profile.avatar}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="w-full bg-muted/50 border border-white/10 rounded-lg px-3 py-1.5 text-foreground mb-1"
              />
            ) : (
              <h2 className="text-lg font-bold text-foreground">{profile.name}</h2>
            )}
            <p className="text-sm text-muted-foreground">Member since {profile.memberSince}</p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <History className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{profile.totalTrips} Trips</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TAB NAVIGATION ===== */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-white/8 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview" },
            { id: "trips", label: "Trips" },
            { id: "payments", label: "Payments" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-[12px] whitespace-nowrap font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div className="px-4 py-4">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="bg-card border border-white/8 rounded-[20px] p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Contact Information
              </h3>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                        className="w-full bg-muted/50 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => handleEditChange("phone", e.target.value)}
                        className="w-full bg-muted/50 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => handleEditChange("location", e.target.value)}
                        className="w-full bg-muted/50 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-foreground">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-foreground">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-foreground">{profile.location}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Favorite Routes */}
            <div className="bg-card border border-white/8 rounded-[20px] p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Favorite Routes
              </h3>
              <div className="space-y-3">
                {mockFavoriteRoutes.map((route) => (
                  <div key={route.id} className="bg-muted/30 border border-white/10 rounded-[12px] p-3 flex items-between justify-between hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{route.name}</p>
                      <p className="text-xs text-muted-foreground">{route.from} → {route.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-primary">{route.frequency} trips</p>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button (if editing) */}
            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-[12px] py-3 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* TRIPS TAB */}
        {activeTab === "trips" && (
          <div className="space-y-3">
            <div className="bg-primary/20 border border-primary/30 rounded-[12px] px-3 py-2.5 mb-4">
              <p className="text-sm text-primary font-medium">Last {mockRecentTrips.length} Trips</p>
            </div>
            {mockRecentTrips.map((trip) => (
              <div key={trip.id} className="bg-card border border-white/8 rounded-[16px] p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{trip.route}</p>
                  {trip.rating && (
                    <div className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-foreground">{trip.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trip.date} at {trip.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trip.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            {/* Payment Methods */}
            <div>
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Payment Methods
              </h3>
              <div className="space-y-3 mb-4">
                {mockPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-[16px] p-4 cursor-pointer transition-all ${
                      method.isDefault ? "bg-primary/20 border-primary/50" : "bg-card border-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{method.name}</p>
                        <p className="text-xs text-muted-foreground">•••• {method.lastDigits}</p>
                      </div>
                      {method.isDefault && (
                        <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                          Default
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-card border border-white/10 hover:border-primary/50 text-foreground font-medium rounded-[12px] py-3 transition-colors">
                + Add Payment Method
              </button>
            </div>

            {/* Wallet Balance */}
            <div className="bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50 rounded-[20px] p-4">
              <p className="text-sm text-muted-foreground mb-2">Wallet Balance</p>
              <p className="text-2xl font-bold text-primary">₹500.00</p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-[12px] py-2 text-sm transition-colors">
                  Add Money
                </button>
                <button className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary font-medium rounded-[12px] py-2 text-sm transition-colors">
                  Send Money
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            {/* Notifications */}
            <div className="bg-card border border-white/8 rounded-[20px] p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Trip Reminders", enabled: true },
                  { label: "Route Updates", enabled: true },
                  { label: "Promotional Offers", enabled: false },
                  { label: "Safety Alerts", enabled: true },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <p className="text-foreground text-sm">{setting.label}</p>
                    <div
                      className={`w-12 h-7 rounded-full transition-all cursor-pointer ${
                        setting.enabled ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white transition-all ${
                          setting.enabled ? "translate-x-6" : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-card border border-white/8 rounded-[20px] p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-muted/30 hover:bg-muted/50 border border-white/10 text-foreground font-medium rounded-[12px] py-3 text-sm transition-colors">
                  Change Password
                </button>
                <button className="w-full bg-muted/30 hover:bg-muted/50 border border-white/10 text-foreground font-medium rounded-[12px] py-3 text-sm transition-colors">
                  Two-Factor Authentication
                </button>
                <button className="w-full bg-muted/30 hover:bg-muted/50 border border-white/10 text-foreground font-medium rounded-[12px] py-3 text-sm transition-colors">
                  Manage Connected Devices
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-card border border-white/8 rounded-[20px] p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Preferences
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground mb-2">Preferred Language</p>
                  <select className="w-full bg-muted/50 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm text-foreground mb-2">Theme</p>
                  <div className="flex gap-2">
                    {["Light", "Dark", "Auto"].map((theme) => (
                      <button
                        key={theme}
                        className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                          theme === "Dark"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/30 border border-white/10 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/30 rounded-[20px] p-4">
              <h3 className="font-bold text-red-500 mb-3">Danger Zone</h3>
              <button className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-medium rounded-[12px] py-3 text-sm transition-colors flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout from All Devices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
