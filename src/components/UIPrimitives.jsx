/* Small shared UI primitives used across the app */
import { RC } from "../data/constants";

export function Dot({i}){return <span className="dot" style={{animationDelay:`${i*.22}s`}}/>;}
export function LoadingDots(){return <span className="loading-dots"><Dot i={0}/><Dot i={1}/><Dot i={2}/></span>;}

export function Badge({children,color="purple",size="sm"}){
  const c=RC[color]||RC.purple;
  const fontSize=size==="sm"?11:12;
  const padding=size==="sm"?"3px 9px":"4px 12px";
  return <span className="nr-badge" style={{background:c.bg,color:c.text,border:`0.5px solid ${c.border}`,fontSize,padding}}>{children}</span>;
}

export function ScoreBar({label,score,max=10}){
  const pct=Math.round((score/max)*100);
  return(
    <div className="scorebar" style={{display:"flex",alignItems:"center",gap:10}}>
      <span className="score-label" style={{fontSize:12,color:"var(--color-text-secondary)",width:95,flexShrink:0}}>{label}</span>
      <div className="score-track" style={{flex:1,height:6,background:"var(--color-background-secondary)",borderRadius:99,overflow:"hidden"}}>
        <div className="score-fill" style={{width:`${pct}%`,height:"100%",background:"#534AB7",borderRadius:99,transition:"width .7s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
      <span className="score-value" style={{fontSize:12,fontWeight:500,minWidth:32,textAlign:"right",color:"var(--color-text-primary)"}}>{score}<span style={{color:"var(--color-text-tertiary)",fontWeight:400}}>/{max}</span></span>
    </div>
  );
}

export function CircleScore({value,size=80}){
  const r=(size/2)-6,circ=2*Math.PI*r,col=value>=80?"#1D9E75":value>=65?"#534AB7":value>=50?"#BA7517":"#993C1D";
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-background-secondary)" strokeWidth={5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={5}
      strokeDasharray={circ} strokeDashoffset={circ*(1-Math.min(value,100)/100)}
      strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
      style={{transition:"stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fontSize={size*.22} fontWeight={500} fill="var(--color-text-primary)">{value}</text>
    </svg>
  );
}

export function RadarChart({scores}){
  const dims=Object.keys(scores),n=dims.length,cx=110,cy=110,r=75;
  const ang=i=>(i/n)*2*Math.PI-Math.PI/2;
  const pt=(i,f)=>({x:cx+r*f*Math.cos(ang(i)),y:cy+r*f*Math.sin(ang(i))});
  return(
    <svg viewBox="0 0 220 220" style={{width:"100%",maxWidth:200}}>
      {[.25,.5,.75,1].map(f=><polygon key={f} points={dims.map((_,i)=>`${pt(i,f).x},${pt(i,f).y}`).join(" ")} fill="none" stroke="var(--color-border-tertiary)" strokeWidth=".75"/>)}
      {dims.map((_,i)=><line key={i} x1={cx} y1={cy} x2={pt(i,1).x} y2={pt(i,1).y} stroke="var(--color-border-tertiary)" strokeWidth=".75"/>)}
      <polygon points={dims.map((_,i)=>{const v=scores[dims[i]]/10;return `${pt(i,v).x},${pt(i,v).y}`;}).join(" ")} fill="#EEEDFE" fillOpacity={.65} stroke="#7F77DD" strokeWidth={2}/>
      {dims.map((d,i)=>{const lp=pt(i,1.3);return <text key={d} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="var(--color-text-secondary)" fontWeight={500}>{d.split(" ")[0]}</text>;})}
    </svg>
  );
}

export function ProgressSteps({current,total}){
  return(
    <div style={{display:"flex",gap:4}}>
      {Array.from({length:total},(_,i)=>(
        <div key={i} className="nr-progress-bar" style={{background:i<current?"#534AB7":i===current?"#AFA9EC":"var(--color-background-secondary)"}}/>
      ))}
    </div>
  );
}

export function SelectWrap({value,onChange,children,disabled}){
  return(
    <div style={{position:"relative"}}>
      <select className="nr-select" value={value} onChange={onChange} disabled={disabled}>{children}</select>
      <i className="ti ti-chevron-down select-chevron" aria-hidden/>
    </div>
  );
}

export function AvatarCircle({name,size=40}){
  const initials=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return(
    <div className="avatar-circle" style={{width:size,height:size}}>
      <span style={{fontSize:size*.35,fontWeight:500}}>{initials}</span>
    </div>
  );
}
