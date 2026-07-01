import { useState, useRef, useEffect } from "react";
import { LoadingDots, ProgressSteps, ScoreBar, CircleScore } from "./UIPrimitives";
import { callClaude } from "../lib/claude";

export default function InterviewScreen({profile,config,onDone}){
  const [messages,setMessages]=useState([]);
  const [answer,setAnswer]=useState("");
  const [loading,setLoading]=useState(false);
  const [feedback,setFeedback]=useState(null);
  const [showFB,setShowFB]=useState(false);
  const [qCount,setQCount]=useState(0);
  const [allFB,setAllFB]=useState([]);
  const total=config.qCount||6;
  const chatEnd=useRef(null);
  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[messages,showFB]);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const ctx=[
        profile.name&&`Candidate: ${profile.name}`,
        profile.role&&`Target role: ${profile.role}`,
        profile.domain&&`Domain: ${profile.domain}`,
        profile.experience&&`Experience: ${profile.experience}`,
        profile.companyType&&`Target company type: ${profile.companyType}`,
        profile.currentTitle&&`Current title: ${profile.currentTitle}`,
        profile.currentCompany&&`Current company: ${profile.currentCompany}`,
        profile.skills?.length&&`Skills: ${profile.skills.join(", ")}`,
        profile.otherSkills&&`Other skills: ${profile.otherSkills}`,
        profile.achievements&&`Key achievements: ${profile.achievements}`,
        profile.resume&&`Resume summary: ${profile.resume}`,
        config.focus?.length&&`Focus areas: ${config.focus.join(", ")}`,
      ].filter(Boolean).join("\n");

      const sys=`You are Alex, a sharp professional AI interviewer at NextRound. Conduct a ${config.type} interview for ${config.domain} at ${config.difficulty} difficulty.\n\nCandidate context:\n${ctx||"No profile provided"}\n\nRules:\n- Ask ONE question per turn, 2-3 sentences max.\n- Start with a warm personalized opener referencing their background.\n- ${config.type==="behavioral"?"Use STAR probing — ask for specifics when answers are vague.":config.type==="dsa"?"State a clear algorithmic problem. Ask for approach before solution.":"Ask about architecture, design patterns, or domain concepts."}\n- Never evaluate or comment on answers during questioning.\n- After exactly ${total} questions, respond only with: INTERVIEW_COMPLETE`;
      const opening=await callClaude(sys,[{role:"user",content:"Begin the interview. Ask your first question."}]);
      setMessages([{role:"ai",content:opening}]);setQCount(1);setLoading(false);
    })();
  },[]);

  const submitAnswer=async()=>{
    if(!answer.trim()||loading)return;
    const ans=answer.trim();setAnswer("");setLoading(true);
    setMessages(m=>[...m,{role:"user",content:ans}]);
    const fbSys=`You are a senior interview coach. Evaluate this ${config.type} answer strictly and helpfully. Return ONLY valid JSON:\n{"scores":{"Clarity":7,"Depth":6,"Relevance":8,"Communication":7${config.type==="behavioral"?',"STAR":6':''}},"overall":72,"strength":"one specific thing done well (1 sentence)","improve":"one specific actionable suggestion (1 sentence)","model":"ideal 2-sentence answer snippet"}`;
    const lastQ=messages[messages.length-1]?.content||"";
    const raw=await callClaude(fbSys,[{role:"user",content:`Question: ${lastQ}\n\nAnswer: ${ans}`}]);
    let fb;
    try{fb=JSON.parse(raw.replace(/```json|```/g,"").trim());}
    catch{fb={scores:{Clarity:7,Depth:6,Relevance:7,Communication:7},overall:70,strength:"You addressed the core of the question.",improve:"Add specific examples with measurable outcomes.",model:"A strong answer states the situation clearly, explains your specific actions, and quantifies the impact."};}
    setFeedback(fb);setAllFB(p=>[...p,{question:lastQ,answer:ans,feedback:fb}]);setShowFB(true);setLoading(false);
  };

  const nextQ=async()=>{
    setShowFB(false);setLoading(true);
    if(qCount>=total){genCard();return;}
    const sys=`You are Alex continuing a ${config.type} interview for ${config.domain}. This is question ${qCount+1} of ${total}. Ask ONE focused question (2-3 sentences), building naturally on prior answers. No evaluation.`;
    const hist=messages.map(m=>({role:m.role==="ai"?"assistant":"user",content:m.content}));
    const next=await callClaude(sys,hist);
    if(next.includes("INTERVIEW_COMPLETE")||qCount>=total){genCard();return;}
    setMessages(p=>[...p,{role:"ai",content:next}]);setQCount(q=>q+1);setLoading(false);
  };

  const genCard=async()=>{
    setLoading(true);
    const avg={};
    if(allFB.length){Object.keys(allFB[0].feedback.scores).forEach(k=>{avg[k]=Math.round(allFB.reduce((s,f)=>s+(f.feedback.scores[k]||0),0)/allFB.length);});}
    const overall=allFB.length?Math.round(allFB.reduce((s,f)=>s+f.feedback.overall,0)/allFB.length):70;
    const readiness=overall>=85?"Strong Candidate":overall>=72?"Interview Ready":overall>=55?"Developing":"Not Ready";
    onDone({overall,dimensions:avg,readiness,type:config.type,domain:config.domain,
      date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),qa:allFB});
  };

  return(
    <div className="interview-body">
      {/* Top bar */}
      <div className="interview-top">
        <div className="flex items-center">
          <div className="msg-robot" style={{position:"relative"}}>
            <i className="ti ti-robot icon-sm" style={{fontSize:17,color:"#534AB7"}} aria-hidden/>
              {loading&&!showFB&&<span className="pulse-dot"/>}
          </div>
          <div>
            <p style={{margin:0,fontSize:13,fontWeight:500}}>Alex · NextRound</p>
            <p style={{margin:0,fontSize:11,color:"var(--color-text-tertiary)"}}>{config.domain} · {config.type} · {config.difficulty}</p>
          </div>
        </div>
          <div className="interview-controls">
          <div style={{minWidth:110}}>
            <ProgressSteps current={qCount} total={total}/>
            <p className="progress-note">Q {qCount} of {total}</p>
          </div>
          <button className="nr-btn nr-btn-ghost btn-sm" onClick={()=>onDone(null)}>
            <i className="ti ti-x icon-sm" aria-hidden/>End
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="message-list">
        {messages.map((m,i)=>(
          <div key={i} className={`message-row ${m.role==='ai'?'ai':'user'}`}>
            {m.role==='ai'&&<div className="msg-robot"><i className="ti ti-robot" style={{fontSize:12,color:"#534AB7"}} aria-hidden/></div>}
            <div className={`message-bubble ${m.role==='ai'?'ai':'user'}`}>{m.content}</div>
          </div>
        ))}
        {loading&&!showFB&&(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div className="msg-robot"><i className="ti ti-robot icon-sm" style={{fontSize:12,color:"#534AB7"}} aria-hidden/></div>
            <div className="nr-msg-ai"><LoadingDots/></div>
          </div>
        )}
        <div ref={chatEnd}/>
      </div>

      {/* Feedback */}
        {showFB&&feedback&&(
        <div className="nr-card card-pad-md">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <p style={{margin:"0 0 2px",fontSize:13,fontWeight:500}}>Answer feedback</p>
              <p style={{margin:0,fontSize:11,color:"var(--color-text-tertiary)"}}>Q{qCount} of {total}</p>
            </div>
            <CircleScore value={feedback.overall} size={56}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
            {Object.entries(feedback.scores).map(([k,v])=><ScoreBar key={k} label={k} score={v}/>)}
          </div>
          <div className="feedback-grid">
            <div className="feedback-card" style={{background:"#EAF3DE",color:"#27500A"}}>
              <p style={{margin:"0 0 3px",fontSize:11,fontWeight:500,display:"flex",alignItems:"center",gap:4}}><i className="ti ti-check" style={{fontSize:11}} aria-hidden/>Well done</p>
              <p style={{margin:0,fontSize:12,lineHeight:1.5,color:"#27500A"}}>{feedback.strength}</p>
            </div>
            <div className="feedback-card" style={{background:"#FAEEDA",color:"#633806"}}>
              <p style={{margin:"0 0 3px",fontSize:11,fontWeight:500,display:"flex",alignItems:"center",gap:4}}><i className="ti ti-arrow-up" style={{fontSize:11}} aria-hidden/>Improve</p>
              <p style={{margin:0,fontSize:12,lineHeight:1.5,color:"#633806"}}>{feedback.improve}</p>
            </div>
          </div>
          {feedback.model&&<div className="model-answer"><p style={{margin:"0 0 3px",fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)"}}>Model answer</p><p style={{margin:0,fontSize:12,color:"var(--color-text-secondary)",fontStyle:"italic",lineHeight:1.55}}>{feedback.model}</p></div>}
          <button className="nr-btn nr-btn-primary" onClick={qCount>=total?genCard:nextQ} disabled={loading} style={{width:"100%",padding:"11px",fontSize:13}}>
            {loading?<LoadingDots/>:<>{qCount>=total?"View scorecard":"Next question"} <i className="ti ti-arrow-right" style={{fontSize:13}} aria-hidden/></>}
          </button>
        </div>
      )}

      {/* Input */}
      {!showFB&&(
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea value={answer} onChange={e=>setAnswer(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submitAnswer();}}}
            placeholder={messages.length===0?"Waiting for Alex…":"Type your answer… (Enter to submit)"}
            rows={3} disabled={loading||messages.length===0}
            className="nr-input" style={{flex:1,resize:"none",lineHeight:1.55,fontSize:13}}/>
          <button className="nr-btn nr-btn-primary" onClick={submitAnswer} disabled={loading||!answer.trim()||messages.length===0}
            style={{padding:"11px 15px",alignSelf:"stretch"}}>
            <i className="ti ti-send" style={{fontSize:16}} aria-label="Submit"/>
          </button>
        </div>
      )}
    </div>
  );
}

