import { CircleScore, Badge } from "./UIPrimitives";

export default function HistoryScreen({history,onView}){
  const rc=r=>r==="Strong Candidate"?"green":r==="Interview Ready"?"teal":r==="Developing"?"amber":"coral";
  return(
    <div className="nr-content">
      <div className="page-header">
        <h1>Session history</h1>
        <p className="small-note">{history.length} session{history.length!==1?"s":""} completed</p>
      </div>
      {history.length===0?(
        <div className="nr-card empty-state">
          <div className="empty-illustration">
            <i className="ti ti-history" style={{fontSize:26,color:"var(--color-text-tertiary)"}} aria-hidden/>
          </div>
          <p style={{margin:"0 0 4px",fontSize:15,fontWeight:500}}>No sessions yet</p>
          <p className="small-note">Complete your first interview to see your progress here</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {history.map((s,i)=>(
            <div key={i} className="nr-card history-item" onClick={()=>onView(s)}>
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

