"use client";
import { useState, useRef, useEffect } from "react";
import { Mail, Copy, Check } from "lucide-react";

const EMAIL = "contact@bacfrancaisai.fr";

export default function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function copy() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="hover:text-[#e8e8f0] transition-colors"
      >
        Contact
      </button>

      {open && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-50 bg-[#12121a] border border-[#2a2a3e] rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 whitespace-nowrap">
          {/* flèche */}
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#12121a] border-r border-b border-[#2a2a3e] rotate-45" />
          <Mail size={14} className="text-[#1a9fff] flex-shrink-0" />
          <span className="text-sm text-[#e8e8f0] font-mono">{EMAIL}</span>
          <button
            onClick={copy}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[#1e1e2e] transition-colors text-[#6b7280] hover:text-[#e8e8f0]"
            title="Copier"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
      )}
    </div>
  );
}
