import { ArrowLeft, BellRing, Camera, CheckCheck, ChevronDown, Library, Lock, PanelRight, ShieldCheck, User, UserCircle2 } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CompletionModal } from "@/components/ui/WelcomeModal";
const PROFILE_STORAGE_KEY = "Mira_profile_settings";
const PREFERENCES_STORAGE_KEY = "Mira_profile_preferences";
const MAX_AVATAR_SIZE_BYTES = 2_000_000;
const DEFAULT_AVATAR_URL = "/profile-avatar_18931206.png";

type ProfileSettings = {
  fullName: string;
  phone: string;
  email: string;
  role: string;
  department: string;
  avatarDataUrl: string;
};

type PreferenceSettings = {
  notificationsEnabled: boolean;
  secureLogin: boolean;
  privacyMode: boolean;
};

type SettingsTab = "profile" | "preferences";

function Manager() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profileForm, setProfileForm] = useState<ProfileSettings>({
    fullName: "Adebayo Musa",
    phone: "+234 800 000 0000",
    email: "adebayo@gmail.com",
    role: "Student finance officer",
    department: "Accounts",
    avatarDataUrl: DEFAULT_AVATAR_URL,
  });
  const [preferences, setPreferences] = useState<PreferenceSettings>({
    notificationsEnabled: true,
    secureLogin: true,
    privacyMode: false,
  });
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as Partial<ProfileSettings>;
        setProfileForm((current) => ({
          ...current,
          ...parsedProfile,
          avatarDataUrl: parsedProfile.avatarDataUrl || current.avatarDataUrl,
        }));
      }

      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences) as Partial<PreferenceSettings>;
        setPreferences((current) => ({
          ...current,
          ...parsedPreferences,
        }));
      }
    } catch {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    }
  }, []);

  const isActive = (path: string) => pathname === path;
  const getIconClass = (path: string) =>
    isActive(path) ? "text-white" : "text-[#c9cbed]/70";

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError("Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileForm((current) => ({ ...current, avatarDataUrl: dataUrl }));
      setAvatarError(null);
      setSaveMessage("Photo updated. Save to keep the change.");
    };
    reader.onerror = () => {
      setAvatarError("We could not read that image. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileForm));
    window.dispatchEvent(new StorageEvent("storage", { key: PROFILE_STORAGE_KEY }));
    setTimeout(() => {
      setSaveMessage("Profile updated successfully.");
      setIsSaving(false);
       setShowCompletion(true);
    }, 300);
  };

  const togglePreference = (key: keyof PreferenceSettings) => {
    setPreferences((current) => {
      const nextValue = !current[key];
      const nextState = { ...current, [key]: nextValue };
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  };

  return (
    <div className="min-h-screen bg-[#180b28] pb-28 text-slate-900" style={{ fontFamily: "Sora, sans-serif" }}>
      <div className="mx-auto max-w-md px-4 py-6">
        <div className="rounded-[2rem] bg-[#180b28] px-4 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#5f67ac]/15 transition hover:bg-[#5f67ac]/25"
            >
              <ArrowLeft className="h-5 w-5 text-[#d8daf7]" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold text-white">Settings</h1>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-white/0" />
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <label htmlFor="avatar-upload" className="relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-full bg-[#f4f2ff] shadow-sm ring-4 ring-[#5f67ac]/35 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5f67ac]">
              {profileForm.avatarDataUrl ? (
                <img src={profileForm.avatarDataUrl} alt="Profile preview" className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#f4f2ff]">
                  <UserCircle2 className="h-16 w-16 text-[#5f67ac]" />
                </div>
              )}
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
              <span className="pointer-events-none absolute bottom-1 right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5f67ac] shadow-sm">
                <Camera className="h-4 w-4" />
              </span>
            </label>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">{profileForm.fullName}</p>
              <p className="text-sm text-slate-500">Profile settings</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.25rem] bg-[#180b28] p-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 rounded-full bg-white/10 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                activeTab === "profile" ? "bg-[#5f67ac] text-white" : "text-slate-300"
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preferences")}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                activeTab === "preferences" ? "bg-[#5f67ac] text-white" : "text-slate-300"
              }`}
            >
              Preferences
            </button>
          </div>

          {activeTab === "profile" ? (
            <form onSubmit={handleProfileSave} className="mt-4 space-y-4">
              <div className="rounded-[1rem] border border-[#5f67ac]/25 bg-[#5f67ac]/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Personal details</p>
                    <p className="text-xs text-slate-500">Update your account information below.</p>
                  </div>
               
                </div>

                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium text-white">
                    Full name
                    <input
                      value={profileForm.fullName}
                      onChange={(event) => setProfileForm((current) => ({ ...current, fullName: event.target.value }))}
                      placeholder="Your full name"
                      className="mt-2 w-full rounded-xl border border-[#5f67ac]/25 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#5f67ac] focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm font-medium text-white">
                    Phone number
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                      placeholder="Phone number"
                      className="mt-2 w-full rounded-xl border border-[#5f67ac]/25 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#5f67ac] focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm font-medium text-white">
                    Email address
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="Email address"
                      className="mt-2 w-full rounded-xl border border-[#5f67ac]/25 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#5f67ac] focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm font-medium text-white">
                    Role
                    <input
                      value={profileForm.role}
                      onChange={(event) => setProfileForm((current) => ({ ...current, role: event.target.value }))}
                      placeholder="Your title"
                      className="mt-2 w-full rounded-xl border border-[#5f67ac]/25 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#5f67ac] focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm font-medium text-white">
                    Department
                    <input
                      value={profileForm.department}
                      onChange={(event) => setProfileForm((current) => ({ ...current, department: event.target.value }))}
                      placeholder="Department"
                      className="mt-2 w-full rounded-xl border border-[#5f67ac]/25 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#5f67ac] focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-[#5f67ac] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4d559c] disabled:cursor-not-allowed disabled:bg-[#9da3d4]"
              >
                {isSaving ? "Saving..." : "Save profile"}
              </button>

              {avatarError ? <p className="text-sm text-red-300">{avatarError}</p> : null}
              {saveMessage ? <p className="text-sm text-slate-300">{saveMessage}</p> : null}
            </form>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="rounded-[1rem] border border-[#5f67ac]/25 bg-[#5f67ac]/10 p-4">
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen((current) => !current)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">Other important settings</p>
                    <p className="text-xs text-slate-500">Manage the controls that matter most.</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-[#d8daf7] transition ${isPreferencesOpen ? "rotate-180" : ""}`} />
                </button>

                {isPreferencesOpen ? (
                  <div className="mt-4 space-y-3 border-t border-[#5f67ac]/20 pt-4">
                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <BellRing className="h-5 w-5 text-[#d8daf7]" />
                        <div>
                          <p className="text-sm font-semibold text-white">Notifications</p>
                          <p className="text-xs text-slate-500">Get payment reminders and updates.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Toggle notifications"
                        onClick={() => togglePreference("notificationsEnabled")}
                        className={`relative h-6 w-11 rounded-full transition ${preferences.notificationsEnabled ? "bg-[#5f67ac]" : "bg-slate-700"}`}
                      >
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${preferences.notificationsEnabled ? "left-6" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-[#d8daf7]" />
                        <div>
                          <p className="text-sm font-semibold text-white">Secure sign-in</p>
                          <p className="text-xs text-slate-500">Keep account access protected.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Toggle secure sign-in"
                        onClick={() => togglePreference("secureLogin")}
                        className={`relative h-6 w-11 rounded-full transition ${preferences.secureLogin ? "bg-[#5f67ac]" : "bg-slate-700"}`}
                      >
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${preferences.secureLogin ? "left-6" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-[#d8daf7]" />
                        <div>
                          <p className="text-sm font-semibold text-white">Privacy mode</p>
                          <p className="text-xs text-slate-500">Limit profile visibility on shared views.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Toggle privacy mode"
                        onClick={() => togglePreference("privacyMode")}
                        className={`relative h-6 w-11 rounded-full transition ${preferences.privacyMode ? "bg-[#5f67ac]" : "bg-slate-700"}`}
                      >
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${preferences.privacyMode ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav
        className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-10 rounded-full px-6 py-3"
        style={{
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(95,103,172,.28)",
          boxShadow: "0 14px 32px rgba(24,11,40,.32)",
        }}
      >
        <a href="/home" aria-label="Home"><PanelRight className={getIconClass("/home")} /></a>
        <a href="/Searchreceipts" aria-label="Receipts"><CheckCheck className={getIconClass("/Searchreceipts")} /></a>
        <a href="/docs" aria-label="Docs"><Library className={getIconClass("/docs")} /></a>
        <a href="/manager" aria-label="Profile"><User className={getIconClass("/manager")} /></a>
      </nav>
       <CompletionModal
        open={showCompletion}
        onClose={() => setShowCompletion(false)}
        title="Profile updated"
        message="Your changes are saved and now reflected across Mira."
      />
    </div>
  );
}

export default Manager;
