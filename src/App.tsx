import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc, onSnapshot,
  collection, getDocs, DocumentData
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyAkPOWIlnyjY0o4D0_Zoe7UK-rUDI2xrYQ",
  authDomain:        "iftar-2026---smartplus.firebaseapp.com",
  projectId:         "iftar-2026---smartplus",
  storageBucket:     "iftar-2026---smartplus.firebasestorage.app",
  messagingSenderId: "1090090202085",
  appId:             "1:1090090202085:web:cd1a118898ff2d9965f50c",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const CHECKIN_DOC   = doc(db, "iftar2026", "checkins");
const GUESTS_COL    = collection(db, "iftar2026_extra_guests");
const ADMIN_PASSWORD = "smartplus2026";

interface Guest {
  id: string; name: string; role: string;
  table: number; side: string; entrance: string; status: string;
  dynamic?: boolean;
  docId?: string; 
}

const BASE_GUESTS: Guest[] = [
  {id:"001",name:"Mohammed AlSultan",role:"CEO",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"002",name:"Ahmed Elgendi",role:"COO",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"003",name:"Mohammed Samir Alsysy",role:"CFO",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"004",name:"Omer Farooq",role:"Marketing / Organizer",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"005",name:"Asad Li",role:"Hikvision",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"006",name:"Alaa Zaghloul",role:"Hikvision",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"007",name:"Junaid",role:"Hikvision",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"008",name:"Omar Alharahsheh",role:"Hikvision",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"009",name:"Sulieman",role:"Hikvision",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"010",name:"Jeremy Che",role:"Hikvision",table:1,side:"Left",entrance:"A",status:"confirmed"},
  {id:"011",name:"Abdelrahman Ashawy",role:"Operations Manager",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"012",name:"Jumah",role:"DPP Sales Manager",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"013",name:"Zeeshan Yaqoob",role:"Pre-Sales Manager",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"014",name:"Raees",role:"Retail Sales Manager",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"015",name:"Gamal Yasser",role:"DPP Sales",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"016",name:"Oliver",role:"Projects & Tech Manager",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"017",name:"Nawaf",role:"Projects Team",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"018",name:"Bader",role:"Accounts Team",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"019",name:"Mohamed Elmugtaba",role:"SmartPlus",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"020",name:"Wadsary",role:"SmartPlus",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"021",name:"Sahil Noor",role:"Norden Brand Manager",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"022",name:"Hussein Morgan",role:"Ezviz Brand Manager",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"023",name:"Mohammed Sohel",role:"Retail Sales",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"024",name:"Yosry",role:"Retail Sales",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"025",name:"Ahmad Ragga",role:"ISAMA Company",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"026",name:"Hamza Taha",role:"BRC Company",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"027",name:"Tamer Shaban",role:"Saudi GEO",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"028",name:"Abdulrahman Hussein",role:"Star Care Company",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"029",name:"Nhec Inao",role:"NCR Solutions",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"030",name:"Laith Alwahidi",role:"SPECTRA INTL",table:3,side:"Left",entrance:"A",status:"confirmed"},
  {id:"031",name:"Moayad Ali",role:"Projects Team",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"032",name:"Mamdouh Mustafa",role:"Projects Team",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"033",name:"Mohammed Bakry",role:"Projects Team",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"034",name:"Ahmed Essam",role:"Projects Team",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"035",name:"Aman Zia",role:"Creation Source",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"036",name:"Mahmoud Hamdy",role:"Saudi Etqaan",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"037",name:"Wael",role:"MIS",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"038",name:"Ahmed Younes",role:"Techflipp",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"039",name:"Mahdi",role:"Tasheel",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"040",name:"Ahmed Alsyse",role:"AL Matbouli",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"041",name:"Yasir",role:"Warehouse Team",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"042",name:"Kazi Riyad",role:"Warehouse Team",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"043",name:"Frank",role:"Warehouse Coordinator",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"044",name:"Mahmoud Tarek",role:"Logistics Team",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"045",name:"Usman",role:"Logistics Team",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"046",name:"Kamal",role:"Office",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"047",name:"Elbehery Mohammed",role:"IT Team",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"048",name:"Mohamad Al-Ghool",role:"Signal Control",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"049",name:"Osaid Abudiyah",role:"XYZ Dimensions",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"050",name:"Husnain",role:"SPECTRA INTL",table:5,side:"Left",entrance:"A",status:"confirmed"},
  {id:"051",name:"Sinn",role:"Technician",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"052",name:"Bensyl",role:"Technician",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"053",name:"Carlo",role:"Technician",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"054",name:"Renan",role:"Technician",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"055",name:"Thomson",role:"Technician",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"056",name:"Angelito",role:"Technician",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"057",name:"Jerome Celis Ravelo",role:"bits arabia",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"058",name:"Esteban Agana",role:"Future Digital United",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"059",name:"Vergil Garcia",role:"Future Digital United",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"060",name:"Imran",role:"TeleNoc",table:6,side:"Left",entrance:"A",status:"confirmed"},
  {id:"061",name:"Reema",role:"SmartPlus",table:7,side:"Right",entrance:"B",status:"confirmed"},
  {id:"062",name:"Maha",role:"HR Head",table:7,side:"Right",entrance:"B",status:"confirmed"},
  {id:"063",name:"Abed El Wadoud",role:"Abniya",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"064",name:"Mohammed Abdo",role:"Saudi Etqaan",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"065",name:"Mohammed Alshik",role:"Narssess Hotel",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"066",name:"Mohamed El Fakharany",role:"Saudi GEO",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"067",name:"Ahmad Bashr",role:"BRC Company",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"068",name:"Mohammed Ghamrawy",role:"PDM",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"069",name:"Waleed Banat",role:"Hikvision",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"070",name:"Hosny Elsayed",role:"Hikvision",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"071",name:"Ahmed Al Absi",role:"Hikvision",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"072",name:"Nawaf Alotaibi",role:"Hikvision",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"073",name:"Mosab Arar",role:"Hikvision",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"074",name:"Mosab Elkheiri",role:"Hikvision",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"075",name:"Ismail Issa",role:"Hikvision",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"076",name:"Saleh Rifai",role:"Hikvision",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"077",name:"Fadi",role:"Anazeem",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"078",name:"Moyasere",role:"Dar Delta",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"079",name:"Mohamed Agmi",role:"Anazeem",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"080",name:"Hazem",role:"Anazeem",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"081",name:"Saudi Al Atibi",role:"Dar Delta",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"082",name:"Yousef",role:"Saudi Sensor",table:9,side:"Right",entrance:"B",status:"tentative"},
  {id:"083",name:"Fahed",role:"Digitums",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"084",name:"Saeed",role:"Digitums",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"085",name:"Tarek",role:"Zaid Alhuusien",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"086",name:"M. Fawzy",role:"Zaid Alhuusien",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"087",name:"Mohamed Attwan",role:"Basco",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"088",name:"Mostafa",role:"Basco",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"089",name:"Mazher",role:"Tasheel",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"090",name:"Ahmed Morsy",role:"Toptech",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"091",name:"Ahmed Rabieh",role:"Mastry House",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"092",name:"Abdelaziz",role:"Techflipp",table:10,side:"Right",entrance:"B",status:"tentative"},
  {id:"093",name:"Iqbal Younes",role:"Creation Source",table:11,side:"Right",entrance:"B",status:"tentative"},
  {id:"094",name:"Mohammed Abdalla",role:"Amnco",table:11,side:"Right",entrance:"B",status:"tentative"},
  {id:"095",name:"Omar Hamad",role:"Benya",table:11,side:"Right",entrance:"B",status:"tentative"},
  {id:"096",name:"Yousif Algoth",role:"SecureTech",table:11,side:"Right",entrance:"B",status:"tentative"},
  {id:"097",name:"Abdullah Abushaqra",role:"XYZ Dimensions",table:11,side:"Right",entrance:"B",status:"tentative"},
  {id:"098",name:"Hifzul Patel",role:"Hikvision",table:11,side:"Right",entrance:"B",status:"tentative"},
  {id:"099",name:"Majed Mohammed",role:"Gulf Fields Company",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"100",name:"Osama Ibrahim",role:"Gulf Fields Company",table:4,side:"Left",entrance:"A",status:"confirmed"},
];

