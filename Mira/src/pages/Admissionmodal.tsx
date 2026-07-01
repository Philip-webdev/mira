import { useState, useEffect, ReactNode } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  ArrowRight,
  Play,
} from "lucide-react";



interface InstitutionType {
  id: string;
  icon: string;
  name: string;
  sub: string;
}

interface Intent {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

interface FormState {
  institution_name: string;
  institution_type: string;
  address: string;
  state: string;
  country: string;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone: string;
  student_count: string;
  current_payment_method: string;
  challenges: string;
  intent: string;
  referral_source: string;
}

type FormErrors = Partial<Record<keyof FormState | string, string>>;

interface AdmissionModalProps {
  open: boolean;
  onClose: () => void;
  defaultIntent?: string;
}

interface FieldProps {
  label: string;
  id: keyof FormState | string;
  required?: boolean;
  children: ReactNode;
  errors: FormErrors;
}

interface TriggerButtonProps {
  children?: ReactNode;
  className?: string;
}

const INSTITUTION_TYPES: InstitutionType[] = [
  { id: "nursery_primary", icon: "🏫", name: "Nursery / Primary", sub: "Ages 3–11" },
  { id: "secondary",       icon: "📚", name: "Secondary School",  sub: "JSS / SSS" },
  { id: "tertiary",        icon: "🎓", name: "College / Uni",     sub: "Higher Ed" },
  { id: "vocational",      icon: "🔧", name: "Vocational",        sub: "Tech & Trade" },
  { id: "religious",       icon: "⛪", name: "Faith-Based",       sub: "Mission schools" },
  { id: "other",           icon: "🏛️", name: "Other",             sub: "Government etc." },
];

const INTENTS: Intent[] = [
  { id: "get_started",  icon: "🚀", name: "Get Started Free", desc: "Sign up and begin onboarding your institution immediately." },
  { id: "book_demo",    icon: "🎥", name: "Book a Demo",       desc: "Schedule a walkthrough with our team before committing." },
  { id: "pilot",        icon: "🧪", name: "Run a Pilot",       desc: "Test Mira with a small cohort before full rollout." },
  { id: "pricing_info", icon: "💬", name: "Get Pricing Info",  desc: "Speak with us about custom enterprise pricing." },
];

const STEPS = ["Institution", "Contact", "Details", "Intent"] as const;

const BLANK_FORM: FormState = {
  institution_name: "",
  institution_type: "",
  address: "",
  state: "",
  country: "Nigeria",
  contact_name: "",
  contact_role: "",
  contact_email: "",
  contact_phone: "",
  student_count: "",
  current_payment_method: "",
  challenges: "",
  intent: "",
  referral_source: "",
};



function validate(step: number, form: FormState): FormErrors {
  const errs: FormErrors = {};

  if (step === 0) {
    if (!form.institution_name.trim()) errs.institution_name = "Institution name is required";
    if (!form.institution_type)        errs.institution_type = "Please select a type";
    if (!form.state.trim())            errs.state   = "State is required";
    if (!form.country.trim())          errs.country = "Country is required";
  }

  if (step === 1) {
    if (!form.contact_name.trim())  errs.contact_name  = "Contact name is required";
    if (!form.contact_role.trim())  errs.contact_role  = "Role is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email))
                                    errs.contact_email = "Valid email required";
    if (!form.contact_phone.trim()) errs.contact_phone = "Phone number is required";
  }

  if (step === 2) {
    if (!form.student_count) errs.student_count = "Required";
  }

  if (step === 3) {
    if (!form.intent) errs.intent = "Please select an option";
  }

  return errs;
}


function Field({ label, id, required = false, children, errors }: FieldProps) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={String(id)}>
        {label}
        {required && <span className="field-required">*</span>}
      </label>
      {children}
      {errors[id] && <span className="field-error">{errors[id]}</span>}
    </div>
  );
}



