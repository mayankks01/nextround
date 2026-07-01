import { SESSION_TYPES } from "../data/constants";
import { CircleScore, Badge } from "./UIPrimitives";

/* ─── DASHBOARD ───────────────────────────────────── */
export default function Dashboard({user,profile,history,setNav}){
  const hasProfile=profile.role&&profile.domain;
  const avgScore=history.length?Math.round(history.reduce((s,h)=>s+h.overall,0)/history.length):null;
  const lastSession=history[0]||null;
  const rc=r=>r==="Strong Candidate"?"green":r==="Interview Ready"?"teal":r==="Developing"?"amber":"coral";

  return (
    <div className="nr-content">
      <div className="page-hero">
        <div className="hero-deco-1"/>
        <div className="hero-deco-2"/>
        <h1>Good day, {user.name.split(" ")[0]} 👋</h1>
        <p className="hero-subtitle">Ready to sharpen your interview skills?</p>
      </div>

      {!hasProfile && (
        <div className="profile-nudge">
            <div className="flex items-center">
              <div style={{width:34,height:34,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <i className="ti ti-info-circle icon-sm" style={{fontSize:17,color:"#534AB7"}} aria-hidden/>
              </div>
              <div>
                <p style={{margin:"0 0 2px",fontSize:13,fontWeight:500,color:"#3C3489"}}>Complete your profile</p>
                <p style={{margin:0,fontSize:12,color:"#534AB7"}}>Add your background so Alex can personalize your interviews</p>
              </div>
            </div>
            <button className="nr-btn nr-btn-primary btn-sm" onClick={()=>setNav("profile")}>Set up →</button>
        </div>
      )}

      <div className="stats-grid">
        {[
          {icon:"ti-calendar-stats",label:"Sessions done",val:history.length||"0",color:"#534AB7",bg:"#EEEDFE"},
          {icon:"ti-chart-line",label:"Avg score",val:avgScore!==null?avgScore+"":"-",color:"#1D9E75",bg:"#E1F5EE"},
          {icon:"ti-flame",label:"Best score",val:history.length?Math.max(...history.map(h=>h.overall)):"–",color:"#D85A30",bg:"#FAECE7"},
        ].map(s=>(
          <div key={s.label} className="nr-stat" style={{borderTop:`2.5px solid ${s.color}`}}>
            <div className="stat-top">
              <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:500}}>{s.label}</span>
              <div className="stat-icon-box" style={{background:s.bg}}>
                <i className={`ti ${s.icon} icon-sm`} style={{color:s.color}} aria-hidden/>
              </div>
            </div>
            <p className="stat-value">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid-2col">
          <div className="nr-card quick-start">
          <p className="nr-section-title">Quick start</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {SESSION_TYPES.map(st=>(
              <button key={st.id} onClick={()=>setNav("session")} className="type-btn" style={{['--type-color']:st.color}}>
                <div style={{width:28,height:28,borderRadius:8,background:st.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <i className={`ti ${st.icon} icon-sm`} style={{color:st.color}} aria-hidden/>
                </div>
                <div style={{textAlign:"left",flex:1}}>
                  <p style={{margin:0,fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{st.label}</p>
                  <p style={{margin:0,fontSize:11,color:"var(--color-text-tertiary)"}}>{st.desc}</p>
                </div>
                <i className="ti ti-chevron-right icon-sm" style={{color:"var(--color-text-tertiary)"}} aria-hidden/>
              </button>
            ))}
          </div>
        </div>

        <div className="nr-card last-session-card">
          <p className="nr-section-title">Last session</p>
          {lastSession?(
            <>
              <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                <CircleScore value={lastSession.overall} size={72}/>
              </div>
              <p style={{margin:"0 0 4px",fontSize:13,fontWeight:500,textAlign:"center"}}>{lastSession.domain}</p>
              <p style={{margin:"0 0 10px",fontSize:11,color:"var(--color-text-tertiary)",textAlign:"center"}}>{lastSession.type} · {lastSession.date}</p>
              <div style={{display:"flex",justifyContent:"center"}}>
                <Badge color={rc(lastSession.readiness)}>{lastSession.readiness}</Badge>
              </div>
            </>
          ):(
            <div style={{textAlign:"center",padding:"1.5rem 0"}}>
              <i className="ti ti-microphone-off" style={{fontSize:28,color:"var(--color-text-tertiary)",display:"block",marginBottom:8}} aria-hidden/>
              <p style={{margin:"0 0 12px",fontSize:13,color:"var(--color-text-tertiary)"}}>No sessions yet</p>
              <button className="nr-btn nr-btn-primary" onClick={()=>setNav("session")} style={{padding:"8px 16px",fontSize:12}}>
                Start now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