const norm = (s: string): string => s?.toLowerCase().replace(/\s+/g," ").trim()??"";

const Crescent = ({flip=false, style={}}: {flip?: boolean; style?: React.CSSProperties}) => (
  <svg viewBox="0 0 80 140" fill="none" style={{...style, transform:flip?"scaleX(-1)":undefined}}>
    <defs>
      <radialGradient id={flip?"cg2":"cg1"} cx="35%" cy="50%" r="65%">
        <stop offset="0%" stopColor="#60d8f8" stopOpacity="1"/>
        <stop offset="50%" stopColor="#1db8e0" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#0a3d55" stopOpacity="0"/>
      </radialGradient>
      <filter id={flip?"f2":"f1"}>
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M58 10 Q8 35 8 70 Q8 105 58 130 Q18 115 18 70 Q18 25 58 10Z"
      fill={`url(#${flip?"cg2":"cg1"})`} filter={`url(#${flip?"f2":"f1"})`}
      stroke="#60d8f8" strokeWidth="0.8" strokeOpacity="0.6"/>
  </svg>
);

const GeoBg = () => (
  <svg style={{position:"fixed",top:0,right:0,width:"45%",height:"100%",opacity:0.04,pointerEvents:"none",zIndex:0}}
    viewBox="0 0 200 400" preserveAspectRatio="xMidYMid slice">
    {[...Array(6)].map((_,r)=>[...Array(4)].map((_,c)=>(
      <g key={`${r}-${c}`} transform={`translate(${c*50},${r*66})`}>
        <polygon points="25,0 50,14 50,42 25,56 0,42 0,14" fill="none" stroke="#60d8f8" strokeWidth="0.5"/>
        <polygon points="25,10 40,18 40,38 25,46 10,38 10,18" fill="none" stroke="#60d8f8" strokeWidth="0.3"/>
      </g>
    )))}
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15}}>
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:17,height:17}}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ onClose, dynamicGuests, editingGuest }: { onClose: () => void; dynamicGuests: Guest[], editingGuest: Guest | null }) {
  const TEAL = "#1ab8d8", TEAL2 = "#60d8f8";
  const GLASS = "rgba(8,44,72,0.95)";
  
  const [form, setForm] = useState({ 
    name: editingGuest?.name || "", 
    role: editingGuest?.role || "", 
    table: editingGuest?.table?.toString() || "12", 
    status: editingGuest?.status || "confirmed", 
    entrance: editingGuest?.entrance || "A", 
    side: editingGuest?.side || "Left" 
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const tableNum = parseInt(form.table) || 12;
  const isEditing = !!editingGuest;

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true); setError("");
    
    const guestId = isEditing ? editingGuest.id : `dyn_${Date.now()}`;
    const firebaseDocId = editingGuest?.docId || guestId;

    try {
      await setDoc(doc(GUESTS_COL, firebaseDocId), {
        id: guestId,
        name: form.name.trim(),
        role: form.role.trim() || "Guest",
        table: tableNum,
        side: form.side,
        entrance: form.entrance,
        status: form.status,
        dynamic: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (isEditing) onClose();
        else setForm({ name:"", role:"", table:"12", status:"confirmed", entrance:"A", side:"Left" });
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Failed to save — check connection"); 
    }
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    width:"100%", background:"rgba(2,14,26,0.8)",
    border:`1px solid rgba(96,216,248,0.25)`, borderRadius:10,
    padding:"11px 14px", fontSize:14, color:"#d8f0f8",
    outline:"none", fontFamily:"inherit", boxSizing:"border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize:10, letterSpacing:2, textTransform:"uppercase",
    color:"rgba(96,216,248,0.6)", marginBottom:6, display:"block",
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.85)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:GLASS,backdropFilter:"blur(24px)",borderRadius:22,
        border:`1px solid rgba(96,216,248,0.25)`,padding:"28px 24px",
        width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>
              {isEditing ? "✏️ Edit Guest" : "➕ Add Guest"}
            </div>
            <div style={{fontSize:11,color:"rgba(216,240,248,0.4)",marginTop:2}}>Changes go live instantly on all devices</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"none",
            borderRadius:8,padding:"6px 12px",color:"rgba(216,240,248,0.6)",cursor:"pointer",fontSize:13}}>
            ✕ Close
          </button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
              placeholder="e.g. Ahmed Al-Salem" dir="auto" style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Company / Role</label>
            <input value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
              placeholder="e.g. Saudi GEO" style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Table Number (1–12)</label>
            <input value={form.table} onChange={e=>setForm({...form,table:e.target.value})}
              type="number" min="1" max="12" style={inputStyle}/>
          </div>
          
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}>
              <label style={labelStyle}>Entrance</label>
              <div style={{display:"flex",gap:6}}>
                {["A","B"].map(e=>(
                  <button key={e} onClick={()=>setForm({...form,entrance:e})} style={{
                    flex:1,padding:"10px",borderRadius:10,border:`1px solid ${form.entrance===e?TEAL:"rgba(255,255,255,0.1)"}`,
                    background:form.entrance===e?"rgba(26,184,216,0.15)":"transparent",
                    color:form.entrance===e?TEAL2:"rgba(216,240,248,0.4)",
                    cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",
                  }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div style={{flex:1}}>
              <label style={labelStyle}>Side</label>
              <div style={{display:"flex",gap:6}}>
                {["Left","Right"].map(s=>(
                  <button key={s} onClick={()=>setForm({...form,side:s})} style={{
                    flex:1,padding:"10px",borderRadius:10,border:`1px solid ${form.side===s?TEAL:"rgba(255,255,255,0.1)"}`,
                    background:form.side===s?"rgba(26,184,216,0.15)":"transparent",
                    color:form.side===s?TEAL2:"rgba(216,240,248,0.4)",
                    cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <div style={{display:"flex",gap:10}}>
              {["confirmed","tentative"].map(s=>(
                <button key={s} onClick={()=>setForm({...form,status:s})} style={{
                  flex:1,padding:"10px",borderRadius:10,border:`1px solid ${form.status===s?(s==="confirmed"?TEAL:"#f0c84a"):"rgba(255,255,255,0.1)"}`,
                  background:form.status===s?(s==="confirmed"?"rgba(26,184,216,0.15)":"rgba(240,200,60,0.12)"):"transparent",
                  color:form.status===s?(s==="confirmed"?TEAL2:"#f0c84a"):"rgba(216,240,248,0.4)",
                  cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",
                  textTransform:"capitalize",
                }}>
                  {s==="confirmed"?"✅ Confirmed":"⏳ Tentative"}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{fontSize:12,color:"#ff6b6b",textAlign:"center"}}>{error}</div>}
          {saved && <div style={{fontSize:12,color:"#50c878",textAlign:"center"}}>✓ Guest saved successfully!</div>}

          <button onClick={handleSave} disabled={saving} style={{
            width:"100%",padding:"14px",borderRadius:10,border:"none",
            background:saving?"rgba(26,184,216,0.3)":`linear-gradient(135deg,${TEAL},${TEAL2})`,
            color:"#031c2e",fontSize:14,fontWeight:700,cursor:saving?"default":"pointer",
            fontFamily:"inherit",letterSpacing:0.5,
            boxShadow:saving?"none":`0 0 20px rgba(26,184,216,0.35)`,
          }}>
            {saving ? "Saving…" : isEditing ? "Save Changes →" : "Add Guest →"}
          </button>
        </div>

        {!isEditing && dynamicGuests.length > 0 && (
          <div style={{marginTop:28}}>
            <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",
              color:"rgba(96,216,248,0.5)",marginBottom:12}}>
              Recently Added ({dynamicGuests.length})
            </div>
            {dynamicGuests.slice(0, 5).map(g=>(
              <div key={g.id} style={{background:"rgba(2,14,26,0.5)",borderRadius:10,
                padding:"10px 14px",marginBottom:8,
                border:"1px solid rgba(96,216,248,0.12)",
                display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{g.name}</div>
                  <div style={{fontSize:11,color:"rgba(216,240,248,0.4)"}}>{g.role}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:TEAL2}}>Table {g.table}</div>
                  <div style={{fontSize:10,color:"rgba(216,240,248,0.4)"}}>Door {g.entrance}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function IftarCheckin() {
  const [query,   setQuery]    = useState<string>("");
  const [results, setResults]  = useState<Guest[]>([]);
  const [checkins,setCheckins] = useState<Record<string,string>>({});
  const [searched,setSearched] = useState<boolean>(false);
  const [dbStatus,setDbStatus] = useState<"connecting"|"ok"|"error">("connecting");
  const [dynGuests,setDynGuests]= useState<Guest[]>([]);
  
  const [showAdmin,setShowAdmin]= useState<boolean>(false);
  const [adminInput,setAdminInput]= useState<string>("");
  const [adminError,setAdminError]= useState<boolean>(false);
  const [adminUnlocked,setAdminUnlocked]= useState<boolean>(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  useEffect(() => {
    document.body.style.background = "radial-gradient(ellipse at 20% 10%, #0a3d5a 0%, #031c2e 50%, #020f1c 100%)";
    document.body.style.margin = "0";
    document.documentElement.style.background = "#031c2e";
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(CHECKIN_DOC,
      (snap: DocumentData) => { setCheckins(snap.exists()?snap.data() as Record<string,string>:{}); setDbStatus("ok"); },
      () => setDbStatus("error")
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadDyn = async () => {
      try {
        const snap = await getDocs(GUESTS_COL);
        const list: Guest[] = snap.docs.map(d => ({ ...d.data(), docId: d.id } as Guest));
        list.sort((a, b) => ((b as any).updatedAt || (b as any).addedAt || "").localeCompare((a as any).updatedAt || (a as any).addedAt || ""));
        setDynGuests(list);
      } catch { /* silent */ }
    };
    loadDyn();
    const interval = setInterval(loadDyn, 15000);
    return () => clearInterval(interval);
  }, [showAdmin]);

  const dynIds = new Set(dynGuests.map(g => g.id));
  const allGuests = [
    ...BASE_GUESTS.filter(g => !dynIds.has(g.id)), 
    ...dynGuests
  ];

  const search = () => {
    const q = norm(query);
    if (!q) { setResults([]); setSearched(false); return; }
    setResults(allGuests.filter(g => norm(g.name).includes(q) || norm(g.role).includes(q)));
    setSearched(true);
  };

  const checkIn = async (guest: Guest) => {
    try {
      const snap = await getDoc(CHECKIN_DOC);
      const current: Record<string,string> = (snap.exists()?snap.data():{}) as Record<string,string>;
      await setDoc(CHECKIN_DOC, { ...current, [guest.id]: new Date().toISOString() });
    } catch { alert("Check-in failed — check internet connection."); }
  };

  const handleAdminLogin = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true); setAdminError(false); setShowAdmin(true); setEditingGuest(null);
    } else {
      setAdminError(true);
    }
  };

  const handleEditClick = (guest: Guest) => {
    setEditingGuest(guest);
    setShowAdmin(true);
  };

  const TEAL = "#1ab8d8", TEAL2 = "#60d8f8";
  const GLASS = "rgba(8,44,72,0.65)", BORDER = "rgba(96,216,248,0.18)";

  return (
    <div style={{minHeight:"100vh",width:"100%",
      background:"radial-gradient(ellipse at 20% 10%, #0a3d5a 0%, #031c2e 50%, #020f1c 100%)",
      fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#d8f0f8",position:"relative",overflowX:"hidden"}}>
      <GeoBg/>
      <Crescent style={{position:"fixed",left:-10,top:"22%",width:70,height:120,opacity:0.9,pointerEvents:"none",zIndex:0,filter:"drop-shadow(0 0 12px rgba(96,216,248,0.6))"}}/>
      <Crescent flip style={{position:"fixed",right:-10,top:"34%",width:56,height:96,opacity:0.75,pointerEvents:"none",zIndex:0,filter:"drop-shadow(0 0 10px rgba(96,216,248,0.5))"}}/>
      <Crescent flip style={{position:"fixed",right:14,bottom:"8%",width:32,height:56,opacity:0.4,pointerEvents:"none",zIndex:0}}/>
      <Crescent style={{position:"fixed",left:20,top:"6%",width:22,height:38,opacity:0.35,pointerEvents:"none",zIndex:0}}/>

      {showAdmin && adminUnlocked && (
        <AdminPanel 
          onClose={()=>setShowAdmin(false)} 
          dynamicGuests={dynGuests} 
          editingGuest={editingGuest} 
        />
      )}

      <div style={{position:"relative",zIndex:1,maxWidth:460,margin:"0 auto",padding:"0 16px 60px"}}>

        {dbStatus==="error" && (
          <div style={{background:"rgba(180,40,40,0.9)",borderRadius:10,padding:"10px 16px",margin:"16px 0",fontSize:13,textAlign:"center",color:"#fff"}}>
            ⚠️ Cannot connect — check internet connection
          </div>
        )}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:30,marginBottom:18}}>
          <div style={{display:"inline-block",background:"#fff",borderRadius:12,padding:"8px 16px",
            boxShadow:`0 0 0 1px ${BORDER}, 0 6px 28px rgba(0,0,0,0.55)`}}>
            {/* Make sure the image is named logo.png (or logo.jpeg) and placed in the 'public' folder */}
            <img src="/logo.png" alt="Smartplus" style={{height:38,objectFit:"contain",display:"block"}}/>
          </div>
          <button onClick={()=>{ setEditingGuest(null); adminUnlocked?setShowAdmin(true):setShowAdmin(s=>!s); }}
            style={{background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(96,216,248,0.15)",borderRadius:8,
              padding:"6px 10px",fontSize:11,color:"rgba(96,216,248,0.4)",cursor:"pointer",
              fontFamily:"inherit"}}>
            ⚙️ Admin
          </button>
        </div>

        {showAdmin && !adminUnlocked && (
          <div style={{background:GLASS,backdropFilter:"blur(16px)",borderRadius:18,
            border:`1px solid ${BORDER}`,padding:"20px 18px",marginBottom:14}}>
            <div style={{fontSize:12,color:TEAL2,marginBottom:12,letterSpacing:1}}>🔒 Admin Access</div>
            <div style={{display:"flex",gap:10}}>
              <input type="password" value={adminInput}
                onChange={e=>setAdminInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()}
                placeholder="Enter admin password"
                style={{flex:1,background:"rgba(2,14,26,0.6)",border:`1px solid ${adminError?"rgba(255,80,80,0.5)":BORDER}`,
                  borderRadius:10,padding:"11px 14px",fontSize:14,color:"#d8f0f8",outline:"none",fontFamily:"inherit"}}/>
              <button onClick={handleAdminLogin} style={{
                background:`linear-gradient(135deg,${TEAL},${TEAL2})`,border:"none",
                borderRadius:10,padding:"11px 16px",cursor:"pointer",color:"#031c2e",
                fontWeight:700,fontFamily:"inherit",fontSize:13}}>
                Enter
              </button>
            </div>
            {adminError && <div style={{fontSize:11,color:"#ff6b6b",marginTop:6}}>Incorrect password</div>}
          </div>
        )}

        <div style={{background:"rgba(8,44,72,0.65)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderRadius:22,border:"1px solid rgba(96,216,248,0.18)",padding:"32px 24px 28px",
          boxShadow:"0 8px 48px rgba(0,0,0,0.5),inset 0 1px 0 rgba(96,216,248,0.1)",marginBottom:18,textAlign:"center"}}>
          <div style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:30,color:TEAL2,letterSpacing:2,marginBottom:2,textShadow:`0 0 20px ${TEAL}`}}>Ramadan</div>
          <div style={{fontSize:80,fontWeight:900,letterSpacing:6,lineHeight:1,color:"#fff",marginBottom:10}}>IFTAR</div>
          <div style={{display:"inline-block",background:TEAL,color:"#031c2e",fontSize:18,fontWeight:800,letterSpacing:3,padding:"5px 22px",borderRadius:8,marginBottom:24,boxShadow:`0 0 20px rgba(26,184,216,0.5)`}}>2026</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:10}}>
              {[["📅","March 8th"],["🕐","05:00PM – 08:00PM"]].map(([icon,text])=>(
                <div key={text} style={{flex:1,background:"rgba(2,18,32,0.7)",borderRadius:10,padding:"11px 14px",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(2,18,32,0.7)",borderRadius:10,padding:"11px 16px",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",gap:8,fontSize:13}}>
              <span>📍</span><span><strong>Hyatt Regency Hotel</strong><span style={{color:TEAL2}}> — Riyadh Olaya</span></span>
            </div>
          </div>
        </div>

        <div style={{background:GLASS,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:18,border:`1px solid ${BORDER}`,padding:"20px 18px",boxShadow:"0 4px 30px rgba(0,0,0,0.3)",marginBottom:14}}>
          <div style={{fontSize:10,letterSpacing:2.5,textTransform:"uppercase",color:TEAL2,marginBottom:12}}>Find Your Seat · ابحث عن مقعدك</div>
          <div style={{display:"flex",gap:10}}>
            <input value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&search()} dir="auto" placeholder="Your name · اسمك"
              style={{flex:1,background:"rgba(2,14,26,0.6)",border:`1px solid rgba(96,216,248,0.22)`,borderRadius:10,padding:"12px 14px",fontSize:14,color:"#d8f0f8",outline:"none",fontFamily:"inherit"}}/>
            <button onClick={search} style={{background:`linear-gradient(135deg,${TEAL},${TEAL2})`,border:"none",borderRadius:10,padding:"12px 16px",cursor:"pointer",color:"#031c2e",display:"flex",alignItems:"center",boxShadow:`0 0 16px rgba(26,184,216,0.35)`}}>
              <SearchIcon/>
            </button>
          </div>
          <div style={{fontSize:11,color:"rgba(216,240,248,0.35)",marginTop:8,textAlign:"center"}}>Search in English or Arabic</div>
        </div>

        {searched && results.length===0 && (
          <div style={{background:GLASS,backdropFilter:"blur(16px)",borderRadius:18,border:`1px solid ${BORDER}`,padding:"32px 20px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:10}}>🔍</div>
            <div style={{color:"rgba(216,240,248,0.55)",fontSize:14}}>Name not found. Please see the welcome team.</div>
            <div style={{direction:"rtl",marginTop:6,fontSize:13,color:"rgba(216,240,248,0.4)"}}>لم يتم العثور على اسمك. تواصل مع فريق الاستقبال</div>
          </div>
        )}

        {results.map((guest: Guest) => {
          const checked   = !!checkins[guest.id];
          const tentative = guest.status==="tentative";
          const time      = checkins[guest.id]?new Date(checkins[guest.id]).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}):null;
          
          return (
            <div key={guest.id} style={{background:checked?"rgba(6,52,36,0.7)":GLASS,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:18,marginBottom:14,border:`1px solid ${checked?"rgba(30,200,100,0.35)":tentative?"rgba(240,200,60,0.28)":BORDER}`,padding:"20px 18px",boxShadow:"0 4px 28px rgba(0,0,0,0.3)",transition:"all 0.3s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontSize:17,fontWeight:700,color:"#fff",lineHeight:1.3}}>{guest.name}</div>
                  <div style={{fontSize:12,color:"rgba(216,240,248,0.45)",marginTop:3}}>
                    {guest.role}
                    {guest.dynamic && <span style={{marginLeft:8,fontSize:10,color:TEAL2,background:"rgba(26,184,216,0.12)",padding:"1px 6px",borderRadius:10}}>updated</span>}
                  </div>
                </div>
                
                <div style={{display:"flex", alignItems:"center", gap: 8}}>
                  {adminUnlocked && (
                    <button onClick={() => handleEditClick(guest)} title="Edit Guest" style={{
                      background:"rgba(26,184,216,0.15)", border:`1px solid rgba(26,184,216,0.3)`,
                      borderRadius:10, padding:"6px", cursor:"pointer", color:TEAL2, display:"flex"
                    }}>
                      <EditIcon />
                    </button>
                  )}
                  <div style={{fontSize:9,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,padding:"4px 11px",borderRadius:20,whiteSpace:"nowrap",flexShrink:0,background:tentative?"rgba(240,200,60,0.1)":"rgba(26,184,216,0.1)",border:`1px solid ${tentative?"rgba(240,200,60,0.4)":"rgba(96,216,248,0.35)"}`,color:tentative?"#f0c84a":TEAL2}}>
                    {tentative?"⏳ Tentative":"✅ Confirmed"}
                  </div>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                {([
                  {label:"Table",val:String(guest.table),color:"#f0c84a",large:true,circle:false},
                  {label:"Side",val:guest.side==="Left"?"◀ Left":"Right ▶",color:TEAL2,large:false,circle:false},
                  {label:"Door",val:guest.entrance,color:TEAL,large:true,circle:true},
                ] as {label:string;val:string;color:string;large:boolean;circle:boolean}[]).map(({label,val,color,large,circle})=>(
                  <div key={label} style={{background:"rgba(2,14,26,0.6)",borderRadius:10,padding:"10px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(216,240,248,0.3)",marginBottom:5}}>{label}</div>
                    {circle
                      ?<div style={{width:28,height:28,borderRadius:"50%",margin:"0 auto",background:`linear-gradient(135deg,${TEAL},${TEAL2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#031c2e",boxShadow:`0 0 10px rgba(26,184,216,0.45)`}}>{val}</div>
                      :<div style={{fontSize:large?24:12,fontWeight:700,color,lineHeight:1}}>{val}</div>
                    }
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:"rgba(216,240,248,0.38)",textAlign:"center",marginBottom:12}}>
                {guest.entrance==="A"?"Use Entrance A · left doors · المدخل A":"Use Entrance B · right doors · المدخل B"}
              </div>
              <button onClick={()=>!checked&&checkIn(guest)} disabled={checked} style={{width:"100%",padding:"12px",borderRadius:10,border:"none",cursor:checked?"default":"pointer",fontSize:12,fontWeight:700,letterSpacing:1,textTransform:"uppercase",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.3s",background:checked?"rgba(30,180,90,0.14)":`linear-gradient(135deg,${TEAL},${TEAL2})`,color:checked?"rgb(50,200,110)":"#031c2e",boxShadow:checked?"none":`0 0 18px rgba(26,184,216,0.3)`}}>
                {checked?<><CheckIcon/> Checked In · تم التسجيل</>:"Tap to Check In · اضغط للتسجيل"}
              </button>
              {checked&&time&&<div style={{fontSize:11,color:"rgba(50,200,110,0.6)",textAlign:"center",marginTop:5}}>Checked in at {time}</div>}
            </div>
          );
        })}
        <div style={{textAlign:"center",marginTop:44,opacity:0.2,fontSize:11,letterSpacing:2}}>☽ &nbsp; RAMADAN KAREEM · رمضان كريم &nbsp; ☽</div>
      </div>
    </div>
  );
}
