"use client";
import { useState } from "react";
import { API, postJSON } from "../../api";
export default function CreateOrderPage(){
  const [code,setCode] = useState(""); const [msg,setMsg] = useState("");
  async function submit(){ setMsg(""); if(!code.trim()){ setMsg("Enter a code"); return; }
    try{ await postJSON(API("/orders"), { code }); setMsg("Created order " + code); setCode(""); }catch(e:any){ setMsg(e?.message ?? "Failed"); } }
  return (<div className="card stack"><div className="title">Manual Create Order</div>
    <input className="input" placeholder="Order code (e.g., OS-1234)" value={code} onChange={e=>setCode(e.target.value)} />
    <button className="btn primary" onClick={submit}>Create</button>{msg && <div>{msg}</div>}</div>);
}
