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
  {id:"064",name:"Mohammed Abdo",role:"Saudi Etqaan",table:8,side:"Right",entrance:"B",status:"confirmed"},
  {id:"065",name:"Mohammed Alshik",role:"Narssess Hotel",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"066",name:"Mohamed El Fakharany",role:"Saudi GEO",table:8,side:"Right",entrance:"B",status:"tentative"},
  {id:"067",name:"Ahmad Bashr",role:"BRC Company",table:8,side:"Right",entrance:"B",status:"confirmed"},
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
  {id:"101",name:"Ibrahim",role:"Saudi Etqaan",table:4,side:"Left",entrance:"A",status:"confirmed"},
  {id:"102",name:"Najhi Najmul",role:"مؤسسة عنوان الحلول التجارية",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"103",name:"Shihab",role:"مؤسسة اساليب الامان للتجاره",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"104",name:"Abdullah",role:"شركة وايدر يونيفرسال فور تريدينغ",table:2,side:"Left",entrance:"A",status:"confirmed"},
  {id:"105",name:"Delower",role:"شركة وايدر يونيفرسال فور تريدينغ",table:2,side:"Left",entrance:"A",status:"confirmed"},
];

const LOGO_B64 = "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";
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
            {/* The working Base64 Logo you provided */}
            <img src={`data:image/png;base64,${LOGO_B64}`} alt="Smartplus" style={{height:38,objectFit:"contain",display:"block"}}/>
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
