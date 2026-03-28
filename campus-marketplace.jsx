import { useState, useEffect, useRef } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Services", "Housing", "Free Stuff", "Other"];

const SAMPLE_LISTINGS = [
  { id: 1, title: "Calculus Early Transcendentals 9th Ed", price: 45, category: "Textbooks", location: "North Hall", description: "Minimal highlighting, great condition. Perfect for MATH 151.", image: "📚", seller: "Maria G.", sellerEmail: "mg@university.edu", saved: false, date: "2 hours ago", condition: "Good" },
  { id: 2, title: "IKEA Desk + Chair Bundle", price: 80, category: "Furniture", location: "Off-campus Housing", description: "Moving out, must sell! Desk is 55\" wide, chair is ergonomic. Pickup only.", image: "🪑", seller: "Jake T.", sellerEmail: "jt@university.edu", saved: true, date: "5 hours ago", condition: "Like New" },
  { id: 3, title: "MacBook Pro 14\" M3", price: 1100, category: "Electronics", location: "Library", description: "2023 model, 16GB RAM, 512GB SSD. Comes with charger and original box.", image: "💻", seller: "Priya S.", sellerEmail: "ps@university.edu", saved: false, date: "1 day ago", condition: "Excellent" },
  { id: 4, title: "Tutoring – Organic Chemistry", price: 25, category: "Services", location: "STEM Building / Zoom", description: "PhD student, 3 yrs tutoring exp. $25/hr. Flexible scheduling, online or in-person.", image: "🧪", seller: "Alex R.", sellerEmail: "ar@university.edu", saved: false, date: "2 days ago", condition: "N/A" },
  { id: 5, title: "Mini Fridge – FREE", price: 0, category: "Free Stuff", location: "Dorm Row", description: "Works perfectly, just no space in my new place. First come first served.", image: "🧊", seller: "Sam L.", sellerEmail: "sl@university.edu", saved: true, date: "3 hours ago", condition: "Good" },
  { id: 6, title: "North Face Puffer Jacket (M)", price: 60, category: "Clothing", location: "Campus Center", description: "Navy, size medium. Only wore it one season. Machine washable.", image: "🧥", seller: "Dana K.", sellerEmail: "dk@university.edu", saved: false, date: "1 day ago", condition: "Like New" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const generateId = () => Date.now() + Math.random();
const formatPrice = (p) => p === 0 ? "FREE" : `$${p}`;

// ─── Components ──────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#3b82f6",
      color: "#fff", padding: "12px 20px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      animation: "slideUp 0.3s ease", display: "flex", alignItems: "center", gap: 8
    }}>
      {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"} {message}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, color = "#e2e8f0", textColor = "#475569" }) {
  return (
    <span style={{ background: color, color: textColor, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </span>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>}
      <input {...props} style={{
        width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0",
        fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
        transition: "border-color 0.2s", background: "#fff", ...props.style
      }} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>}
      <textarea {...props} style={{
        width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0",
        fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
        resize: "vertical", minHeight: 90, ...props.style
      }} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>}
      <select {...props} style={{
        width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0",
        fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
        background: "#fff", cursor: "pointer", ...props.style
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, variant = "primary", style: s, ...props }) {
  const styles = {
    primary: { background: "#6366f1", color: "#fff" },
    secondary: { background: "#f1f5f9", color: "#374151" },
    danger: { background: "#fee2e2", color: "#dc2626" },
    success: { background: "#dcfce7", color: "#16a34a" },
  };
  return (
    <button {...props} style={{
      padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
      fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.15s", ...styles[variant], ...s
    }}>{children}</button>
  );
}

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup | verify
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("State University");
  const [code, setCode] = useState("");
  const [sentCode] = useState("123456"); // mock OTP
  const [error, setError] = useState("");
  const [pendingUser, setPendingUser] = useState(null);

  const isEduEmail = (e) => e.endsWith(".edu");

  const handleSignup = () => {
    if (!name.trim()) return setError("Please enter your name.");
    if (!isEduEmail(email)) return setError("Must use a .edu email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    setPendingUser({ name, email, university });
    setMode("verify");
  };

  const handleVerify = () => {
    if (code !== sentCode) return setError("Incorrect code. Try: 123456");
    onAuth({ name: pendingUser.name, email: pendingUser.email, university: pendingUser.university, avatar: pendingUser.name[0].toUpperCase() });
  };

  const handleLogin = () => {
    if (!isEduEmail(email)) return setError("Must use a .edu email address.");
    if (!password) return setError("Enter your password.");
    setError("");
    // Mock login - any .edu + password works
    const mockName = email.split("@")[0].replace(/\d/g, "").replace(/^./, c => c.toUpperCase());
    onAuth({ name: mockName || "Student", email, university: "State University", avatar: (mockName[0] || "S").toUpperCase() });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 40, width: "100%", maxWidth: 420,
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)", animation: "slideUp 0.5s ease"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
          <h1 style={{ margin: "0 0 4px", fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#0f172a" }}>CampusMart</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Your campus. Your marketplace.</p>
        </div>

        {mode === "login" && (
          <>
            <Input label="University Email" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "-8px 0 12px" }}>{error}</p>}
            <Btn style={{ width: "100%", padding: "13px", marginBottom: 12 }} onClick={handleLogin}>Sign In</Btn>
            <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", margin: 0 }}>
              New here? <span style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }} onClick={() => { setMode("signup"); setError(""); }}>Create account</span>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <Input label="Full Name" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="University Email (.edu required)" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
            <Select label="University" options={["State University", "City College", "Tech Institute", "Community College", "Liberal Arts College"]} value={university} onChange={e => setUniversity(e.target.value)} />
            <Input label="Password" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "-8px 0 12px" }}>{error}</p>}
            <Btn style={{ width: "100%", padding: "13px", marginBottom: 12 }} onClick={handleSignup}>Create Account & Verify Email</Btn>
            <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", margin: 0 }}>
              Already have one? <span style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }} onClick={() => { setMode("login"); setError(""); }}>Sign in</span>
            </p>
          </>
        )}

        {mode === "verify" && (
          <>
            <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: "#166534" }}>📧 A verification code was sent to <strong>{email}</strong>. Enter it below to confirm your .edu email.</p>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "#16a34a" }}>Demo code: <strong>123456</strong></p>
            </div>
            <Input label="Verification Code" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} />
            {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "-8px 0 12px" }}>{error}</p>}
            <Btn style={{ width: "100%", padding: "13px", marginBottom: 12 }} onClick={handleVerify}>Verify & Enter Marketplace</Btn>
            <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", margin: 0, cursor: "pointer" }} onClick={() => setMode("signup")}>← Back</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Listing Form ─────────────────────────────────────────────────────────────
