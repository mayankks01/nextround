import { NAV_ITEMS } from "../data/constants";
import { AvatarCircle } from "./UIPrimitives";

/* ─── SIDEBAR ─────────────────────────────────────── */
export default function Sidebar({user,nav,setNav,onLogout}){
  return(
    <div className="nr-sidebar">
      <div className="sidebar-brand">
        <div className="brand">
          <div className="brand-icon">
            <i className="ti ti-microphone icon-sm" style={{fontSize:16,color:"#fff"}} aria-hidden/>
          </div>
          <span>NextRound</span>
        </div>
      </div>

      <div className="nav-container">
        {NAV_ITEMS.map(item=>(
          <button key={item.id} className={`nr-nav-item ${nav===item.id?"active":""}`} onClick={()=>setNav(item.id)}>
            <i className={`ti ${item.icon}`} aria-hidden/>{item.label}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <AvatarCircle name={user.name} size={30}/>
          <div style={{flex:1,minWidth:0}}>
            <p className="sidebar-username">{user.name}</p>
            <p className="muted sidebar-email">{user.email}</p>
          </div>
        </div>
        <button className="nr-btn nr-btn-ghost btn-full btn-sm" onClick={onLogout} style={{marginTop:6}}>
          <i className="ti ti-logout icon-sm" aria-hidden/>Sign out
        </button>
      </div>
    </div>
  );
}
