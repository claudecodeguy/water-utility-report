"use client";

import { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { subscribeToViolationAlerts } from "@/lib/actions/violation-alert";

interface Props {
  pwsid: string;
  utilityName: string;
}

export default function ViolationAlertForm({ pwsid, utilityName }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const result = await subscribeToViolationAlerts(email, pwsid, utilityName);
    if ("success" in result) {
      setState("success");
    } else {
      setErrorMsg(result.error);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-wur-ink p-4">
        <CheckCircle2 className="w-4 h-4 text-wur-aqua mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">You&apos;re subscribed</p>
          <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
            We&apos;ll email you if {utilityName} receives a new health violation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-wur-ink p-4">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Bell className="w-3.5 h-3.5 text-wur-aqua" />
        </div>
        <p className="text-sm font-semibold text-white">Get violation alerts</p>
      </div>
      <p className="text-xs text-white/55 mb-3 leading-relaxed">
        Free email alert if this utility receives a new EPA health-based violation.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
          placeholder="your@email.com"
          className="w-full h-9 px-3 rounded-md border border-white/15 bg-white/10 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-wur-aqua focus:border-transparent"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="h-9 w-full bg-wur-aqua text-white text-sm font-medium rounded-md hover:bg-wur-aqua/85 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {state === "loading" ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Subscribing…</>
          ) : (
            "Notify me"
          )}
        </button>
        {state === "error" && (
          <p className="flex items-center gap-1.5 text-xs text-red-300">
            <AlertCircle className="w-3 h-3 shrink-0" />{errorMsg}
          </p>
        )}
      </form>
      <p className="mt-2.5 text-[10px] text-white/30">
        Free · No spam · Unsubscribe anytime
      </p>
    </div>
  );
}
