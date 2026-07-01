import { useState } from "react";
import { DOMAINS } from "./data/constants";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ProfileScreen from "./components/ProfileScreen";
import SessionScreen from "./components/SessionScreen";
import HistoryScreen from "./components/HistoryScreen";
import InterviewScreen from "./components/InterviewScreen";
import ScorecardScreen from "./components/ScorecardScreen";

/* ─── ROOT APP ────────────────────────────────────── */
export default function NextRound(){
  const [user,setUser]=useState(null);
  const [nav,setNav]=useState("dashboard");
  const [profile,setProfile]=useState({skills:[]});
  const [config,setConfig]=useState({type:"behavioral",difficulty:"Medium",domain:DOMAINS[0],qCount:6,focus:[]});
  const [screen,setScreen]=useState("dash");
  const [scorecard,setScorecard]=useState(null);
  const [history,setHistory]=useState([]);
  const [viewCard,setViewCard]=useState(null);

  const handleAuth=u=>{setUser(u);setProfile(p=>({...p,name:u.name,email:u.email}));};
  const handleLogout=()=>{setUser(null);setNav("dashboard");setScreen("dash");};

  const startInterview=()=>setScreen("interview");
  const finishInterview=card=>{
    if(card){setScorecard(card);setHistory(h=>[card,...h]);setScreen("scorecard");}
    else{setNav("dashboard");setScreen("dash");}
  };

  const navTo=n=>{
    if(n==="session")setScreen("session");
    else if(n==="dashboard")setScreen("dash");
    else if(n==="profile")setScreen("profile");
    else if(n==="history")setScreen("history");
    setNav(n);
  };

  if(!user) return <AuthScreen onAuth={handleAuth}/>;

  if(screen==="interview") return(
    <div className="full-height-col">
      <InterviewScreen profile={profile} config={config} onDone={finishInterview}/>
    </div>
  );

  return(
    <div className="nr-wrap">
      <Sidebar user={user} nav={nav} setNav={navTo} onLogout={handleLogout}/>
      <div className="nr-main">
        {screen==="dash"&&<Dashboard user={user} profile={profile} history={history} setNav={navTo}/>}
        {screen==="profile"&&<ProfileScreen user={user} profile={profile} setProfile={setProfile}/>}
        {screen==="session"&&<SessionScreen profile={profile} config={config} setConfig={setConfig} onStart={startInterview}/>}
        {screen==="history"&&(
          viewCard
            ?<div className="nr-content"><button className="nr-btn nr-btn-ghost btn-sm btn-inline-mb" onClick={()=>setViewCard(null)}><i className="ti ti-arrow-left icon-sm" aria-hidden/>Back to history</button><ScorecardScreen scorecard={viewCard} onNewSession={()=>{setViewCard(null);navTo("session");}} onHistory={()=>setViewCard(null)}/></div>
            :<HistoryScreen history={history} onView={c=>{setViewCard(c);}}/>
        )}
        {screen==="scorecard"&&scorecard&&(
          <ScorecardScreen scorecard={scorecard} onNewSession={()=>{setScorecard(null);navTo("session");}} onHistory={()=>{setScorecard(null);navTo("history");}}/>
        )}
      </div>
    </div>
  );
}
