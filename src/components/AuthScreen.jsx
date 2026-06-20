import { useState } from "react";

/* ─── AUTH SCREEN ─────────────────────────────────── */
export default function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState("");
  const up=k=>e=>setForm(f=>({...f,[k]:e.target.value}));

  const submit=()=>{
    if(!form.email||!form.password){setErr("Please fill in all fields.");return;}
    if(mode==="signup"&&!form.name){setErr("Please enter your name.");return;}
    if(form.password.length<6){setErr("Password must be at least 6 characters.");return;}
    setErr("");
    onAuth({name:form.name||form.email.split("@")[0],email:form.email});
  };

  return(
    <div className="nr-auth-wrap">
      <div className="nr-blob" style={{width:300,height:300,background:"#C9C3F5",top:"-8%",left:"-8%"}}/>
      <div className="nr-blob" style={{width:260,height:260,background:"#A8E0CC",bottom:"-10%",right:"-6%",animationDelay:"2s"}}/>
      <div className="nr-blob" style={{width:180,height:180,background:"#F5C9B8",top:"55%",left:"82%",animationDelay:"4s"}}/>
      <div className="nr-auth-card">
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"2rem"}}>
          <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#5D54C4 0%,#534AB7 100%)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(83,74,183,0.3)"}}>
            <i className="ti ti-microphone" style={{fontSize:20,color:"#fff"}} aria-hidden/>
          </div>
          <div>
            <p style={{margin:0,fontSize:18,fontWeight:500,letterSpacing:"-.3px"}}>NextRound</p>
            <p style={{margin:0,fontSize:11,color:"var(--color-text-tertiary)"}}>AI mock interview platform</p>
          </div>
        </div>

        <h2 style={{margin:"0 0 .25rem",fontSize:17,fontWeight:500}}>{mode==="login"?"Welcome back":"Create your account"}</h2>
        <p style={{margin:"0 0 1.5rem",fontSize:13,color:"var(--color-text-tertiary)"}}>{mode==="login"?"Sign in to continue your prep":"Start preparing for your dream role"}</p>

        {mode==="signup"&&(
          <div style={{marginBottom:12}}>
            <label className="nr-label">Full name</label>
            <input className="nr-input" placeholder="Arjun Sharma" value={form.name} onChange={up("name")}/>
          </div>
        )}
        <div style={{marginBottom:12}}>
          <label className="nr-label">Email address</label>
          <input className="nr-input" type="email" placeholder="you@example.com" value={form.email} onChange={up("email")}/>
        </div>
        <div style={{marginBottom:err?12:20}}>
          <label className="nr-label">Password</label>
          <input className="nr-input" type="password" placeholder="••••••••" value={form.password} onChange={up("password")} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        {err&&<p style={{margin:"0 0 14px",fontSize:12,color:"#993C1D",background:"#FAECE7",padding:"8px 12px",borderRadius:8,border:"0.5px solid #F0997B"}}>{err}</p>}

        <button className="nr-btn nr-btn-primary" onClick={submit} style={{width:"100%",padding:"12px",fontSize:14,marginBottom:"1rem"}}>
          {mode==="login"?"Sign in":"Create account"}
        </button>

        <div style={{textAlign:"center",fontSize:13,color:"var(--color-text-tertiary)"}}>
          {mode==="login"?"Don't have an account? ":"Already have an account? "}
          <button onClick={()=>{setMode(m=>m==="login"?"signup":"login");setErr("");}} style={{background:"none",border:"none",color:"#534AB7",cursor:"pointer",fontWeight:500,fontSize:13,padding:0}}>
            {mode==="login"?"Sign up":"Sign in"}
          </button>
        </div>

        <div style={{marginTop:"1.5rem",paddingTop:"1.5rem",borderTop:"0.5px solid var(--color-border-tertiary)",display:"flex",flexDirection:"column",gap:8}}>
          {[["ti-brand-google","Continue with Google"],["ti-brand-github","Continue with GitHub"]].map(([ic,lb])=>(
            <button key={ic} className="nr-btn nr-btn-ghost" onClick={submit} style={{width:"100%",padding:"10px",fontSize:13}}>
              <i className={`ti ${ic}`} style={{fontSize:15}} aria-hidden/>{lb}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
