import { useRef } from "react";
import { CircleScore, Badge, ScoreBar, RadarChart } from "./UIPrimitives";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ScorecardScreen({scorecard,onNewSession,onHistory}){
  const rc=r=>r==="Strong Candidate"?"green":r==="Interview Ready"?"teal":r==="Developing"?"amber":"coral";
  const printRef = useRef();

  const exportPDF = async () => {
    const el = printRef.current;
    if (!el) return;
    // Use html2canvas to capture the node
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // calculate image dimensions to fit A4 with margin
    const margin = 40;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = margin;
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    // If content overflows a single page, add pages
    let remainingHeight = imgHeight - (pageHeight - margin * 2);
    while (remainingHeight > -1) {
      pdf.addPage();
      position = margin - (imgHeight - remainingHeight);
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      remainingHeight -= (pageHeight - margin * 2);
    }
    pdf.save(`scorecard-${scorecard.date.replace(/\s+/g, "-")}.pdf`);
  };

  return(
    <div className="nr-content" ref={printRef}>
      {/* Hero */}
      <div className="nr-card" style={{padding:"1.75rem",marginBottom:"1rem",textAlign:"center",background:"linear-gradient(160deg,#fff 0%,#FAF9FF 60%,#F6F4FE 100%)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle,#EEEDFE 0%,transparent 70%)"}}/>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,background:"#fff",border:"0.5px solid var(--color-border-tertiary)",borderRadius:99,padding:"4px 14px",fontSize:11,color:"var(--color-text-tertiary)",marginBottom:"1.25rem",position:"relative"}}>
          <i className="ti ti-calendar" style={{fontSize:11}} aria-hidden/>{scorecard.domain} · {scorecard.type} · {scorecard.date}
        </span>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12,position:"relative"}}><CircleScore value={scorecard.overall} size={100}/></div>
        <p style={{margin:"0 0 8px",fontSize:16,fontWeight:500,position:"relative"}}>Interview complete</p>
        <div style={{position:"relative"}}><Badge color={rc(scorecard.readiness)} size="md">{scorecard.readiness}</Badge></div>
      </div>

      {/* Dimensions */}
      {scorecard.dimensions&&Object.keys(scorecard.dimensions).length>0&&(
        <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #534AB7"}}>
          <p className="nr-section-title">Skill breakdown</p>
          <div style={{display:"grid",gridTemplateColumns:"minmax(0,1.3fr) minmax(0,0.7fr)",gap:"0 1.5rem",alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {Object.entries(scorecard.dimensions).map(([k,v])=><ScoreBar key={k} label={k} score={v}/>)}
            </div>
            <div style={{display:"flex",justifyContent:"center"}}><RadarChart scores={scorecard.dimensions}/></div>
          </div>
        </div>
      )}

      {/* Q&A */}
      {scorecard.qa?.length>0&&(
        <div className="nr-card" style={{padding:"1.5rem",marginBottom:"1rem",borderTop:"2.5px solid #1D9E75"}}>
          <p className="nr-section-title">Question review</p>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {scorecard.qa.map((qa,i)=>(
              <details key={i} className="nr-details" style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <summary style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",gap:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <span style={{width:22,height:22,borderRadius:7,background:"linear-gradient(135deg,#EEEDFE 0%,#E5E2FB 100%)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:"#534AB7",flexShrink:0}}>Q{i+1}</span>
                    <span style={{fontSize:13,color:"var(--color-text-primary)"}}>{qa.question.slice(0,68)}{qa.question.length>68?"…":""}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{qa.feedback.overall}<span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:400}}>/100</span></span>
                    <i className="ti ti-chevron-down" style={{fontSize:12,color:"var(--color-text-tertiary)"}} aria-hidden/>
                  </div>
                </summary>
                <div style={{paddingBottom:12,paddingLeft:31}}>
                  <p style={{margin:"0 0 8px",fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.55}}><span style={{fontWeight:500}}>Your answer:</span> {qa.answer.slice(0,200)}{qa.answer.length>200?"…":""}</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    <div style={{background:"#EAF3DE",borderRadius:8,padding:"7px 10px"}}><p style={{margin:0,fontSize:11,color:"#27500A",lineHeight:1.45}}>{qa.feedback.strength}</p></div>
                    <div style={{background:"#FAEEDA",borderRadius:8,padding:"7px 10px"}}><p style={{margin:0,fontSize:11,color:"#633806",lineHeight:1.45}}>{qa.feedback.improve}</p></div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <button className="nr-btn nr-btn-ghost" onClick={onHistory} style={{padding:"12px",fontSize:13}}><i className="ti ti-history" style={{fontSize:14}} aria-hidden/>View history</button>
        <div style={{display:"flex",gap:8}}>
          <button className="nr-btn nr-btn-secondary" onClick={exportPDF} style={{padding:"12px",fontSize:13}}><i className="ti ti-file-text" style={{fontSize:14}} aria-hidden/>Export PDF</button>
          <button className="nr-btn nr-btn-primary" onClick={onNewSession} style={{padding:"12px",fontSize:13}}><i className="ti ti-refresh" style={{fontSize:14}} aria-hidden/>New session</button>
        </div>
      </div>
    </div>
  );
}

