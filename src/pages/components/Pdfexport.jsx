import jsPDF from "jspdf";

export function downloadPDF(formData, template) {
  const { personal, education, experience, projects, skills, hobbies } = formData;
  const pdf = new jsPDF("p", "mm", "a4");

  const W       = 210;
  const marginL = 18;
  const marginR = 18;
  const contentW = W - marginL - marginR;
  let y = 0;

  const GOLD  = [200, 168, 75];
  const DARK  = [46,  34,  24];
  const MID   = [90,  63,  42];
  const LIGHT = [150, 122, 104];
  const BLACK = [10,  10,  10];

  const setColor = ([r,g,b]) => { pdf.setTextColor(r,g,b); };
  const setDraw  = ([r,g,b]) => { pdf.setDrawColor(r,g,b); };
  const setFill  = ([r,g,b]) => { pdf.setFillColor(r,g,b); };

  const addPage = () => { pdf.addPage(); y = 14; };
  const checkY  = (needed = 10) => { if (y + needed > 282) addPage(); };

  const wrap = (text, fontSize, maxW = contentW) => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(String(text || ""), maxW);
  };

  const writeLine = (lines, fontSize, color, x = marginL, lineH = null) => {
    setColor(color);
    pdf.setFontSize(fontSize);
    const lh = lineH ?? fontSize * 0.45;
    const arr = Array.isArray(lines) ? lines : [lines];
    arr.forEach(line => {
      checkY(lh + 1);
      pdf.text(line, x, y);
      y += lh;
    });
  };

  const hRule = (color = [221,213,190], thickness = 0.3) => {
    setDraw(color);
    pdf.setLineWidth(thickness);
    pdf.line(marginL, y, W - marginR, y);
    y += 2;
  };

  const sectionHeading = (title) => {
    y += 4;
    checkY(8);
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    setColor(GOLD);
    pdf.text(title.toUpperCase(), marginL, y);
    const titleW = pdf.getTextWidth(title.toUpperCase()) + 2;
    setDraw(GOLD);
    pdf.setLineWidth(0.4);
    pdf.line(marginL + titleW, y - 0.5, W - marginR, y - 0.5);
    y += 3.5;
    pdf.setFont("helvetica", "normal");
  };

  // ── MODERN ───────────────────────────────────────────────
  if (template === "modern") {
    setFill(GOLD);
    pdf.rect(0, 0, W, 3.5, "F");
    y = 11;

    pdf.setFont("helvetica", "bold");
    writeLine(personal.name || "Your Name", 18, DARK);
    y += 1;

    pdf.setFont("helvetica", "normal");
    const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin, personal.portfolio].filter(Boolean);
    if (contactParts.length) { writeLine(contactParts.join("   •   "), 8, LIGHT); y += 1; }

    hRule([221,213,190], 0.5);

    if (personal.summary) {
      pdf.setFont("helvetica", "italic");
      writeLine(wrap(personal.summary, 9.5), 9.5, MID);
      y += 2; hRule(); pdf.setFont("helvetica", "normal");
    }

    if (education.some(e => e.school || e.degree)) {
      sectionHeading("Education");
      education.forEach(e => {
        if (!e.school && !e.degree) return;
        checkY(7);
        pdf.setFont("helvetica", "bold"); setColor(DARK); pdf.setFontSize(9.5);
        pdf.text([e.degree, e.school].filter(Boolean).join(" — "), marginL, y);
        if (e.year) {
          pdf.setFont("helvetica", "normal"); setColor(LIGHT); pdf.setFontSize(8.5);
          pdf.text(e.year, W - marginR, y, { align: "right" });
        }
        y += 5;
      });
    }

    if (experience.some(e => e.company || e.role)) {
      sectionHeading("Experience");
      experience.forEach(e => {
        if (!e.company && !e.role) return;
        checkY(10);
        pdf.setFont("helvetica", "bold"); setColor(DARK); pdf.setFontSize(10);
        pdf.text(e.role || "", marginL, y);
        const dateStr = [e.start, e.end].filter(Boolean).join(" – ");
        if (dateStr) {
          pdf.setFont("helvetica", "normal"); setColor(LIGHT); pdf.setFontSize(8.5);
          pdf.text(dateStr, W - marginR, y, { align: "right" });
        }
        y += 4.5;
        if (e.company) { pdf.setFont("helvetica", "bolditalic"); writeLine(e.company, 9, GOLD); y += 0.5; }
        if (e.desc) { pdf.setFont("helvetica", "normal"); writeLine(wrap(e.desc, 8.5), 8.5, MID); }
        y += 2;
      });
    }

    if (projects.some(p => p.title)) {
      sectionHeading("Projects");
      projects.forEach(p => {
        if (!p.title) return;
        checkY(8);
        pdf.setFont("helvetica", "bold"); setColor(DARK); pdf.setFontSize(10);
        pdf.text(p.title, marginL, y);
        if (p.tech) {
          pdf.setFont("helvetica", "normal"); setColor(LIGHT); pdf.setFontSize(8);
          pdf.text(p.tech, W - marginR, y, { align: "right" });
        }
        y += 4.5;
        if (p.link) { writeLine(p.link, 8, GOLD); y += 0.5; }
        if (p.desc) { writeLine(wrap(p.desc, 8.5), 8.5, MID); }
        y += 2;
      });
    }

    if (skills.length > 0) {
      sectionHeading("Skills");
      pdf.setFont("helvetica", "normal");
      writeLine(wrap(skills.join("  •  "), 9), 9, DARK);
      y += 2;
    }

    if (hobbies.length > 0) {
      sectionHeading("Interests");
      pdf.setFont("helvetica", "normal");
      writeLine(hobbies.join("   ·   "), 9, MID);
    }

  // ── CLASSIC ──────────────────────────────────────────────
  } else if (template === "classic") {
    y = 18;

    pdf.setFont("helvetica", "bold"); setColor(BLACK); pdf.setFontSize(20);
    pdf.text(personal.name || "Your Name", W / 2, y, { align: "center" });
    y += 7;

    setDraw(BLACK); pdf.setLineWidth(0.8);
    pdf.line(marginL, y, W - marginR, y);
    y += 4;

    const cParts = [personal.email, personal.phone, personal.location, personal.linkedin, personal.portfolio].filter(Boolean);
    if (cParts.length) {
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); setColor([50,50,50]);
      pdf.text(cParts.join("   |   "), W / 2, y, { align: "center" });
      y += 5;
    }

    if (personal.summary) {
      pdf.setFont("helvetica", "italic");
      wrap(personal.summary, 9.5).forEach(line => {
        checkY(5); setColor([30,30,30]); pdf.setFontSize(9.5);
        pdf.text(line, W / 2, y, { align: "center" }); y += 4.5;
      });
      y += 2;
    }

    const cSection = (title) => {
      y += 3; checkY(8);
      pdf.setFont("helvetica", "bold"); setColor(BLACK); pdf.setFontSize(9);
      pdf.text(title.toUpperCase(), marginL, y);
      y += 2; setDraw(BLACK); pdf.setLineWidth(0.5);
      pdf.line(marginL, y, W - marginR, y); y += 3.5;
      pdf.setFont("helvetica", "normal");
    };

    if (education.some(e => e.school || e.degree)) {
      cSection("Education");
      education.forEach(e => {
        if (!e.school && !e.degree) return;
        checkY(6);
        pdf.setFont("helvetica", "bold"); setColor(BLACK); pdf.setFontSize(9.5);
        pdf.text([e.degree, e.school].filter(Boolean).join(", "), marginL, y);
        if (e.year) {
          pdf.setFont("helvetica", "normal"); setColor([80,80,80]); pdf.setFontSize(8.5);
          pdf.text(e.year, W - marginR, y, { align: "right" });
        }
        y += 5;
      });
    }

    if (experience.some(e => e.company || e.role)) {
      cSection("Work Experience");
      experience.forEach(e => {
        if (!e.company && !e.role) return;
        checkY(10);
        pdf.setFont("helvetica", "bold"); setColor(BLACK); pdf.setFontSize(10);
        pdf.text([e.role, e.company].filter(Boolean).join(", "), marginL, y);
        const dateStr = [e.start, e.end].filter(Boolean).join(" – ");
        if (dateStr) {
          pdf.setFont("helvetica", "normal"); setColor([80,80,80]); pdf.setFontSize(8.5);
          pdf.text(dateStr, W - marginR, y, { align: "right" });
        }
        y += 4.5;
        if (e.desc) {
          pdf.setFont("helvetica", "normal"); setColor([30,30,30]);
          writeLine(wrap(e.desc, 8.5), 8.5, [30,30,30], marginL + 4);
        }
        y += 2;
      });
    }

    if (projects.some(p => p.title)) {
      cSection("Projects");
      projects.forEach(p => {
        if (!p.title) return;
        checkY(8);
        pdf.setFont("helvetica", "bold"); setColor(BLACK); pdf.setFontSize(10);
        pdf.text([p.title, p.tech].filter(Boolean).join(" | "), marginL, y);
        y += 4.5;
        if (p.link) { writeLine(p.link, 8.5, [80,80,80], marginL + 4); }
        if (p.desc) { writeLine(wrap(p.desc, 8.5), 8.5, [30,30,30], marginL + 4); }
        y += 2;
      });
    }

    if (skills.length > 0) {
      cSection("Skills");
      pdf.setFont("helvetica", "normal");
      writeLine(wrap(skills.join(", "), 9), 9, [20,20,20]);
      y += 2;
    }

    if (hobbies.length > 0) {
      cSection("Interests");
      writeLine(hobbies.join(", "), 9, [20,20,20]);
    }

  // ── TWO-COLUMN ───────────────────────────────────────────
  } else if (template === "twocol") {
    const sideW   = 58;
    const mainX   = sideW + 8;
    const mainW   = W - mainX - marginR;
    const sideX   = 6;
    const sideInW = sideW - 4;

    setFill(DARK); pdf.rect(0, 0, W, 22, "F");
    pdf.setFont("helvetica", "bold"); setColor([245,240,232]); pdf.setFontSize(15);
    pdf.text(personal.name || "Your Name", 10, 12);
    pdf.setFont("helvetica", "normal"); setColor([200,176,138]); pdf.setFontSize(8);
    const hContact = [personal.email, personal.phone, personal.location].filter(Boolean).join("   •   ");
    if (hContact) pdf.text(hContact, 10, 18);

    setFill([245,240,232]); pdf.rect(0, 22, sideW + 2, 275, "F");
    setDraw([221,213,190]); pdf.setLineWidth(0.4);
    pdf.line(sideW + 2, 22, sideW + 2, 297);

    let sy = 30;
    let my = 28;

    const sideSection = (title) => {
      sy += 3;
      pdf.setFont("helvetica", "bold"); setColor(GOLD); pdf.setFontSize(7.5);
      pdf.text(title.toUpperCase(), sideX, sy);
      sy += 1.5; setDraw(GOLD); pdf.setLineWidth(0.3);
      pdf.line(sideX, sy, sideX + sideInW, sy);
      sy += 3; pdf.setFont("helvetica", "normal");
    };

    const mainSection = (title) => {
      my += 4;
      pdf.setFont("helvetica", "bold"); setColor(GOLD); pdf.setFontSize(7.5);
      pdf.text(title.toUpperCase(), mainX, my);
      const tw = pdf.getTextWidth(title.toUpperCase()) + 2;
      setDraw(GOLD); pdf.setLineWidth(0.3);
      pdf.line(mainX + tw, my - 0.5, W - marginR, my - 0.5);
      my += 4; pdf.setFont("helvetica", "normal");
    };

    if (skills.length > 0) {
      sideSection("Skills");
      skills.forEach(s => {
        pdf.splitTextToSize(s, sideInW).forEach(l => {
          setColor(DARK); pdf.setFontSize(8); pdf.text(l, sideX, sy); sy += 3.8;
        });
      });
    }

    if (hobbies.length > 0) {
      sideSection("Interests");
      hobbies.forEach(h => {
        setColor(MID); pdf.setFontSize(8); pdf.text(h, sideX, sy); sy += 4;
      });
    }

    if (personal.linkedin || personal.portfolio) {
      sideSection("Links");
      [personal.linkedin, personal.portfolio].filter(Boolean).forEach(l => {
        pdf.splitTextToSize(l, sideInW).forEach(ln => {
          setColor([154,111,16]); pdf.setFontSize(7.5); pdf.text(ln, sideX, sy); sy += 3.8;
        });
      });
    }

    if (education.some(e => e.school || e.degree)) {
      sideSection("Education");
      education.forEach(e => {
        if (!e.school && !e.degree) return;
        if (e.degree) {
          pdf.setFont("helvetica", "bold"); setColor(DARK); pdf.setFontSize(8);
          pdf.splitTextToSize(e.degree, sideInW).forEach(l => { pdf.text(l, sideX, sy); sy += 4; });
        }
        if (e.school) {
          pdf.setFont("helvetica", "normal"); setColor(MID); pdf.setFontSize(7.5);
          pdf.splitTextToSize(e.school, sideInW).forEach(l => { pdf.text(l, sideX, sy); sy += 3.8; });
        }
        if (e.year) { setColor(LIGHT); pdf.setFontSize(7); pdf.text(e.year, sideX, sy); sy += 4; }
        sy += 1;
      });
    }

    if (personal.summary) {
      pdf.setFont("helvetica", "italic"); setColor(MID); pdf.setFontSize(8.5);
      pdf.splitTextToSize(personal.summary, mainW).forEach(l => { pdf.text(l, mainX, my); my += 4; });
      my += 2; setDraw([221,213,190]); pdf.setLineWidth(0.3);
      pdf.line(mainX, my, W - marginR, my); my += 3;
      pdf.setFont("helvetica", "normal");
    }

    if (experience.some(e => e.company || e.role)) {
      mainSection("Experience");
      experience.forEach(e => {
        if (!e.company && !e.role) return;
        pdf.setFont("helvetica", "bold"); setColor(DARK); pdf.setFontSize(9.5);
        pdf.text(e.role || "", mainX, my);
        const dateStr = [e.start, e.end].filter(Boolean).join(" – ");
        if (dateStr) {
          pdf.setFont("helvetica", "normal"); setColor(LIGHT); pdf.setFontSize(8);
          pdf.text(dateStr, W - marginR, my, { align: "right" });
        }
        my += 4.5;
        if (e.company) {
          pdf.setFont("helvetica", "bold"); setColor(GOLD); pdf.setFontSize(8.5);
          pdf.text(e.company, mainX, my); my += 4;
        }
        if (e.desc) {
          pdf.setFont("helvetica", "normal"); setColor(MID); pdf.setFontSize(8);
          pdf.splitTextToSize(e.desc, mainW).forEach(l => { pdf.text(l, mainX + 2, my); my += 3.8; });
        }
        my += 2;
      });
    }

    if (projects.some(p => p.title)) {
      mainSection("Projects");
      projects.forEach(p => {
        if (!p.title) return;
        pdf.setFont("helvetica", "bold"); setColor(DARK); pdf.setFontSize(9.5);
        pdf.text(p.title, mainX, my);
        if (p.tech) {
          pdf.setFont("helvetica", "normal"); setColor(LIGHT); pdf.setFontSize(8);
          pdf.text(p.tech, W - marginR, my, { align: "right" });
        }
        my += 4.5;
        if (p.link) { setColor([154,111,16]); pdf.setFontSize(8); pdf.text(p.link, mainX, my); my += 4; }
        if (p.desc) {
          pdf.setFont("helvetica", "normal"); setColor(MID); pdf.setFontSize(8);
          pdf.splitTextToSize(p.desc, mainW).forEach(l => { pdf.text(l, mainX + 2, my); my += 3.8; });
        }
        my += 2;
      });
    }
  }

  pdf.save(`resume-${template}.pdf`);
}