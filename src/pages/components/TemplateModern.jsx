import { User } from "lucide-react";

function MSection({ title, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <h2 style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#9a6f10", flexShrink: 0 }}>{title}</h2>
        <div className="flex-1 h-px bg-[#EDE7D9]"/>
      </div>
      {children}
    </div>
  );
}

export function TemplateModern({ data }) {
  const { personal, education, experience, projects, skills, hobbies } = data;
  const wrapStyle = { wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" };

  return (
    <div
      className="bg-white border border-[#DDD5BE] rounded-[18px] shadow-[0_8px_32px_rgba(46,34,24,.10)] overflow-hidden"
      style={{ fontFamily: "Georgia, serif", color: "#1a1008" }}
    >
      <div className="h-1.5 bg-[#C8A84B]"/>
      <div className="px-7 py-6">

        <div className="flex items-start gap-4 mb-4">
          {personal.image && (
            <img src={personal.image} className="w-14 h-14 rounded-full object-cover border-2 border-[#DDD5BE] flex-shrink-0" alt=""/>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-bold leading-snug" style={{ color: "#1a1008", ...wrapStyle }}>
              {personal.name || <span style={{ color: "#C8B89A", fontStyle: "italic", fontWeight: 400, fontSize: 14 }}>Your name will appear here</span>}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1" style={{ fontSize: 9, color: "#5a3f1a" }}>
              {personal.email     && <span style={wrapStyle}>{personal.email}</span>}
              {personal.phone     && <span style={wrapStyle}>{personal.phone}</span>}
              {personal.location  && <span style={wrapStyle}>{personal.location}</span>}
              {personal.linkedin  && <span style={{ color: "#9a6f10", ...wrapStyle }}>{personal.linkedin}</span>}
              {personal.portfolio && <span style={{ color: "#9a6f10", ...wrapStyle }}>{personal.portfolio}</span>}
            </div>
          </div>
        </div>

        {personal.summary && (
          <p className="mb-4 pb-4 border-b border-[#EDE7D9] italic"
            style={{ fontSize: 9.5, color: "#4a3010", lineHeight: 1.65, ...wrapStyle }}>
            {personal.summary}
          </p>
        )}

        {education.some(e => e.school || e.degree) && (
          <MSection title="Education">
            {education.map((e, i) => (e.school || e.degree) ? (
              <div key={i} className="mb-1.5 last:mb-0" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0, ...wrapStyle }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#1a1008" }}>{e.degree}</span>
                  {e.school && <span style={{ fontSize: 9.5, color: "#4a3010" }}> — {e.school}</span>}
                </div>
                {e.year && <span style={{ fontSize: 9, color: "#5a4020", flexShrink: 0 }}>{e.year}</span>}
              </div>
            ) : null)}
          </MSection>
        )}

        {experience.some(e => e.company || e.role) && (
          <MSection title="Experience">
            {experience.map((e, i) => (e.company || e.role) ? (
              <div key={i} className="mb-3 last:mb-0">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#1a1008", flex: 1, minWidth: 0, ...wrapStyle }}>{e.role}</span>
                  <span style={{ fontSize: 9, color: "#5a4020", flexShrink: 0 }}>{e.start}{e.start && e.end ? " – " : ""}{e.end}</span>
                </div>
                {e.company && <p style={{ fontSize: 9.5, color: "#9a6f10", fontWeight: 600, ...wrapStyle }}>{e.company}</p>}
                {e.desc && <p style={{ fontSize: 9, color: "#3d2a10", marginTop: 2, lineHeight: 1.6, whiteSpace: "pre-line", ...wrapStyle }}>{e.desc}</p>}
              </div>
            ) : null)}
          </MSection>
        )}

        {projects.some(p => p.title) && (
          <MSection title="Projects">
            {projects.map((p, i) => p.title ? (
              <div key={i} className="mb-3 last:mb-0">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#1a1008", flex: 1, minWidth: 0, ...wrapStyle }}>{p.title}</span>
                  {p.tech && <span style={{ fontSize: 8.5, color: "#5a4020", flexShrink: 0 }}>{p.tech}</span>}
                </div>
                {p.link && <p style={{ fontSize: 8.5, color: "#9a6f10", ...wrapStyle }}>{p.link}</p>}
                {p.desc && <p style={{ fontSize: 9, color: "#3d2a10", marginTop: 2, lineHeight: 1.6, ...wrapStyle }}>{p.desc}</p>}
              </div>
            ) : null)}
          </MSection>
        )}

        {skills.length > 0 && (
          <MSection title="Skills">
            <p style={{ fontSize: 9, color: "#3d2a10", ...wrapStyle }}>{skills.join(" • ")}</p>
          </MSection>
        )}

        {hobbies.length > 0 && (
          <MSection title="Interests">
            <p style={{ fontSize: 9, color: "#3d2a10", ...wrapStyle }}>{hobbies.join("  ·  ")}</p>
          </MSection>
        )}
      </div>
    </div>
  );
}