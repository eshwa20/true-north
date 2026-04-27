function CSection({ title, children }) {
  return (
    <div className="mb-3 last:mb-0">
      <h2 style={{
        fontSize: 9, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.2em", color: "#0a0a0a",
        marginBottom: 4, paddingBottom: 2, borderBottom: "1px solid #111"
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export function TemplateClassic({ data }) {
  const { personal, education, experience, projects, skills, hobbies } = data;
  const wrapStyle = { wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" };

  return (
    <div
      className="bg-white border border-[#DDD5BE] rounded-[18px] shadow-[0_8px_32px_rgba(46,34,24,.10)] overflow-hidden"
      style={{ fontFamily: "'Times New Roman', Times, serif", color: "#111" }}
    >
      <div className="px-7 pt-7 pb-6">

        <div className="text-center mb-4 pb-3" style={{ borderBottom: "2px solid #111" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", ...wrapStyle }}>
            {personal.name || <span style={{ color: "#ccc", fontWeight: 400, fontSize: 15, textTransform: "none", letterSpacing: "normal" }}>Your Name</span>}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5" style={{ fontSize: 9, color: "#222" }}>
            {personal.email     && <span style={wrapStyle}>{personal.email}</span>}
            {personal.phone     && <span style={wrapStyle}>{personal.phone}</span>}
            {personal.location  && <span style={wrapStyle}>{personal.location}</span>}
            {personal.linkedin  && <span style={wrapStyle}>{personal.linkedin}</span>}
            {personal.portfolio && <span style={wrapStyle}>{personal.portfolio}</span>}
          </div>
        </div>

        {personal.summary && (
          <div className="mb-3">
            <p style={{ fontSize: 9.5, color: "#1a1a1a", lineHeight: 1.65, textAlign: "center", fontStyle: "italic", ...wrapStyle }}>
              {personal.summary}
            </p>
          </div>
        )}

        {education.some(e => e.school || e.degree) && (
          <CSection title="Education">
            {education.map((e, i) => (e.school || e.degree) ? (
              <div key={i} className="mb-1 last:mb-0" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0, ...wrapStyle }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#0a0a0a" }}>{e.degree}</span>
                  {e.school && <span style={{ fontSize: 9.5, color: "#222" }}>, {e.school}</span>}
                </div>
                {e.year && <span style={{ fontSize: 9, color: "#333", flexShrink: 0 }}>{e.year}</span>}
              </div>
            ) : null)}
          </CSection>
        )}

        {experience.some(e => e.company || e.role) && (
          <CSection title="Work Experience">
            {experience.map((e, i) => (e.company || e.role) ? (
              <div key={i} className="mb-3 last:mb-0">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#0a0a0a", flex: 1, minWidth: 0, ...wrapStyle }}>
                    {e.role}{e.company && `, ${e.company}`}
                  </span>
                  <span style={{ fontSize: 9, color: "#333", flexShrink: 0 }}>{e.start}{e.start && e.end ? " – " : ""}{e.end}</span>
                </div>
                {e.desc && <p style={{ fontSize: 9, color: "#1a1a1a", marginTop: 2, lineHeight: 1.6, marginLeft: 8, whiteSpace: "pre-line", ...wrapStyle }}>{e.desc}</p>}
              </div>
            ) : null)}
          </CSection>
        )}

        {projects.some(p => p.title) && (
          <CSection title="Projects">
            {projects.map((p, i) => p.title ? (
              <div key={i} className="mb-2 last:mb-0" style={wrapStyle}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#0a0a0a" }}>{p.title}</span>
                {p.tech && <span style={{ fontSize: 9, color: "#222" }}> | {p.tech}</span>}
                {p.link && <span style={{ fontSize: 9, color: "#222" }}> — {p.link}</span>}
                {p.desc && <p style={{ fontSize: 9, color: "#1a1a1a", marginTop: 2, lineHeight: 1.6, marginLeft: 8, ...wrapStyle }}>{p.desc}</p>}
              </div>
            ) : null)}
          </CSection>
        )}

        {skills.length > 0 && (
          <CSection title="Skills">
            <p style={{ fontSize: 9, color: "#1a1a1a", ...wrapStyle }}>{skills.join(", ")}</p>
          </CSection>
        )}

        {hobbies.length > 0 && (
          <CSection title="Interests">
            <p style={{ fontSize: 9, color: "#1a1a1a", ...wrapStyle }}>{hobbies.join(", ")}</p>
          </CSection>
        )}
      </div>
    </div>
  );
}