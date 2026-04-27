import { Trash2, Plus } from "lucide-react";

export function Field({ label, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] text-[#5A3F2A] mb-1.5 font-medium uppercase tracking-wide">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

export function SectionCard({ children, onRemove, index }) {
  return (
    <div className="relative p-5 bg-[#F5F0E8] border border-[#DDD5BE] rounded-[18px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-[#5A3F2A] font-medium uppercase tracking-wide">Entry {index + 1}</span>
        <button onClick={onRemove} className="flex items-center gap-1 text-[11px] text-[#5A3F2A] hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
          <Trash2 size={12}/> Remove
        </button>
      </div>
      {children}
    </div>
  );
}

export function AddButton({ onClick, label }) {
  return (
    <button onClick={onClick}
      className="w-full mt-1 p-3 border-2 border-dashed border-[#DDD5BE] rounded-[18px] text-sm text-[#5A3F2A] flex items-center justify-center gap-2 hover:border-[#C8A84B] hover:text-[#C8A84B] hover:bg-[#F5F0E8] transition-all">
      <Plus size={15}/> {label}
    </button>
  );
}