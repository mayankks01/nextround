import { SESSION_TYPES } from "../data/constants";
import { CircleScore, Badge } from "./UIPrimitives";

/* ─── DASHBOARD ───────────────────────────────────── */
export default function Dashboard({user,profile,history,setNav}){
  const hasProfile=profile.role&&profile.domain;
  const avgScore=history.length?Math.round(history.reduce((s,h)=>s+h.overall,0)/history.length):null;
  const lastSession=history[0]||null;
  const rc=r=>r==="Strong Candidate"?"green":r==="Interview Ready"?"teal":r==="Developing"?"amber":"coral";

  return(
    <div className="nr-content">
      {/* Greeting */}
      <div style={{
        marginBottom:"1.5rem",padding:"1.5rem 1.75rem",borderRadius:18,position:"relative",overflow:"hidden",
        background:"linear-gradient(120deg,#5D54C4 0%,#7269D4 55%,#9089E0 100%)"
      }}>
        <div style={{position:"absolute",top:-30,right:-20,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
        <div style={{position:"absolute",bottom:-50,right:60,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:500,letterSpacing:"-.4px",color:"#fff",position:"relative"}}>Good day, {user.name.split(" ")[0]} 👋</h1>
        <p style={{margin:0,fontSize:14,color:"rgba(255,255,255,0.85)",position:"relative"}}>Ready to sharpen your interview skills?</p>
      </div>

      {/* Profile completion nudge */}
      {!hasProfile&&(
        <div style={{background:"linear-gradient(120deg,#EEEDFE 0%,#F3F1FE 100%)",border:"0.5px solid #C9C3F5",borderRadius:14,padding:"1rem 1.25rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <i className="ti ti-info-circle" style={{fontSize:17,color:"#534AB7"}} aria-hidden/>
            </div>
            <div>
              <p style={{margin:"0 0 2px",fontSize:13,fontWeight:500,color:"#3C3489"}}>Complete your profile</p>
              <p style={{margin:0,fontSize:12,color:"#534AB7"}}>Add your background so Alex can personalize your interviews</p>
            </div>
          </div>
          <button className="nr-btn nr-btn-primary" onClick={()=>setNav("profile")} style={{padding:"8px 14px",fontSize:12,whiteSpace:"nowrap"}}>
            Set up →
          </button>
        </div>
      )}

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:"1.25rem"}}>
        {[
          {icon:"ti-calendar-stats",label:"Sessions done",val:history.length||"0",color:"#534AB7",bg:"#EEEDFE"},
          {icon:"ti-chart-line",label:"Avg score",val:avgScore!==null?avgScore+"":"-",color:"#1D9E75",bg:"#E1F5EE"},
          {icon:"ti-flame",label:"Best score",val:history.length?Math.max(...history.map(h=>h.overall)):"–",color:"#D85A30",bg:"#FAECE7"},
        ].map(s=>(
          <div key={s.label} className="nr-stat" style={{borderTop:`2.5px solid ${s.color}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:500}}>{s.label}</span>
              <div style={{width:26,height:26,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <i className={`ti ${s.icon}`} style={{fontSize:13,color:s.color}} aria-hidden/>
              </div>
            </div>
            <p style={{margin:0,fontSize:26,fontWeight:500,lineHeight:1,color:"var(--color-text-primary)"}}>{s.val}</p>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:10}}>
        {/* Quick start */}
        <div className="nr-card" style={{padding:"1.25rem"}}>
          <p className="nr-section-title">Quick start</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {SESSION_TYPES.map(st=>(
              <button key={st.id} onClick={()=>setNav("session")}
                style={{width:"100%",padding:"10px 12px",justifyContent:"flex-start",gap:10,fontSize:13,display:"flex",alignItems:"center",
                  border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,background:"#fff",cursor:"pointer",transition:"all .15s",textAlign:"left"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=st.color+"60";e.currentTarget.style.background=st.color+"08";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--color-border-tertiary)";e.currentTarget.style.background="#fff";}}>
                <div style={{width:28,height:28,borderRadius:8,background:st.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <i className={`ti ${st.icon}`} style={{fontSize:13,color:st.color}} aria-hidden/>
                </div>
                <div style={{textAlign:"left",flex:1}}>
                  <p style={{margin:0,fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{st.label}</p>
                  <p style={{margin:0,fontSize:11,color:"var(--color-text-tertiary)"}}>{st.desc}</p>
                </div>
                <i className="ti ti-chevron-right" style={{fontSize:13,color:"var(--color-text-tertiary)"}} aria-hidden/>
              </button>
            ))}
          </div>
        </div>

        {/* Last session / empty */}
        <div className="nr-card" style={{padding:"1.25rem",background:lastSession?"linear-gradient(160deg,#fff 0%,#FAF9FF 100%)":"#fff"}}>
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

