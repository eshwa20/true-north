import { User } from "lucide-react";

function TSection({ title, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <h2 style={{
          fontSize: 7.5, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.18em", color: "#9a6f10", flexShrink: 0
        }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, backgroundColor: "#EDE7D9" }}/>
      </div>
      {children}
    </div>
  );
}

export function TemplateTwoCol({ data }) {
  const { personal, education, experience, projects, skills, hobbies } = data;
  const wrapStyle = { wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" };

  return (
    <div
      className="bg-white border border-[#DDD5BE] rounded-[18px] shadow-[0_8px_32px_rgba(46,34,24,.10)] overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif", color: "#1a1008" }}
    >
      {/* Header bar */}
      <div style={{ backgroundColor: "#2E2218", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {personal.image
            ? <img src={personal.image} className="w-12 h-12 rounded-full object-cover flex-shrink-0" style={{ border: "2px solid #C8A84B" }} alt=""/>
            : (
              <div style={{
                width: 48, height: 48, borderRadius: "50%", backgroundColor: "#3e3028",
                border: "2px solid #C8A84B", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }}>
                <User size={20} style={{ color: "#C8A84B" }}/>
              </div>
            )
          }
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: "#F5F0E8", lineHeight: 1.3, ...wrapStyle }}>
              {personal.name || <span style={{ color: "#967A68", fontStyle: "italic", fontWeight: 400, fontSize: 12 }}>Your Name</span>}
            </h1>
            {(personal.email || personal.phone || personal.location) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0 8px", marginTop: 2, fontSize: 8.5, color: "#C8B08A" }}>
                {personal.email    && <span style={wrapStyle}>{personal.email}</span>}
                {personal.phone    && <span style={wrapStyle}>{personal.phone}</span>}
                {personal.location && <span style={wrapStyle}>{personal.location}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "108px 1fr", minHeight: 0 }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          backgroundColor: "#F5F0E8",
          borderRight: "1px solid #EDE7D9",
          padding: "16px 10px",
          minWidth: 0,
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}>

          {skills.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 7.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#9a6f10", marginBottom: 6 }}>
                Skills
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{
                    fontSize: 7.5, color: "#1a1008", backgroundColor: "#fff",
                    border: "1px solid #DDD5BE", borderRadius: 4,
                    padding: "2px 5px", lineHeight: 1.4,
                    wordBreak: "break-word", maxWidth: "100%",
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hobbies.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 7.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#9a6f10", marginBottom: 6 }}>
                Interests
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {hobbies.map((h, i) => (
                  <span key={i} style={{ fontSize: 8, color: "#4a3010", ...wrapStyle }}>{h}</span>
                ))}
              </div>
            </div>
          )}

          {(personal.linkedin || personal.portfolio) && (
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 7.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#9a6f10", marginBottom: 6 }}>
                Links
              </h2>
              {personal.linkedin  && <p style={{ fontSize: 7.5, color: "#4a3010", lineHeight: 1.5, ...wrapStyle }}>{personal.linkedin}</p>}
              {personal.portfolio && <p style={{ fontSize: 7.5, color: "#4a3010", lineHeight: 1.5, marginTop: 2, ...wrapStyle }}>{personal.portfolio}</p>}
            </div>
          )}

          {education.some(e => e.school || e.degree) && (
            <div>
              <h2 style={{ fontSize: 7.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#9a6f10", marginBottom: 6 }}>
                Education
              </h2>
              {education.map((e, i) => (e.school || e.degree) ? (
                <div key={i} style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 8, fontWeight: 600, color: "#1a1008", lineHeight: 1.3, ...wrapStyle }}>{e.degree}</p>
                  {e.school && <p style={{ fontSize: 7.5, color: "#5a4020", lineHeight: 1.3, ...wrapStyle }}>{e.school}</p>}
                  {e.year   && <p style={{ fontSize: 7, color: "#967A68" }}>{e.year}</p>}
                </div>
              ) : null)}
            </div>
          )}
        </div>

        {/* RIGHT MAIN */}
        <div style={{ padding: "16px 14px", minWidth: 0 }}>

          {personal.summary && (
            <p style={{
              fontSize: 8.5, color: "#3d2a10", lineHeight: 1.65,
              marginBottom: 12, paddingBottom: 12,
              borderBottom: "1px solid #EDE7D9",
              fontStyle: "italic", ...wrapStyle
            }}>
              {personal.summary}
            </p>
          )}

          {experience.some(e => e.company || e.role) && (
            <TSection title="Experience">
              {experience.map((e, i) => (e.company || e.role) ? (
                <div key={i} style={{ marginBottom: 12, paddingLeft: 8, borderLeft: "2px solid #DDD5BE" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: "#1a1008", flex: 1, minWidth: 0, ...wrapStyle }}>{e.role}</span>
                    <span style={{ fontSize: 8, color: "#5a4020", flexShrink: 0 }}>{e.start}{e.start && e.end ? " – " : ""}{e.end}</span>
                  </div>
                  {e.company && <p style={{ fontSize: 8.5, color: "#9a6f10", fontWeight: 600, ...wrapStyle }}>{e.company}</p>}
                  {e.desc    && <p style={{ fontSize: 8, color: "#3d2a10", marginTop: 2, lineHeight: 1.6, whiteSpace: "pre-line", ...wrapStyle }}>{e.desc}</p>}
                </div>
              ) : null)}
            </TSection>
          )}

          {projects.some(p => p.title) && (
            <TSection title="Projects">
              {projects.map((p, i) => p.title ? (
                <div key={i} style={{ marginBottom: 12, paddingLeft: 8, borderLeft: "2px solid #DDD5BE" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: "#1a1008", flex: 1, minWidth: 0, ...wrapStyle }}>{p.title}</span>
                    {p.tech && <span style={{ fontSize: 7.5, color: "#5a4020", flexShrink: 0 }}>{p.tech}</span>}
                  </div>
                  {p.link && <p style={{ fontSize: 8, color: "#9a6f10", ...wrapStyle }}>{p.link}</p>}
                  {p.desc && <p style={{ fontSize: 8, color: "#3d2a10", marginTop: 2, lineHeight: 1.6, ...wrapStyle }}>{p.desc}</p>}
                </div>
              ) : null)}
            </TSection>
          )}
        </div>
      </div>
    </div>
  );
}