export function AdmissionModal({ open, onClose, defaultIntent = "" }: AdmissionModalProps) {
  const [step, setStep]           = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading]     = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [errors, setErrors]       = useState<FormErrors>({});
  const [form, setForm]           = useState<FormState>({ ...BLANK_FORM, intent: defaultIntent });

  useEffect(() => {
    if (open) {
      setStep(0);
      setSubmitted(false);
      setLoading(false);
      setSubmitError("");
      setErrors({});
      setForm({ ...BLANK_FORM, intent: defaultIntent });
    }
  }, [open, defaultIntent]);

  if (!open) return null;

  const setField = (key: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleNext = (): void => {
    const errs = validate(step, form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      void handleSubmit();
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch(`${import.meta.env.BACK_URL}/admissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div
        className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-box">

          {/* ── Header ── */}
          <div className="modal-header">
            <div className="modal-badge">
            
              Institution Admission
            </div>
            <div className="modal-title">
              {submitted
                ? "You're in! 🎉"
                : <><em>MiraDash</em>: Africa's School Payment OS</>}
            </div>
            {!submitted && (
              <div className="modal-sub">
                Tell us about your institution and we'll get you set up fast.
              </div>
            )}
            <button className="modal-close" type="button" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {/* ── Progress ── */}
          {!submitted && (
            <div className="modal-progress">
              <div className="progress-steps">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`prog-step ${i < step ? "done" : i === step ? "active" : ""}`}
                  >
                    <div className="prog-dot">
                      {i < step ? <CheckCircle size={13} /> : i + 1}
                    </div>
                    <div className="prog-label">{s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Body ── */}
          <div className="modal-body">
            {submitted ? (
              <SuccessScreen form={form} onClose={onClose} />
            ) : (
              <>
                {step === 0 && <StepInstitution form={form} errors={errors} setField={setField} />}
                {step === 1 && <StepContact     form={form} errors={errors} setField={setField} />}
                {step === 2 && <StepDetails     form={form} errors={errors} setField={setField} />}
                {step === 3 && (
                  <StepIntent
                    form={form}
                    errors={errors}
                    setField={setField}
                    submitError={submitError}
                  />
                )}
              </>
            )}
          </div>

          {/* ── Footer ── */}
          {!submitted && (
            <div className="modal-footer">
              {step > 0 ? (
                <button className="btn-back" type="button" onClick={() => setStep((s) => s - 1)}>
                  <ChevronLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}
              <button
                className="btn-next"
                type="button"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Submitting…</span>
                  </>
                ) : step === 3 ? (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── STEP COMPONENTS ─────────────────────────── */

interface StepProps {
  form: FormState;
  errors: FormErrors;
  setField: (key: keyof FormState, value: string) => void;
}

function StepInstitution({ form, errors, setField }: StepProps) {
  return (
    <>
      <div className="step-title">Tell us about your institution</div>
      <div className="fields-grid">

        <Field label="Institution Name" id="institution_name" required errors={errors}>
          <input
            id="institution_name"
            className={`field-input${errors.institution_name ? " error" : ""}`}
            placeholder="e.g. Greenfield Academy"
            value={form.institution_name}
            onChange={(e) => setField("institution_name", e.target.value)}
          />
        </Field>

        <div className="field-group">
          <label className="field-label">
            Institution Type<span className="field-required">*</span>
          </label>
          <div className="type-cards">
            {INSTITUTION_TYPES.map((t) => (
              <div
                key={t.id}
                className={`type-card${form.institution_type === t.id ? " selected" : ""}`}
                onClick={() => setField("institution_type", t.id)}
              >
                <div className="type-check"><CheckCircle size={11} color="#fff" /></div>
                <div className="type-card-icon">{t.icon}</div>
                <div className="type-card-name">{t.name}</div>
                <div className="type-card-sub">{t.sub}</div>
              </div>
            ))}
          </div>
          {errors.institution_type && (
            <span className="field-error">{errors.institution_type}</span>
          )}
        </div>

        <Field label="Institution Address" id="address" errors={errors}>
          <input
            id="address"
            className="field-input"
            placeholder="Street address"
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
          />
        </Field>

        <div className="fields-grid two-col">
          <Field label="State / Region" id="state" required errors={errors}>
            <input
              id="state"
              className={`field-input${errors.state ? " error" : ""}`}
              placeholder="e.g. Lagos"
              value={form.state}
              onChange={(e) => setField("state", e.target.value)}
            />
          </Field>
          <Field label="Country" id="country" required errors={errors}>
            <select
              id="country"
              className={`field-select${errors.country ? " error" : ""}`}
              value={form.country}
              onChange={(e) => setField("country", e.target.value)}
            >
              {["Nigeria","Ghana","Kenya","Uganda","Tanzania","Cameroon","Senegal","Other"].map(
                (c) => <option key={c}>{c}</option>
              )}
            </select>
          </Field>
        </div>

      </div>
    </>
  );
}

function StepContact({ form, errors, setField }: StepProps) {
  return (
    <>
      <div className="step-title">Who should we contact?</div>
      <div className="fields-grid">

        <div className="fields-grid two-col">
          <Field label="Full Name" id="contact_name" required errors={errors}>
            <input
              id="contact_name"
              className={`field-input${errors.contact_name ? " error" : ""}`}
              placeholder="e.g. Amaka Okonkwo"
              value={form.contact_name}
              onChange={(e) => setField("contact_name", e.target.value)}
            />
          </Field>
          <Field label="Role / Title" id="contact_role" required errors={errors}>
            <input
              id="contact_role"
              className={`field-input${errors.contact_role ? " error" : ""}`}
              placeholder="e.g. Bursar, Principal"
              value={form.contact_role}
              onChange={(e) => setField("contact_role", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Work Email" id="contact_email" required errors={errors}>
          <input
            id="contact_email"
            type="email"
            className={`field-input${errors.contact_email ? " error" : ""}`}
            placeholder="bursar@greenfield.edu.ng"
            value={form.contact_email}
            onChange={(e) => setField("contact_email", e.target.value)}
          />
        </Field>

        <Field label="Phone Number" id="contact_phone" required errors={errors}>
          <input
            id="contact_phone"
            type="tel"
            className={`field-input${errors.contact_phone ? " error" : ""}`}
            placeholder="+234 800 000 0000"
            value={form.contact_phone}
            onChange={(e) => setField("contact_phone", e.target.value)}
          />
        </Field>

        <Field label="How did you hear about Mira?" id="referral_source" errors={errors}>
          <select
            id="referral_source"
            className="field-select"
            value={form.referral_source}
            onChange={(e) => setField("referral_source", e.target.value)}
          >
            <option value="">Select an option</option>
            {["Social Media","Word of Mouth","Google Search","Conference / Event","Partner Referral","WhatsApp / Telegram","Other"].map(
              (o) => <option key={o}>{o}</option>
            )}
          </select>
        </Field>

      </div>
    </>
  );
}

function StepDetails({ form, errors, setField }: StepProps) {
  return (
    <>
      <div className="step-title">Help us tailor Mira for you</div>
      <div className="fields-grid">

        <Field label="Approximate Student Enrollment" id="student_count" required errors={errors}>
          <select
            id="student_count"
            className={`field-select${errors.student_count ? " error" : ""}`}
            value={form.student_count}
            onChange={(e) => setField("student_count", e.target.value)}
          >
            <option value="">Select range</option>
            {["1–100","101–500","501–1,000","1,001–5,000","5,001–15,000","15,000+"].map(
              (o) => <option key={o}>{o}</option>
            )}
          </select>
        </Field>

        <Field label="Current Payment Method" id="current_payment_method" errors={errors}>
          <select
            id="current_payment_method"
            className="field-select"
            value={form.current_payment_method}
            onChange={(e) => setField("current_payment_method", e.target.value)}
          >
            <option value="">Select current method</option>
            {["Cash / Manual Collection","Bank Deposit & Teller","Existing School Software","Informal Agent Collection","Another Fintech App","No Formal System"].map(
              (o) => <option key={o}>{o}</option>
            )}
          </select>
        </Field>

        <Field label="What's your biggest payment challenge?" id="challenges" errors={errors}>
          <textarea
            id="challenges"
            className="field-textarea"
            placeholder="e.g. Reconciling bank deposits, chasing defaulters, no real-time visibility..."
            value={form.challenges}
            onChange={(e) => setField("challenges", e.target.value)}
          />
        </Field>

      </div>
    </>
  );
}

interface StepIntentProps extends StepProps {
  submitError: string;
}

function StepIntent({ form, errors, setField, submitError }: StepIntentProps) {
  return (
    <>
      <div className="step-title">What would you like to do first?</div>
      <div className="intent-cards">
        {INTENTS.map((i) => (
          <div
            key={i.id}
            className={`intent-card${form.intent === i.id ? " selected" : ""}`}
            onClick={() => setField("intent", i.id)}
          >
            <div className="intent-icon">{i.icon}</div>
            <div>
              <div className="intent-name">{i.name}</div>
              <div className="intent-desc">{i.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {errors.intent && (
        <span className="field-error" style={{ marginTop: "0.5rem", display: "block" }}>
          {errors.intent}
        </span>
      )}
      {submitError && (
        <div className="submit-error" style={{ marginTop: "1rem" }}>{submitError}</div>
      )}
    </>
  );
}

/* ─────────────────────────── SUCCESS SCREEN ─────────────────────────── */

interface SuccessScreenProps {
  form: FormState;
  onClose: () => void;
}

function SuccessScreen({ form, onClose }: SuccessScreenProps) {
  return (
    <div className="success-wrap">
      <div className="success-icon-wrap">
        <CheckCircle size={40} color="#fff" />
      </div>
      <div className="success-title">Application Received!</div>
      <div className="success-body">
        Thank you, <strong>{form.contact_name.split(" ")[0]}</strong>. Your admission request for{" "}
        <strong>{form.institution_name}</strong> has been submitted. Our team will reach out to{" "}
        {form.contact_email} within 24 hours to get you onboarded.
      </div>
      <div className="success-highlights">
        {["Verification within 24 hours", "Free 30-day trial included", "Dedicated onboarding support"].map(
          (t) => (
            <div key={t} className="success-hl">
              <CheckCircle size={16} color="var(--leaf)" />
              <span>{t}</span>
            </div>
          )
        )}
      </div>
      <button className="btn-success-close" type="button" onClick={onClose}>
        Done, thanks!
      </button>
    </div>
  );
}

/* ─────────────────────────── TRIGGER BUTTONS ─────────────────────────── */

export function GetStartedButton({ children = "Get Started Free", className = "" }: TriggerButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <style>{CSS}</style>
      <button className={`btn-cta-main ${className}`} type="button" onClick={() => setOpen(true)}>
        {children} <ArrowRight size={18} />
      </button>
      <AdmissionModal open={open} onClose={() => setOpen(false)} defaultIntent="get_started" />
    </>
  );
}

export function BookDemoButton({ children = "Book a Demo", className = "" }: TriggerButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <style>{CSS}</style>
      <button className={`btn-cta-demo ${className}`} type="button" onClick={() => setOpen(true)}>
        <Play size={16} /> {children}
      </button>
      <AdmissionModal open={open} onClose={() => setOpen(false)} defaultIntent="book_demo" />
    </>
  );
}

/* ─────────────────────────── STYLES ─────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --sage: rgb(201,221,176); --sage-d: rgb(168,196,136);
    --ink: #0d1a0f; --leaf: #2d6a4f; --lime: #74c442;
    --cream: #f8f5ee;
  }

  .modal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(13,26,15,0.72); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    animation: overlayIn .3s ease both;
  }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-box {
    background: var(--cream); border-radius: 28px;
    width: 100%; max-width: 640px; max-height: 92vh;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 40px 100px rgba(0,0,0,0.35);
    animation: modalIn .4s cubic-bezier(.16,1,.3,1) both; position: relative;
  }
  @keyframes modalIn { from { opacity: 0; transform: translateY(40px) scale(.96); } to { opacity: 1; transform: none; } }

  .modal-header {
    background: var(--ink); padding: 2rem 2.5rem 1.75rem;
    position: relative; flex-shrink: 0;
  }
  .modal-header::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--lime), transparent);
  }
  .modal-badge {
    display: inline-flex; align-items: center; gap: .45rem;
    padding: .3rem .9rem; border-radius: 99px;
    background: rgba(116,196,66,.15); border: 1px solid rgba(116,196,66,.3);
    font-size: .72rem; font-weight: 700; color: var(--lime);
    letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1rem;
  }
  .modal-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); animation: kp-pulse 1.5s infinite; }
  @keyframes kp-pulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }

  .modal-title {
    font-family: 'Sora', sans-serif; font-weight: 800;
    font-size: 1.55rem; color: #fff; letter-spacing: -1px; line-height: 1.1; margin-bottom: .4rem;
  }
  .modal-title em { color: var(--lime); font-style: normal; }
  .modal-sub { font-size: .88rem; color: rgba(255,255,255,.5); line-height: 1.5; }
  .modal-close {
    position: absolute; top: 1.5rem; right: 1.75rem;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    color: rgba(255,255,255,.6); border-radius: 99px;
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s;
  }
  .modal-close:hover { background: rgba(255,255,255,.16); color: #fff; }

  .modal-progress { padding: 1.25rem 2.5rem .5rem; flex-shrink: 0; background: var(--cream); }
  .progress-steps { display: flex; align-items: center; }
  .prog-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
  .prog-step:not(:last-child)::after {
    content: ''; position: absolute; top: 14px; left: 50%;
    width: 100%; height: 2px; background: rgba(45,106,79,.15); z-index: 0; transition: background .4s;
  }
  .prog-step.done:not(:last-child)::after { background: var(--leaf); }
  .prog-dot {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif; font-size: .7rem; font-weight: 800;
    border: 2px solid rgba(45,106,79,.2); background: var(--cream); color: #9ca3af;
    position: relative; z-index: 1; transition: all .3s;
  }
  .prog-step.active .prog-dot { border-color: var(--leaf); background: var(--leaf); color: #fff; }
  .prog-step.done .prog-dot  { border-color: var(--lime);  background: var(--lime);  color: var(--ink); }
  .prog-label { font-size: .65rem; font-weight: 600; color: #9ca3af; margin-top: .4rem; letter-spacing: .04em; text-transform: uppercase; }
  .prog-step.active .prog-label { color: var(--leaf); }
  .prog-step.done  .prog-label { color: var(--lime); }

  .modal-body { padding: 1.75rem 2.5rem 2rem; overflow-y: auto; flex: 1; }
  .modal-body::-webkit-scrollbar { width: 4px; }
  .modal-body::-webkit-scrollbar-thumb { background: var(--sage-d); border-radius: 99px; }

  .step-title { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1.05rem; color: var(--ink); margin-bottom: 1.5rem; }

  .fields-grid { display: grid; gap: 1rem; }
  .fields-grid.two-col { grid-template-columns: 1fr 1fr; }
  .field-group { display: flex; flex-direction: column; gap: .45rem; }
  .field-label { font-size: .78rem; font-weight: 700; color: #4a5a4c; letter-spacing: .04em; text-transform: uppercase; }
  .field-required { color: var(--leaf); margin-left: 2px; }
  .field-input, .field-select, .field-textarea {
    padding: .75rem 1rem; border-radius: 12px; border: 1.5px solid rgba(45,106,79,.18);
    background: #fff; color: var(--ink); font-family: 'Sora', sans-serif; font-size: .93rem;
    transition: all .2s; outline: none; width: 100%;
  }
  .field-input:focus, .field-select:focus, .field-textarea:focus {
    border-color: var(--leaf); box-shadow: 0 0 0 3px rgba(45,106,79,.1);
  }
  .field-input::placeholder, .field-textarea::placeholder { color: #b0beb2; }
  .field-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232d6a4f' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem; cursor: pointer;
  }
  .field-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
  .field-input.error, .field-select.error { border-color: #e05c3a; }
  .field-error { font-size: .75rem; color: #e05c3a; font-weight: 500; }

  .type-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; }
  .type-card {
    padding: 1.1rem .9rem; border-radius: 14px; border: 2px solid rgba(45,106,79,.15);
    background: #fff; cursor: pointer; text-align: center; transition: all .2s; position: relative;
  }
  .type-card:hover { border-color: var(--sage-d); background: var(--sage); }
  .type-card.selected { border-color: var(--leaf); background: rgba(45,106,79,.06); }
  .type-card-icon { font-size: 1.6rem; margin-bottom: .5rem; }
  .type-card-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: .78rem; color: var(--ink); }
  .type-card-sub { font-size: .68rem; color: #9ca3af; margin-top: .2rem; }
  .type-check {
    position: absolute; top: .5rem; right: .5rem; width: 18px; height: 18px; border-radius: 50%;
    background: var(--leaf); display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .2s;
  }
  .type-card.selected .type-check { opacity: 1; }

  .intent-cards { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .intent-card {
    padding: 1.25rem 1rem; border-radius: 14px; border: 2px solid rgba(45,106,79,.15);
    background: #fff; cursor: pointer; transition: all .2s; display: flex; gap: .75rem; align-items: flex-start;
  }
  .intent-card:hover { border-color: var(--sage-d); }
  .intent-card.selected { border-color: var(--leaf); background: rgba(45,106,79,.06); }
  .intent-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: .1rem; }
  .intent-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: .85rem; color: var(--ink); margin-bottom: .2rem; }
  .intent-desc { font-size: .75rem; color: #6b7280; line-height: 1.4; }

  .modal-footer {
    padding: 1.25rem 2.5rem 1.75rem; border-top: 1px solid rgba(45,106,79,.1);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0; background: var(--cream); gap: 1rem;
  }
  .btn-back {
    display: flex; align-items: center; gap: .4rem; padding: .75rem 1.5rem; border-radius: 99px;
    border: 1.5px solid rgba(45,106,79,.25); background: transparent; color: var(--ink);
    font-family: 'Sora', sans-serif; font-weight: 700; font-size: .88rem; cursor: pointer; transition: all .2s;
  }
  .btn-back:hover { border-color: var(--leaf); background: rgba(45,106,79,.05); }
  .btn-next {
    display: flex; align-items: center; gap: .5rem; padding: .8rem 2rem; border-radius: 99px;
    border: none; background: var(--ink); color: #fff;
    font-family: 'Sora', sans-serif; font-weight: 700; font-size: .95rem;
    cursor: pointer; transition: all .25s; position: relative; overflow: hidden; margin-left: auto;
  }
  .btn-next::before {
    content: ''; position: absolute; inset: 0; background: var(--leaf);
    transform: scaleX(0); transform-origin: left; transition: transform .3s; z-index: 0;
  }
  .btn-next:hover::before { transform: scaleX(1); }
  .btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2); }
  .btn-next > * { position: relative; z-index: 1; }
  .btn-next:disabled { opacity: .5; cursor: not-allowed; }
  .btn-next:disabled:hover { transform: none; box-shadow: none; }
  .btn-next:disabled::before { transform: scaleX(0) !important; }

  .success-wrap { text-align: center; padding: 2rem 1rem 1rem; }
  .success-icon-wrap {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, var(--leaf), var(--lime));
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem; box-shadow: 0 16px 40px rgba(45,106,79,.3);
    animation: popIn .5s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes popIn { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: scale(1); } }
  .success-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--ink); letter-spacing: -1px; margin-bottom: .75rem; }
  .success-body { font-size: .95rem; color: #4a5a4c; line-height: 1.7; max-width: 400px; margin: 0 auto 2rem; }
  .success-highlights { display: flex; flex-direction: column; gap: .5rem; max-width: 340px; margin: 0 auto 2rem; }
  .success-hl {
    display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem;
    background: rgba(45,106,79,.06); border-radius: 12px; border: 1px solid rgba(45,106,79,.12);
  }
  .success-hl span { font-size: .87rem; color: var(--ink); font-weight: 500; }
  .btn-success-close {
    padding: .9rem 2.5rem; border-radius: 99px; border: none; background: var(--ink); color: #fff;
    font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all .25s;
  }
  .btn-success-close:hover { background: var(--leaf); transform: translateY(-2px); }

  .submit-error {
    padding: .75rem 1rem; border-radius: 10px;
    background: rgba(224,92,58,.1); border: 1px solid rgba(224,92,58,.25);
    color: #c0392b; font-size: .85rem; font-weight: 500; line-height: 1.5;
  }

  .btn-cta-main {
    padding: 1rem 2.5rem; border-radius: 99px; background: var(--lime); color: var(--ink);
    font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.05rem; border: none;
    cursor: pointer; display: flex; align-items: center; gap: .5rem; transition: all .25s;
  }
  .btn-cta-main:hover { background: #fff; transform: translateY(-3px); }
  .btn-cta-demo {
    padding: 1rem 2.5rem; border-radius: 99px; border: 1.5px solid rgba(255,255,255,.25);
    background: transparent; color: #fff; font-family: 'Sora', sans-serif; font-weight: 700;
    font-size: 1.05rem; cursor: pointer; display: flex; align-items: center; gap: .5rem; transition: all .25s;
  }
  .btn-cta-demo:hover { background: rgba(255,255,255,.1); transform: translateY(-3px); }

  .spin { animation: kp-spin 1s linear infinite; }
  @keyframes kp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .modal-header, .modal-progress, .modal-body, .modal-footer { padding-left: 1.5rem; padding-right: 1.5rem; }
    .fields-grid.two-col { grid-template-columns: 1fr; }
    .type-cards { grid-template-columns: repeat(2, 1fr); }
    .intent-cards { grid-template-columns: 1fr; }
  }
`;