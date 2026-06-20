import { CircleScore, Badge } from "./UIPrimitives";

export default function HistoryScreen({history,onView}){
  const rc=r=>r==="Strong Candidate"?"green":r==="Interview Ready"?"teal":r==="Developing"?"amber":"coral";
  return(
    <div className="nr-content">
      <div style={{marginBottom:"1.75rem"}}>
        <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:500,letterSpacing:"-.4px"}}>Session history</h1>
        <p style={{margin:0,fontSize:14,color:"var(--color-text-secondary)"}}>{history.length} session{history.length!==1?"s":""} completed</p>
      </div>
      {history.length===0?(
        <div className="nr-card" style={{padding:"3rem 1.5rem",textAlign:"center"}}>
          <div style={{width:56,height:56,borderRadius:16,background:"var(--color-background-secondary)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <i className="ti ti-history" style={{fontSize:26,color:"var(--color-text-tertiary)"}} aria-hidden/>
          </div>
          <p style={{margin:"0 0 4px",fontSize:15,fontWeight:500}}>No sessions yet</p>
          <p style={{margin:0,fontSize:13,color:"var(--color-text-tertiary)"}}>Complete your first interview to see your progress here</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {history.map((s,i)=>(
            <div key={i} className="nr-card" onClick={()=>onView(s)}
              style={{padding:"1rem 1.25rem",cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
              <div style={{flexShrink:0}}>
                <CircleScore value={s.overall} size={52}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:"0 0 3px",fontSize:14,fontWeight:500}}>{s.domain}</p>
                <p style={{margin:"0 0 5px",fontSize:12,color:"var(--color-text-tertiary)"}}>{s.type} · {s.date}</p>
                <Badge color={rc(s.readiness)}>{s.readiness}</Badge>
              </div>
              <i className="ti ti-chevron-right" style={{fontSize:14,color:"var(--color-text-tertiary)",flexShrink:0}} aria-hidden/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

