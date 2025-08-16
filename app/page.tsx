"use client";
import { useEffect, useState } from "react";
import { API, postJSON } from "./api";

type Parsed = { parsed?: any; match?: any };

export default function Intake() {
  const [raw, setRaw] = useState<string>("");
  const [res, setRes] = useState<Parsed | null>(null);
  const [err, setErr] = useState<string>("");
  const [matcher, setMatcher] = useState<string>("ai");
  const [lang, setLang] = useState<"en"|"ms">("en");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
        (document.getElementById("raw") as HTMLTextAreaElement | null)?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function parse() {
    setErr("");
    try {
      const data = await postJSON<Parsed>(API("/parse"), { text: raw, matcher, lang });
      setRes(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to parse");
    }
  }

  async function createOrder() {
    const code = (res?.match as any)?.order_code || window.prompt("Enter new order code");
    if (!code) return;
    try {
      await postJSON(API("/orders"), { code });
      alert("Order created: " + code);
    } catch (e: any) {
      alert(e?.message ?? "Failed to create order");
    }
  }

  const t = (en: string, ms: string) => lang === "en" ? en : ms;

  return (
    <div className="grid cols-2">
      <section className="card stack">
        <div className="row">
          <div className="title">{t("Paste order text","Tampal teks pesanan")}</div>
          <select className="input" style={{maxWidth:140}} value={matcher} onChange={e=>setMatcher(e.target.value)}>
            <option value="ai">AI</option>
            <option value="hybrid">Hybrid</option>
            <option value="rules">Rules</option>
          </select>
          <select className="input" style={{maxWidth:120}} value={lang} onChange={e=>setLang(e.target.value as any)}>
            <option value="en">EN</option><option value="ms">MS</option>
          </select>
          <button className="btn primary" onClick={parse}>Parse</button>
        </div>
        <textarea id="raw" className="input" rows={12}
          placeholder={t("Paste message and click Parse","Tampal mesej dan klik Parse.")}
          value={raw} onChange={e=>setRaw(e.target.value)} />
        {err && <div className="err">{err}</div>}
        <div className="row">
          <button className="btn" onClick={createOrder}>Create Order</button>
        </div>
      </section>

      <section className="card stack">
        <div className="title">{t("Result","Keputusan")}</div>
        {!res && <div className="small">{t("No result yet. Paste message and click Parse.","Belum ada keputusan. Tampal mesej dan klik Parse.")}</div>}
        {res && <>
          <div className="row">
            <span className="badge">{t("Parsed","Diparse")}</span>
            {res.match?.order_code && <span className="badge">#{res.match.order_code} <span className="small">({res.match.reason})</span></span>}
          </div>
          <pre style={{ background:"#0e0e10", padding:12, borderRadius:12, overflow:"auto", maxHeight:380 }}>
            {JSON.stringify(res, null, 2)}
          </pre>
        </>}
      </section>
    </div>
  );
}
