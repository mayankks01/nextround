import { useState } from "react";
import { useEffect } from "react";

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

  useEffect(()=>{
    const onMessage = (e)=>{
      try{
        const d = e.data || {};
        if(d && d.type === 'oauth' && d.user){
          onAuth(d.user);
        }
      }catch(err){/* ignore */}
    };
    window.addEventListener('message', onMessage);
    return ()=>window.removeEventListener('message', onMessage);
  },[]);

  const openMockOAuth = (provider)=>{
    // Open real backend OAuth endpoint (falls back to mock if backend not configured)
    const url = `http://localhost:3001/auth/${provider}`;
    const w = window.open(url, 'oauth-'+provider, 'width=500,height=600');
    if(!w) return alert('Please allow popups for this site to use OAuth');
  };

  return(
    <div className="nr-auth-wrap">
      <div className="auth-blob auth-blob--1"/>
      <div className="auth-blob auth-blob--2"/>
      <div className="auth-blob auth-blob--3"/>
      <div className="nr-auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">
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
        {err&&<p className="error-note">{err}</p>}

        <button className="nr-btn nr-btn-primary btn-full" onClick={submit} style={{padding:"12px",fontSize:14,marginBottom:"1rem"}}>
          {mode==="login"?"Sign in":"Create account"}
        </button>

        <div style={{textAlign:"center",fontSize:13,color:"var(--color-text-tertiary)"}}>
          {mode==="login"?"Don't have an account? ":"Already have an account? "}
          <button onClick={()=>{setMode(m=>m==="login"?"signup":"login");setErr("");}} style={{background:"none",border:"none",color:"#534AB7",cursor:"pointer",fontWeight:500,fontSize:13,padding:0}}>
            {mode==="login"?"Sign up":"Sign in"}
          </button>
        </div>

        <div style={{marginTop:"1.5rem",paddingTop:"1.5rem",borderTop:"0.5px solid var(--color-border-tertiary)",display:"flex",flexDirection:"column",gap:8}}>
          {[["ti-brand-google","Continue with Google","google"],["ti-brand-github","Continue with GitHub","github"]].map(([ic,lb,provider])=>(
            <button key={ic} className="nr-btn nr-btn-ghost btn-full" onClick={()=>openMockOAuth(provider)} style={{padding:"10px",fontSize:13}}>
              <i className={`ti ${ic}`} style={{fontSize:15}} aria-hidden/>{lb}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
