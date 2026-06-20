import { DOMAINS, SESSION_TYPES, DIFFICULTY } from "../data/constants";
import { AvatarCircle, Badge, SelectWrap } from "./UIPrimitives";

export default function SessionScreen({profile,config,setConfig,onStart}){
  const profileComplete=profile.role&&profile.domain;
  const rc=r=>r==="Strong Candidate"?"green":r==="Interview Ready"?"teal":r==="Developing"?"amber":"coral";

  return(
    <div className="nr-content">
      <div style={{marginBottom:"1.75rem"}}>
        <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:500,letterSpacing:"-.4px"}}>New session</h1>
        <p style={{margin:0,fontSize:14,color:"var(--color-text-secondary)"}}>Configure your interview and start when ready</p>
      </div>

      {/* Profile preview */}
      {profileComplete&&(
        <div className="nr-card" style={{padding:"1rem 1.25rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(120deg,#fff 0%,#F4FAF1 100%)",borderColor:"#C9E5B0"}}>
          <AvatarCircle name={profile.name||"You"} size={38}/>
          <div style={{flex:1}}>
            <p style={{margin:"0 0 3px",fontSize:13,fontWeight:500}}>{profile.name||"You"}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {profile.role&&<Badge color="purple">{profile.role}</Badge>}
              {profile.experience&&<Badge color="blue">{profile.experience}</Badge>}
              {profile.companyType&&<Badge color="teal">{profile.companyType}</Badge>}
            </div>
          </div>
          <i className="ti ti-circle-check-filled" style={{fontSize:18,color:"#1D9E75"}} aria-hidden/>
        </div>
      )}

      {/* Interview type */}
      <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #7F77DD"}}>
        <p className="nr-section-title">Interview type</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {SESSION_TYPES.map(st=>(
            <button key={st.id} className={`nr-type-card ${config.type===st.id?"sel":""}`} onClick={()=>setConfig(c=>({...c,type:st.id}))}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
                <div style={{width:28,height:28,borderRadius:8,background:config.type===st.id?st.color+"20":"var(--color-background-secondary)",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s",flexShrink:0}}>
                  <i className={`ti ${st.icon}`} style={{fontSize:14,color:config.type===st.id?st.color:"var(--color-text-tertiary)"}} aria-hidden/>
                </div>
                <span style={{fontSize:13.5,fontWeight:500,color:config.type===st.id?"var(--color-text-primary)":"var(--color-text-secondary)"}}>{st.label}</span>
                {config.type===st.id&&<i className="ti ti-circle-check-filled" style={{fontSize:14,color:"#534AB7",marginLeft:"auto"}} aria-hidden/>}
              </div>
              <p style={{margin:0,fontSize:12,color:"var(--color-text-tertiary)",paddingLeft:37}}>{st.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Domain & difficulty */}
      <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #378ADD"}}>
        <p className="nr-section-title">Session preferences</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <label className="nr-label">Domain / function</label>
            <SelectWrap value={config.domain} onChange={e=>setConfig(c=>({...c,domain:e.target.value}))}>
              {DOMAINS.map(d=><option key={d}>{d}</option>)}
            </SelectWrap>
          </div>
          <div>
            <label className="nr-label">Question count</label>
            <SelectWrap value={config.qCount||6} onChange={e=>setConfig(c=>({...c,qCount:+e.target.value}))}>
              {[4,6,8,10].map(n=><option key={n} value={n}>{n} questions (~{n*4} min)</option>)}
            </SelectWrap>
          </div>
        </div>
        <div>
          <label className="nr-label">Difficulty</label>
          <div style={{display:"flex",gap:8}}>
            {DIFFICULTY.map(d=>(
              <button key={d} onClick={()=>setConfig(c=>({...c,difficulty:d}))} style={{
                flex:1,padding:"10px 0",fontSize:13,fontWeight:500,borderRadius:10,cursor:"pointer",border:"1.5px solid",transition:"all .15s",
                ...(config.difficulty===d
                  ?{background:d==="Easy"?"#EAF3DE":d==="Medium"?"#FAEEDA":"#FAECE7",
                    color:d==="Easy"?"#3B6D11":d==="Medium"?"#633806":"#712B13",
                    borderColor:d==="Easy"?"#97C459":d==="Medium"?"#EF9F27":"#F0997B"}
                  :{background:"var(--color-background-primary)",color:"var(--color-text-tertiary)",borderColor:"var(--color-border-tertiary)"})
              }}>{d}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Focus areas */}
      <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1.5rem",borderTop:"2.5px solid #D85A30"}}>
        <p className="nr-section-title">Focus areas <span style={{textTransform:"none",fontWeight:400,letterSpacing:0,color:"var(--color-text-tertiary)"}}>(optional)</span></p>
        <p style={{margin:"0 0 .875rem",fontSize:13,color:"var(--color-text-secondary)"}}>Select topics you want extra practice on</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
          {(config.type==="behavioral"
            ?["Leadership","Conflict resolution","Cross-team collaboration","Failure & learnings","Impact & ownership","Prioritization","Stakeholder management"]
            :config.type==="dsa"
            ?["Arrays & strings","Trees & graphs","Dynamic programming","Greedy","Sorting & searching","Backtracking","Bit manipulation"]
            :["System design","Architecture patterns","Scalability","Database design","API design","Microservices","Security"]
          ).map(f=>(
            <button key={f} className={`nr-chip ${(config.focus||[]).includes(f)?"sel":""}`}
              onClick={()=>{const cur=config.focus||[];setConfig(c=>({...c,focus:cur.includes(f)?cur.filter(x=>x!==f):[...cur,f]}));}}>
              {(config.focus||[]).includes(f)&&<i className="ti ti-check" style={{fontSize:11}} aria-hidden/>}
              {f}
            </button>
          ))}
        </div>
      </div>

      <button className="nr-btn nr-btn-primary" onClick={onStart} style={{width:"100%",padding:"13px",fontSize:15}}>
        <i className="ti ti-player-play-filled" style={{fontSize:15}} aria-hidden/>
        Start interview
      </button>
    </div>
  );
}

