import { motion, AnimatePresence } from "framer-motion";
import { LayoutTemplate } from "lucide-react";
import { TEMPLATES } from "./constants";

export function TemplatePicker({ template, setTemplate, showTplPicker, setShowTplPicker }) {
  const currentTpl = TEMPLATES.find(t => t.id === template);

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setShowTplPicker(v => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] border transition-all ${
          showTplPicker
            ? "bg-[#2E2218] text-[#F5F0E8] border-[#2E2218]"
            : "border-[#DDD5BE] hover:bg-[#EDE7D9]"
        }`}
      >
        <LayoutTemplate size={12}/> {currentTpl.label}
      </button>

      {/* Dropdown — absolutely positioned below the button, overlays the preview */}
      <AnimatePresence>
        {showTplPicker && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-30 mt-2 bg-[#FDFCF8] border border-[#DDD5BE] rounded-[20px] p-4 shadow-[0_8px_32px_rgba(46,34,24,.10)]"
            style={{ width: 300 }}
          >
            <p className="text-[10px] text-[#5A3F2A] uppercase tracking-widest mb-3">Choose a template</p>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => { setTemplate(tpl.id); setShowTplPicker(false); }}
                  className={`group flex flex-col rounded-[14px] overflow-hidden border-2 transition-all ${
                    template === tpl.id
                      ? "border-[#C8A84B] shadow-[0_0_0_3px_rgba(200,168,75,0.15)]"
                      : "border-[#EDE7D9] hover:border-[#DDD5BE]"
                  }`}
                >
                  <div className="w-full aspect-[4/5] bg-white p-1 flex items-center justify-center">
                    {tpl.preview}
                  </div>
                  <div className={`px-2 py-1.5 text-left transition-colors ${template === tpl.id ? "bg-[#C8A84B]" : "bg-[#F5F0E8] group-hover:bg-[#EDE7D9]"}`}>
                    <p className="text-[10px] font-semibold text-[#2E2218]">{tpl.label}</p>
                    <p className="text-[9px] text-[#5A3F2A]">{tpl.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}