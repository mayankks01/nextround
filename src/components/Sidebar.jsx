import { NAV_ITEMS } from "../data/constants";
import { AvatarCircle } from "./UIPrimitives";

/* ─── SIDEBAR ─────────────────────────────────────── */
export default function Sidebar({user,nav,setNav,onLogout}){
  return(
    <div className="nr-sidebar">
      <div style={{padding:"0 1.25rem 1.25rem",borderBottom:"0.5px solid var(--color-border-tertiary)",marginBottom:"0.75rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#5D54C4 0%,#534AB7 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 6px rgba(83,74,183,0.25)"}}>
            <i className="ti ti-microphone" style={{fontSize:16,color:"#fff"}} aria-hidden/>
          </div>
          <span style={{fontSize:15,fontWeight:500,letterSpacing:"-.2px"}}>NextRound</span>
        </div>
      </div>

      <div style={{flex:1,padding:"0 8px"}}>
        {NAV_ITEMS.map(item=>(
          <button key={item.id} className={`nr-nav-item ${nav===item.id?"active":""}`} onClick={()=>setNav(item.id)}>
            <i className={`ti ${item.icon}`} aria-hidden/>{item.label}
          </button>
        ))}
      </div>

      <div style={{padding:"0.75rem 8px 0",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10}}>
          <AvatarCircle name={user.name} size={30}/>
          <div style={{flex:1,minWidth:0}}>
            <p style={{margin:0,fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</p>
            <p style={{margin:0,fontSize:11,color:"var(--color-text-tertiary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</p>
          </div>
        </div>
        <button className="nr-btn nr-btn-ghost" onClick={onLogout} style={{width:"100%",padding:"7px",fontSize:12,marginTop:6}}>
          <i className="ti ti-logout" style={{fontSize:13}} aria-hidden/>Sign out
        </button>
      </div>
    </div>
  );
}
