"use client";
import { useEffect, useState } from "react";
import { API, postJSON } from "../api";
type Toast = { kind: "ok"|"err"|"info", msg: string };
export default function Ops(){
  const [code,setCode]=useState<string>(""); const [amount,setAmount]=useState<string>(""); const [toast,setToast]=useState<Toast|null>(null);
  useEffect(()=>{ function onKey(e:KeyboardEvent){ if(e.key==="?"){ e.preventDefault(); setToast({kind:"info",msg:"Shortcuts: C=Collect • R=Return • I=Cancel Instalment • B=Buyback • P=Payment • X=Export • /=Search Code"});} else if(e.key==="/"){ e.preventDefault(); (document.getElementById("orderCode") as HTMLInputElement|null)?.focus(); } else if(e.key.toLowerCase()==="p"){ sendPayment(); } else if(e.key.toLowerCase()==="r"){ sendEvent("RETURN"); } else if(e.key.toLowerCase()==="c"){ sendEvent("COLLECT"); } else if(e.key.toLowerCase()==="i"){ sendEvent("INSTALMENT_CANCEL"); } else if(e.key.toLowerCase()==="b"){ sendEvent("BUYBACK"); } else if(e.key.toLowerCase()==="x"){ window.location.href="/export"; } } window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey);},[code,amount]);
  function note(kind:Toast["kind"], msg:string){ setToast({kind,msg}); setTimeout(()=>setToast(null),2500); }
  async function sendEvent(kind: "COLLECT"|"RETURN"|"INSTALMENT_CANCEL"|"BUYBACK"){ if(!code.trim()){ note("err","Enter order code first"); return;} try{ await postJSON(API(/orders//event), { event: kind }); note("ok", ${kind} submitted);}catch(e:any){ note("err", e?.message ?? "Failed"); } }
  async function sendPayment(){ if(!code.trim()){ note("err","Enter order code first"); return;} const value=parseFloat(amount||"0"); if(!isFinite(value)||value<=0){ note("err","Enter a valid amount"); return;} try{ await postJSON(API(/orders//payments), { amount: value }); setAmount(""); note("ok","Payment recorded"); }catch(e:any){ note("err", e?.message ?? "Failed"); } }
  return (<>
    <div className="grid cols-2">
      <div className="card stack"><div className="row"><div className="title" style={{flex:1}}>Search Order</div><kbd className="kbd">/</kbd></div><input id="orderCode" className="input" placeholder="Enter order code (e.g., OS-1234)" value={code} onChange={e=>setCode(e.target.value)} /></div>
      <div className="card stack"><div className="row"><div className="title" style={{flex:1}}>Payment</div><span className="badge">P</span></div><div className="row"><input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} /><button className="btn primary" onClick={sendPayment}>Record Payment</button></div><div className="small">Posts to <code>/orders/{"{code}"}/payments</code></div></div>
      <div className="card stack"><div className="row"><div className="title" style={{flex:1}}>Return</div><span className="badge">R</span></div><div className="sub">Mark items returned.</div><button className="btn" onClick={()=>sendEvent("RETURN")}>Mark Return</button></div>
      <div className="card stack"><div className="row"><div className="title" style={{flex:1}}>Collect</div><span className="badge">C</span></div><div className="sub">Mark items collected.</div><button className="btn" onClick={()=>sendEvent("COLLECT")}>Mark Collect</button></div>
      <div className="card stack"><div className="row"><div className="title" style={{flex:1}}>Cancel Instalment</div><span className="badge">I</span></div><div className="sub">Settle penalties and close plan.</div><button className="btn warn" onClick={()=>sendEvent("INSTALMENT_CANCEL")}>Cancel Instalment</button></div>
      <div className="card stack"><div className="row"><div className="title" style={{flex:1}}>Buyback Outright</div><span className="badge">B</span></div><div className="sub">Buy back items and adjust ledger.</div><button className="btn" onClick={()=>sendEvent("BUYBACK")}>Buyback</button></div>
    </div>{toast && <div className="toast">{toast.msg}</div>}</>);
}
