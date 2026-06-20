import { useState } from "react";
import { DOMAINS, TARGET_ROLES, EXP_LEVELS, COMPANIES, TIMELINES } from "../data/constants";
import { AvatarCircle, SelectWrap } from "./UIPrimitives";

export default function ProfileScreen({user,profile,setProfile}){
  const [saved,setSaved]=useState(false);
  const up=k=>v=>setProfile(p=>({...p,[k]:v}));
  const upE=k=>e=>up(k)(e.target.value);

  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);};

  const skills=["JavaScript","Python","Java","C++","React","Node.js","SQL","MongoDB","AWS","Docker","Machine Learning","System Design","Data Structures"];
  const toggleSkill=s=>{
    const curr=profile.skills||[];
    setProfile(p=>({...p,skills:curr.includes(s)?curr.filter(x=>x!==s):[...curr,s]}));
  };

  return(
    <div className="nr-content">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.75rem"}}>
        <div>
          <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:500,letterSpacing:"-.4px"}}>Your profile</h1>
          <p style={{margin:0,fontSize:14,color:"var(--color-text-secondary)"}}>This helps Alex personalize every interview for you</p>
        </div>
        <button className="nr-btn nr-btn-primary" onClick={save} style={{padding:"9px 18px",fontSize:13}}>
          {saved?<><i className="ti ti-check" style={{fontSize:13}} aria-hidden/>Saved!</>:"Save profile"}
        </button>
      </div>

      {/* Personal info */}
      <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #7F77DD"}}>
        <p className="nr-section-title">Personal information</p>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:"1.25rem"}}>
          <AvatarCircle name={user.name} size={52}/>
          <div>
            <p style={{margin:"0 0 2px",fontSize:15,fontWeight:500}}>{user.name}</p>
            <p style={{margin:0,fontSize:13,color:"var(--color-text-tertiary)"}}>{user.email}</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label className="nr-label">Full name</label>
            <input className="nr-input" value={profile.name||user.name} onChange={upE("name")} placeholder="Your full name"/>
          </div>
          <div>
            <label className="nr-label">Phone number <span style={{color:"var(--color-text-tertiary)",fontWeight:400}}>(optional)</span></label>
            <input className="nr-input" value={profile.phone||""} onChange={upE("phone")} placeholder="+91 98765 43210"/>
          </div>
          <div>
            <label className="nr-label">City / Location</label>
            <input className="nr-input" value={profile.city||""} onChange={upE("city")} placeholder="e.g. Bangalore, India"/>
          </div>
          <div>
            <label className="nr-label">LinkedIn URL <span style={{color:"var(--color-text-tertiary)",fontWeight:400}}>(optional)</span></label>
            <input className="nr-input" value={profile.linkedin||""} onChange={upE("linkedin")} placeholder="linkedin.com/in/yourname"/>
          </div>
        </div>
      </div>

      {/* Career details */}
      <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #1D9E75"}}>
        <p className="nr-section-title">Career details</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <label className="nr-label">Target role</label>
            <SelectWrap value={profile.role||""} onChange={upE("role")}>
              <option value="">Select role…</option>
              {TARGET_ROLES.map(r=><option key={r}>{r}</option>)}
            </SelectWrap>
          </div>
          <div>
            <label className="nr-label">Domain / function</label>
            <SelectWrap value={profile.domain||""} onChange={upE("domain")}>
              <option value="">Select domain…</option>
              {DOMAINS.map(d=><option key={d}>{d}</option>)}
            </SelectWrap>
          </div>
          <div>
            <label className="nr-label">Years of experience</label>
            <SelectWrap value={profile.experience||""} onChange={upE("experience")}>
              <option value="">Select…</option>
              {EXP_LEVELS.map(e=><option key={e}>{e}</option>)}
            </SelectWrap>
          </div>
          <div>
            <label className="nr-label">Target company type</label>
            <SelectWrap value={profile.companyType||""} onChange={upE("companyType")}>
              <option value="">Select…</option>
              {COMPANIES.map(c=><option key={c}>{c}</option>)}
            </SelectWrap>
          </div>
          <div>
            <label className="nr-label">Interview timeline</label>
            <SelectWrap value={profile.timeline||""} onChange={upE("timeline")}>
              <option value="">Select…</option>
              {TIMELINES.map(t=><option key={t}>{t}</option>)}
            </SelectWrap>
          </div>
          <div>
            <label className="nr-label">Current company <span style={{color:"var(--color-text-tertiary)",fontWeight:400}}>(optional)</span></label>
            <input className="nr-input" value={profile.currentCompany||""} onChange={upE("currentCompany")} placeholder="e.g. Infosys, Wipro"/>
          </div>
        </div>
        <div>
          <label className="nr-label">Current / recent job title</label>
          <input className="nr-input" value={profile.currentTitle||""} onChange={upE("currentTitle")} placeholder="e.g. Associate Software Engineer"/>
        </div>
      </div>

      {/* Skills */}
      <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #D85A30"}}>
        <p className="nr-section-title">Technical skills</p>
        <p style={{margin:"0 0 .875rem",fontSize:13,color:"var(--color-text-secondary)"}}>Select all that apply — Alex will tailor technical questions to these.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
          {skills.map(s=>(
            <button key={s} className={`nr-chip ${(profile.skills||[]).includes(s)?"sel":""}`} onClick={()=>toggleSkill(s)}>
              {(profile.skills||[]).includes(s)&&<i className="ti ti-check" style={{fontSize:11}} aria-hidden/>}
              {s}
            </button>
          ))}
        </div>
        <div>
          <label className="nr-label">Other skills <span style={{color:"var(--color-text-tertiary)",fontWeight:400}}>(comma-separated)</span></label>
          <input className="nr-input" value={profile.otherSkills||""} onChange={upE("otherSkills")} placeholder="e.g. Kubernetes, Terraform, Figma"/>
        </div>
      </div>

      {/* Background */}
      <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #378ADD"}}>
        <p className="nr-section-title">Background & experience</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <label className="nr-label">Education</label>
            <input className="nr-input" value={profile.education||""} onChange={upE("education")} placeholder="e.g. B.Tech Computer Science, IIT Delhi (2023)"/>
          </div>
          <div>
            <label className="nr-label">Key achievements / projects</label>
            <textarea className="nr-input" value={profile.achievements||""} onChange={upE("achievements")} rows={3}
              placeholder="Briefly describe 1–2 projects or achievements you're proud of…"
              style={{resize:"vertical",lineHeight:1.55}}/>
          </div>
          <div>
            <label className="nr-label">Resume summary <span style={{color:"var(--color-text-tertiary)",fontWeight:400}}>(paste key experience)</span></label>
            <textarea className="nr-input" value={profile.resume||""} onChange={upE("resume")} rows={4}
              placeholder="Paste your resume text or a summary of your professional experience. Alex uses this to ask personalized questions…"
              style={{resize:"vertical",lineHeight:1.55}}/>
          </div>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className="nr-btn nr-btn-primary" onClick={save} style={{padding:"11px 24px",fontSize:14}}>
          {saved?<><i className="ti ti-check" style={{fontSize:14}} aria-hidden/>Profile saved!</>:"Save profile"}
        </button>
      </div>
    </div>
  );
}