function ListingForm({ initial, onSave, onClose }) {
  const EMOJIS = { Textbooks: "📚", Electronics: "💻", Furniture: "🪑", Clothing: "🧥", Services: "🛠️", Housing: "🏠", "Free Stuff": "🎁", Other: "📦" };
  const [form, setForm] = useState(initial || { title: "", price: "", category: "Other", location: "", description: "", condition: "Good" });
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return setError("Title is required.");
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0) return setError("Enter a valid price (0 for free).");
    if (!form.location.trim()) return setError("Location is required.");
    if (!form.description.trim()) return setError("Description is required.");
    setError("");
    onSave({ ...form, price: Number(form.price), image: EMOJIS[form.category] || "📦" });
  };

  return (
    <>
      <Input label="Item / Service Title *" placeholder="e.g. Calculus Textbook, Guitar Lessons..." value={form.title} onChange={e => set("title", e.target.value)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
        <Input label="Price ($) — 0 = Free" type="number" min="0" placeholder="0" value={form.price} onChange={e => set("price", e.target.value)} style={{ marginBottom: 0 }} />
        <Select label="Category" options={CATEGORIES.slice(1)} value={form.category} onChange={e => set("category", e.target.value)} />
      </div>
      <Input label="Meetup / Pickup Location *" placeholder="e.g. Main Library, North Dorm, Zoom..." value={form.location} onChange={e => set("location", e.target.value)} />
      <Select label="Condition" options={["New", "Like New", "Excellent", "Good", "Fair", "For Parts", "N/A"]} value={form.condition} onChange={e => set("condition", e.target.value)} />
      <Textarea label="Description *" placeholder="Describe the item, any flaws, availability, etc." value={form.description} onChange={e => set("description", e.target.value)} />
      {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "-4px 0 12px", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave}>{initial ? "Save Changes" : "Post Listing"}</Btn>
      </div>
    </>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ listing, currentUser, onSave, onContact, onEdit, onDelete, onClick }) {
  const isOwner = listing.sellerEmail === currentUser.email;
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff", borderRadius: 16, overflow: "hidden", cursor: "pointer",
        boxShadow: hover ? "0 12px 40px rgba(99,102,241,0.15)" : "0 2px 12px rgba(0,0,0,0.07)",
        border: "1.5px solid", borderColor: hover ? "#c7d2fe" : "#f1f5f9",
        transition: "all 0.2s", transform: hover ? "translateY(-2px)" : "none",
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      {/* Image area */}
      <div style={{
        height: 120, background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 54, position: "relative"
      }}>
        {listing.image}
        <button
          onClick={e => { e.stopPropagation(); onSave(listing.id); }}
          style={{
            position: "absolute", top: 8, right: 8, background: listing.saved ? "#6366f1" : "rgba(255,255,255,0.9)",
            border: "none", borderRadius: 20, width: 32, height: 32, cursor: "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >{listing.saved ? "🔖" : "🔖"}</button>
        {isOwner && (
          <div style={{ position: "absolute", top: 8, left: 8 }}>
            <Badge color="#dbeafe" textColor="#1d4ed8">Your listing</Badge>
          </div>
        )}
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.3, flex: 1 }}>{listing.title}</h3>
          <span style={{ fontSize: 17, fontWeight: 800, color: listing.price === 0 ? "#16a34a" : "#6366f1", whiteSpace: "nowrap" }}>{formatPrice(listing.price)}</span>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <Badge>{listing.category}</Badge>
          {listing.condition !== "N/A" && <Badge color="#f0fdf4" textColor="#16a34a">{listing.condition}</Badge>}
        </div>

        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
          {listing.description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#94a3b8" }}>
          <span>📍 {listing.location}</span>
          <span>{listing.date}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
              {listing.seller[0]}
            </div>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{listing.seller}</span>
          </div>

          {isOwner ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={e => { e.stopPropagation(); onEdit(listing); }} style={{ background: "#f0f9ff", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 600, color: "#0369a1", cursor: "pointer" }}>Edit</button>
              <button onClick={e => { e.stopPropagation(); onDelete(listing.id); }} style={{ background: "#fef2f2", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 600, color: "#dc2626", cursor: "pointer" }}>Delete</button>
            </div>
          ) : (
            <button onClick={e => { e.stopPropagation(); onContact(listing); }} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Message</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Listing Detail Modal ─────────────────────────────────────────────────────
function ListingDetail({ listing, currentUser, onClose, onContact, onEdit, onDelete, onSave }) {
  const isOwner = listing.sellerEmail === currentUser.email;
  return (
    <Modal title="" onClose={onClose}>
      <div style={{ textAlign: "center", fontSize: 80, marginBottom: 12, background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", borderRadius: 16, padding: "20px 0" }}>{listing.image}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", fontFamily: "'Syne', sans-serif", flex: 1, paddingRight: 12 }}>{listing.title}</h2>
        <span style={{ fontSize: 24, fontWeight: 800, color: listing.price === 0 ? "#16a34a" : "#6366f1", whiteSpace: "nowrap" }}>{formatPrice(listing.price)}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        <Badge>{listing.category}</Badge>
        {listing.condition !== "N/A" && <Badge color="#f0fdf4" textColor="#16a34a">Condition: {listing.condition}</Badge>}
        <Badge color="#fef9c3" textColor="#854d0e">📍 {listing.location}</Badge>
      </div>
      <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{listing.description}</p>
      <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: "#0f172a" }}>Seller Info</p>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>{listing.seller} · {listing.sellerEmail}</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>Posted {listing.date}</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={() => onSave(listing.id)}>{listing.saved ? "Unsave" : "Save"}</Btn>
        {isOwner ? (
          <>
            <Btn variant="secondary" onClick={() => { onEdit(listing); onClose(); }}>Edit</Btn>
            <Btn variant="danger" onClick={() => { onDelete(listing.id); onClose(); }}>Delete</Btn>
          </>
        ) : (
          <Btn onClick={() => onContact(listing)}>Contact Seller</Btn>
        )}
      </div>
    </Modal>
  );
}

// ─── Messages Panel ───────────────────────────────────────────────────────────
function MessagesPanel({ conversations, currentUser, onClose }) {
  const [active, setActive] = useState(conversations[0]?.id || null);
  const [text, setText] = useState("");
  const [convos, setConvos] = useState(conversations);
  const chatRef = useRef();

  const activeConvo = convos.find(c => c.id === active);

  const send = () => {
    if (!text.trim() || !active) return;
    setConvos(cs => cs.map(c => c.id === active ? {
      ...c, messages: [...c.messages, { from: "me", text: text.trim(), time: "Just now" }]
    } : c));
    setText("");
    setTimeout(() => chatRef.current?.scrollTo(0, 99999), 50);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 700, height: "85vh",
        display: "flex", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", fontFamily: "'DM Sans', sans-serif"
      }}>
        {/* Sidebar */}
        <div style={{ width: 240, borderRight: "1.5px solid #f1f5f9", overflowY: "auto" }}>
          <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Messages</span>
            <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer" }}>×</button>
          </div>
          {convos.map(c => (
            <div key={c.id} onClick={() => setActive(c.id)} style={{
              padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid #f8fafc",
              background: active === c.id ? "#eef2ff" : "transparent",
              borderLeft: active === c.id ? "3px solid #6366f1" : "3px solid transparent"
            }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 2 }}>{c.with}</div>
              <div style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.item}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{c.messages[c.messages.length - 1]?.time}</div>
            </div>
          ))}
          {convos.length === 0 && <p style={{ padding: 16, color: "#94a3b8", fontSize: 13 }}>No conversations yet.</p>}
        </div>

        {/* Chat area */}
        {activeConvo ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1.5px solid #f1f5f9" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{activeConvo.with}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#6366f1" }}>Re: {activeConvo.item}</p>
            </div>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              {activeConvo.messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "72%", padding: "9px 14px", borderRadius: 16,
                    background: m.from === "me" ? "#6366f1" : "#f1f5f9",
                    color: m.from === "me" ? "#fff" : "#0f172a", fontSize: 14
                  }}>
                    <p style={{ margin: "0 0 4px" }}>{m.text}</p>
                    <span style={{ fontSize: 11, opacity: 0.7 }}>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
              <input value={text} onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a message..." style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                  fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none"
                }} />
              <Btn onClick={send}>Send</Btn>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 15 }}>
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile Panel ────────────────────────────────────────────────────────────
function ProfilePanel({ user, listings, onClose, onLogout }) {
  const myListings = listings.filter(l => l.sellerEmail === user.email);
  const savedListings = listings.filter(l => l.saved && l.sellerEmail !== user.email);
  const [tab, setTab] = useState("listings");

  return (
    <Modal title="My Profile" onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 10px" }}>{user.avatar}</div>
        <h3 style={{ margin: "0 0 2px", fontFamily: "'Syne', sans-serif" }}>{user.name}</h3>
        <p style={{ margin: "0 0 2px", color: "#64748b", fontSize: 14 }}>{user.email}</p>
        <Badge color="#e0e7ff" textColor="#4338ca">🎓 {user.university}</Badge>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, background: "#f8fafc", borderRadius: 10, padding: 4 }}>
        {[["listings", `My Listings (${myListings.length})`], ["saved", `Saved (${savedListings.length})`]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: "8px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            background: tab === k ? "#fff" : "transparent", color: tab === k ? "#6366f1" : "#64748b",
            boxShadow: tab === k ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {(tab === "listings" ? myListings : savedListings).map(l => (
          <div key={l.id} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "#f8fafc", borderRadius: 12, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>{l.image}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{formatPrice(l.price)} · {l.location}</p>
            </div>
          </div>
        ))}
        {(tab === "listings" ? myListings : savedListings).length === 0 && (
          <p style={{ color: "#94a3b8", fontSize: 14, textAlign: "center", padding: "20px 0" }}>{tab === "listings" ? "No listings yet. Post your first item!" : "No saved listings."}</p>
        )}
      </div>

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
        <Btn variant="danger" onClick={onLogout}>Sign Out</Btn>
      </div>
    </Modal>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CampusMart() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState(SAMPLE_LISTINGS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showNew, setShowNew] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [detailListing, setDetailListing] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const addListing = (data) => {
    const newL = {
      ...data, id: generateId(), seller: user.name, sellerEmail: user.email,
      saved: false, date: "Just now"
    };
    setListings(ls => [newL, ...ls]);
    setShowNew(false);
    showToast("Listing posted successfully!");
  };

  const updateListing = (data) => {
    setListings(ls => ls.map(l => l.id === editListing.id ? { ...l, ...data } : l));
    setEditListing(null);
    showToast("Listing updated!");
  };

  const deleteListing = (id) => {
    setListings(ls => ls.filter(l => l.id !== id));
    showToast("Listing removed.", "info");
  };

  const toggleSave = (id) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, saved: !l.saved } : l));
  };

  const contactSeller = (listing) => {
    const existing = conversations.find(c => c.item === listing.title && c.with === listing.seller);
    if (!existing) {
      setConversations(cs => [{
        id: generateId(), with: listing.seller, item: listing.title,
        messages: [{ from: "them", text: `Hi! I'm selling "${listing.title}" for ${formatPrice(listing.price)}. Let me know if you're interested!`, time: "Just now" }]
      }, ...cs]);
    }
    setDetailListing(null);
    setShowMessages(true);
  };

  const filtered = listings
    .filter(l => {
      if (category !== "All" && l.category !== category) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (l.price < priceRange[0] || l.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0; // newest first (already ordered)
    });

  const unreadCount = conversations.length;

  if (!user) return <AuthScreen onAuth={setUser} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 10px; }
      `}</style>

      {/* Top Nav */}
      <nav style={{
        background: "#fff", borderBottom: "1.5px solid #f1f5f9", padding: "0 24px",
        display: "flex", alignItems: "center", height: 60, position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#0f172a" }}>CampusMart</span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 480, margin: "0 24px", position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#94a3b8" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
            style={{ width: "100%", padding: "9px 14px 9px 38px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          <Btn onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>+</span> Post Item
          </Btn>
          <button onClick={() => setShowMessages(true)} style={{ background: "#f1f5f9", border: "none", borderRadius: 10, width: 40, height: 40, cursor: "pointer", fontSize: 18, position: "relative" }}>
            💬
            {unreadCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 5px" }}>{unreadCount}</span>}
          </button>
          <button onClick={() => setShowProfile(true)} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>{user.avatar}</button>
        </div>
      </nav>

      {/* Category strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "10px 24px", display: "flex", gap: 8, overflowX: "auto" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: "6px 16px", borderRadius: 20, border: "1.5px solid",
            borderColor: category === c ? "#6366f1" : "#e2e8f0",
            background: category === c ? "#6366f1" : "#fff",
            color: category === c ? "#fff" : "#374151",
            fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
          }}>{c}</button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px" }}>

        {/* Filters bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#64748b", fontSize: 14 }}><strong style={{ color: "#0f172a" }}>{filtered.length}</strong> listings {category !== "All" ? `in ${category}` : ""}{search ? ` matching "${search}"` : ""}</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setShowFilters(f => !f)} style={{ background: "#f1f5f9", border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}>
              🎛 Filters
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "7px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 20, border: "1.5px solid #e2e8f0" }}>
            <p style={{ fontWeight: 600, marginBottom: 10, color: "#0f172a" }}>Price Range: ${priceRange[0]} – ${priceRange[1] >= 2000 ? "2000+" : priceRange[1]}</p>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>$0</span>
              <input type="range" min={0} max={2000} step={10} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} style={{ flex: 1, accentColor: "#6366f1" }} />
              <span style={{ fontSize: 13, color: "#64748b" }}>$2000+</span>
              <Btn variant="secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { setPriceRange([0, 2000]); setShowFilters(false); }}>Reset</Btn>
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
            {filtered.map(l => (
              <ListingCard key={l.id} listing={l} currentUser={user}
                onSave={toggleSave} onContact={contactSeller}
                onEdit={setEditListing} onDelete={deleteListing}
                onClick={() => setDetailListing(l)} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>🔍</div>
            <h3 style={{ color: "#374151", marginBottom: 6 }}>No listings found</h3>
            <p style={{ fontSize: 14 }}>Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNew && <Modal title="Post a New Listing" onClose={() => setShowNew(false)}><ListingForm onSave={addListing} onClose={() => setShowNew(false)} /></Modal>}
      {editListing && <Modal title="Edit Listing" onClose={() => setEditListing(null)}><ListingForm initial={editListing} onSave={updateListing} onClose={() => setEditListing(null)} /></Modal>}
      {detailListing && <ListingDetail listing={detailListing} currentUser={user} onClose={() => setDetailListing(null)} onContact={contactSeller} onEdit={setEditListing} onDelete={deleteListing} onSave={toggleSave} />}
      {showMessages && <MessagesPanel conversations={conversations} currentUser={user} onClose={() => setShowMessages(false)} />}
      {showProfile && <ProfilePanel user={user} listings={listings} onClose={() => setShowProfile(false)} onLogout={() => { setShowProfile(false); setUser(null); }} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
