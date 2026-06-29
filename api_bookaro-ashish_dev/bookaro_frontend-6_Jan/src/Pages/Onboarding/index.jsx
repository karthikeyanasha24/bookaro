import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import { toast } from "react-toastify";
import PageLayout from "../../components/global/PageLayout";

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepDot = ({ active, completed, label, stepNum }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`w-[36px] h-[36px] rounded-full flex items-center justify-center font-[700] text-[14px] transition-all duration-300 ${
        completed
          ? "bg-[#2ECC71] text-white"
          : active
          ? "bg-[#976DD0] text-white shadow-md"
          : "bg-[#EDE8F5] text-[#C4B5D9]"
      }`}
    >
      {completed ? "✓" : stepNum}
    </div>
    <span
      className={`text-[11px] text-center leading-tight max-w-[60px] ${
        active ? "text-[#976DD0] font-[600]" : "text-[#9D90AF]"
      }`}
    >
      {label}
    </span>
  </div>
);

// ─── Option Button ────────────────────────────────────────────────────────────
const OptionBtn = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-5 py-2.5 rounded-[50px] border text-[14px] font-[500] transition-all duration-200 ${
      selected
        ? "bg-[#976DD0] border-[#976DD0] text-white"
        : "bg-white border-[#D8D0E8] text-[#47525E] hover:border-[#976DD0] hover:text-[#976DD0]"
    }`}
  >
    {label}
  </button>
);

// ─── Onboarding Page ──────────────────────────────────────────────────────────
const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    profileType: "",      // buyer | seller | both | agent
    projectTimeline: "",  // now | 6months | 1year | exploring
    budget: "",           // <200k | 200-400k | 400-700k | 700k+
    propertyType: "",     // apartment | house | building | land
    location: "",
    goals: [],            // invest | primary | secondary | rental
    notifications: "all", // all | important | none
  });

  const totalSteps = 5;

  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const toggleGoal = (val) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(val)
        ? prev.goals.filter((g) => g !== val)
        : [...prev.goals, val],
    }));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await ApiClient.put("user/profile", {
        onboardingData: form,
        onboardingComplete: true,
      });
      toast.success("Profile setup complete! Welcome to Bookaroo.");
      navigate("/dashboard");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Profile Type" },
    { label: "Your Goal" },
    { label: "Timeline" },
    { label: "Property" },
    { label: "Finish" },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F5FC] py-8 px-4 md:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-[30px] font-[700] text-[#2D1B4E]">Start your real-estate project</h1>
          <p className="text-[14px] text-[#7B6E8E] mt-1 mb-5">
            Follow these steps to personalize your experience and unlock the right tools.
          </p>
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 xl:col-span-9">
              <div className="w-full bg-white rounded-[20px] shadow-sm border border-[#ECE7F4] overflow-hidden">

                {/* Purple Header */}
                <div className="bg-gradient-to-r from-[#976DD0] to-[#5E3B9E] px-8 py-6 text-white">
                  <h2 className="text-[22px] font-[700] mb-1">Welcome to Bookaroo</h2>
                  <p className="text-[13px] opacity-80">Let&apos;s personalise your profile in a few steps.</p>
                </div>

                {/* Step Indicators */}
                <div className="px-8 py-5 border-b border-[#F0EBF8]">
                  <div className="flex items-start justify-between gap-2">
                    {steps.map((s, i) => (
                      <StepDot
                        key={i}
                        stepNum={i + 1}
                        label={s.label}
                        active={step === i + 1}
                        completed={step > i + 1}
                      />
                    ))}
                  </div>
                  <div className="mt-4 bg-[#EDE8F5] rounded-full h-[6px]">
                    <div
                      className="bg-[#976DD0] h-[6px] rounded-full transition-all duration-500"
                      style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="px-8 py-6 min-h-[300px]">

          {/* Step 1 — Profile Type */}
          {step === 1 && (
            <div>
              <h2 className="text-[#2D1B4E] text-[17px] font-[600] mb-2">
                What best describes you?
              </h2>
              <p className="text-[#7B6E8E] text-[13px] mb-5">
                This helps us tailor the platform for your needs.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "🏠 Buyer", value: "buyer" },
                  { label: "🏷️ Seller", value: "seller" },
                  { label: "🔄 Both", value: "both" },
                  { label: "🏢 Agent / Pro", value: "agent" },
                ].map((opt) => (
                  <OptionBtn
                    key={opt.value}
                    label={opt.label}
                    selected={form.profileType === opt.value}
                    onClick={() => setField("profileType", opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Goals */}
          {step === 2 && (
            <div>
              <h2 className="text-[#2D1B4E] text-[17px] font-[600] mb-2">
                What are your real estate goals?
              </h2>
              <p className="text-[#7B6E8E] text-[13px] mb-5">
                Select all that apply.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "🏠 Primary Residence", value: "primary" },
                  { label: "🏖️ Secondary Home", value: "secondary" },
                  { label: "💼 Investment / Rental", value: "rental" },
                  { label: "🏢 Commercial", value: "commercial" },
                  { label: "📈 Portfolio Building", value: "portfolio" },
                ].map((opt) => (
                  <OptionBtn
                    key={opt.value}
                    label={opt.label}
                    selected={form.goals.includes(opt.value)}
                    onClick={() => toggleGoal(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Timeline */}
          {step === 3 && (
            <div>
              <h2 className="text-[#2D1B4E] text-[17px] font-[600] mb-2">
                What's your project timeline?
              </h2>
              <p className="text-[#7B6E8E] text-[13px] mb-5">
                Bookaroo is designed to work with your schedule.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "⚡ Ready now", value: "now" },
                  { label: "📅 In 6 months", value: "6months" },
                  { label: "🗓️ In 1–2 years", value: "1year" },
                  { label: "🔭 Just exploring", value: "exploring" },
                ].map((opt) => (
                  <OptionBtn
                    key={opt.value}
                    label={opt.label}
                    selected={form.projectTimeline === opt.value}
                    onClick={() => setField("projectTimeline", opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Property Preferences */}
          {step === 4 && (
            <div>
              <h2 className="text-[#2D1B4E] text-[17px] font-[600] mb-2">
                What type of property are you interested in?
              </h2>
              <p className="text-[#7B6E8E] text-[13px] mb-5">
                This helps us surface the right listings for you.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                {[
                  { label: "🏢 Apartment", value: "apartment" },
                  { label: "🏠 House", value: "house" },
                  { label: "🏗️ Building", value: "building" },
                  { label: "🌳 Land", value: "land" },
                ].map((opt) => (
                  <OptionBtn
                    key={opt.value}
                    label={opt.label}
                    selected={form.propertyType === opt.value}
                    onClick={() => setField("propertyType", opt.value)}
                  />
                ))}
              </div>
              <div>
                <label className="text-[#47525E] text-[13px] font-[500] block mb-2">
                  Preferred location (city / region)
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="e.g. Paris, Lyon, Bordeaux…"
                  className="w-full border border-[#D8D0E8] rounded-[10px] px-4 py-2.5 text-[14px] text-[#47525E] outline-none focus:border-[#976DD0] transition"
                />
              </div>
            </div>
          )}

          {/* Step 5 — Finish */}
          {step === 5 && (
            <div className="text-center py-4">
              <span className="text-[56px] block mb-3">🎊</span>
              <h2 className="text-[#2D1B4E] text-[20px] font-[700] mb-2">
                You're all set!
              </h2>
              <p className="text-[#7B6E8E] text-[14px] mb-6 max-w-[360px] mx-auto">
                Your Bookaroo experience has been personalised. Head to your dashboard to start exploring.
              </p>
              <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-6 text-left">
                  {[
                    { label: "Profile", value: form.profileType || "—" },
                    { label: "Timeline", value: form.projectTimeline || "—" },
                    { label: "Property", value: form.propertyType || "—" },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[11px] text-[#9D90AF]">{item.label}</p>
                      <p className="text-[13px] text-[#47525E] font-[600] capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
                </div>

                {/* Navigation Buttons */}
                <div className="px-8 pb-7 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-[#976DD0] text-[14px] font-[600] hover:underline"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="text-[#9D90AF] text-[14px] hover:underline"
            >
              Skip for now
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 1 && !form.profileType) ||
                (step === 2 && form.goals.length === 0) ||
                (step === 3 && !form.projectTimeline)
              }
              className="bg-[#976DD0] hover:bg-[#7a5ba6] transition disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-[600] px-6 py-2.5 rounded-full"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="bg-[#976DD0] hover:bg-[#7a5ba6] transition disabled:opacity-60 text-white text-[14px] font-[600] px-6 py-2.5 rounded-full"
            >
              {loading ? "Saving…" : "Go to Dashboard →"}
            </button>
          )}
                </div>
              </div>
            </div>
            <div className="col-span-12 xl:col-span-3">
              <div className="bg-white border border-[#ECE7F4] rounded-[16px] p-4 shadow-sm">
                <h3 className="text-[16px] font-[700] text-[#2D1B4E]">Onboarding checklist</h3>
                <div className="mt-3 h-[8px] rounded-full bg-[#ECE7F4] overflow-hidden">
                  <div
                    className="h-full bg-[#976DD0]"
                    style={{ width: `${Math.round((step / totalSteps) * 100)}%` }}
                  />
                </div>
                <p className="text-[12px] text-[#6B7280] mt-2">
                  {Math.round((step / totalSteps) * 100)}% complete - steps completed {step}/{totalSteps}
                </p>
                <ul className="mt-4 space-y-2">
                  {steps.map((s, idx) => {
                    const completed = step > idx + 1;
                    const current = step === idx + 1;
                    return (
                      <li key={s.label} className="flex items-center gap-2">
                        <span
                          className={`w-[18px] h-[18px] rounded-full text-[11px] flex items-center justify-center ${
                            completed
                              ? "bg-[#2ECC71] text-white"
                              : current
                              ? "bg-[#976DD0] text-white"
                              : "bg-[#F1EBFA] text-[#A390C4]"
                          }`}
                        >
                          {completed ? "✓" : idx + 1}
                        </span>
                        <span className="text-[13px] text-[#4B5563]">{s.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-4 w-full bg-[#976DD0] text-white text-[13px] font-[600] px-4 py-2 rounded-full hover:bg-[#7a5ba6] transition"
                >
                  Go to dashboard
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-[#9D90AF] text-[12px] hover:text-[#976DD0] hover:underline transition"
          >
            Skip onboarding and go to dashboard
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Onboarding;
