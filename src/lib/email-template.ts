interface EmailParams {
  type: "morning" | "evening" | "streak-break";
  quote: string;
  dayNumber: number;
  totalDays: number;
  daysLeft: number;
  incompleteTasks: string[];
  completedTasks: string[];
  streakCount: number;
  currentWeight?: number | null;
  targetWeight: number;
  appUrl?: string;
}

export function getSubjectLine(params: EmailParams): string {
  switch (params.type) {
    case "morning":
      return `DAY ${params.dayNumber}/${params.totalDays} — WAKE UP AND GRIND`;
    case "evening":
      return `${params.incompleteTasks.length} TASKS REMAINING — NO EXCUSES`;
    case "streak-break":
      return `STREAK BROKEN — GET BACK IN LINE`;
  }
}

export function buildEmailHTML(params: EmailParams): string {
  const {
    type,
    quote,
    dayNumber,
    totalDays,
    daysLeft,
    incompleteTasks,
    completedTasks,
    streakCount,
    currentWeight,
    targetWeight,
    appUrl = "#",
  } = params;

  const typeLabel =
    type === "morning"
      ? "MORNING BRIEFING"
      : type === "evening"
        ? "EVENING DEBRIEF"
        : "STREAK ALERT";

  const typeColor =
    type === "streak-break" ? "#c00018" : type === "evening" ? "#ff8c00" : "#4ae176";

  const progressPct = Math.round((dayNumber / totalDays) * 100);

  const incompleteHTML = incompleteTasks
    .map(
      (t) =>
        `<tr><td style="padding:6px 12px;font-size:14px;color:#ff6b6b;font-weight:700;letter-spacing:0.5px;">&#10007; ${t}</td></tr>`
    )
    .join("");

  const completedHTML = completedTasks
    .map(
      (t) =>
        `<tr><td style="padding:6px 12px;font-size:14px;color:#4ae176;letter-spacing:0.5px;">&#10003; ${t}</td></tr>`
    )
    .join("");

  const weightLine =
    currentWeight != null
      ? `<span style="margin-right:24px;">WEIGHT: ${currentWeight}kg</span><span>TARGET: ${targetWeight}kg</span>`
      : `<span>TARGET: ${targetWeight}kg</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#0e0e0e;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="padding:24px 28px 0;border-bottom:2px solid ${typeColor};">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:10px;font-weight:900;color:${typeColor};letter-spacing:3px;text-transform:uppercase;padding-bottom:16px;">
        ${typeLabel}
      </td>
      <td align="right" style="font-size:10px;font-weight:700;color:#666;letter-spacing:2px;padding-bottom:16px;">
        DAY ${dayNumber}/${totalDays}
      </td>
    </tr></table>
  </td></tr>

  <!-- Quote -->
  <tr><td style="padding:32px 28px;">
    <p style="margin:0;font-size:20px;font-weight:900;color:#ffffff;line-height:1.4;letter-spacing:0.5px;text-transform:uppercase;">
      &ldquo;${quote}&rdquo;
    </p>
  </td></tr>

  <!-- Progress Bar -->
  <tr><td style="padding:0 28px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="font-size:9px;font-weight:700;color:#666;letter-spacing:2px;padding-bottom:6px;">
        PROGRAM PROGRESS — ${progressPct}%
      </td></tr>
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:4px;overflow:hidden;">
          <tr><td style="width:${progressPct}%;height:6px;background-color:${typeColor};border-radius:4px;"></td>
          <td style="height:6px;"></td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  ${
    incompleteTasks.length > 0
      ? `<!-- Incomplete Tasks -->
  <tr><td style="padding:0 28px 16px;">
    <p style="margin:0 0 8px;font-size:10px;font-weight:900;color:#ff6b6b;letter-spacing:3px;">REMAINING TASKS</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a0000;border-radius:6px;border:1px solid #330000;">
      ${incompleteHTML}
    </table>
  </td></tr>`
      : ""
  }

  ${
    completedTasks.length > 0
      ? `<!-- Completed Tasks -->
  <tr><td style="padding:0 28px 16px;">
    <p style="margin:0 0 8px;font-size:10px;font-weight:900;color:#4ae176;letter-spacing:3px;">COMPLETED</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#001a00;border-radius:6px;border:1px solid #003300;">
      ${completedHTML}
    </table>
  </td></tr>`
      : ""
  }

  <!-- Stats -->
  <tr><td style="padding:16px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:6px;">
      <tr>
        <td style="padding:14px 16px;text-align:center;border-right:1px solid #222;">
          <div style="font-size:9px;font-weight:700;color:#666;letter-spacing:2px;">STREAK</div>
          <div style="font-size:22px;font-weight:900;color:#ffffff;padding-top:4px;">${streakCount}</div>
          <div style="font-size:9px;color:#666;">DAY${streakCount !== 1 ? "S" : ""}</div>
        </td>
        <td style="padding:14px 16px;text-align:center;border-right:1px solid #222;">
          <div style="font-size:9px;font-weight:700;color:#666;letter-spacing:2px;">DAYS LEFT</div>
          <div style="font-size:22px;font-weight:900;color:${daysLeft <= 7 ? "#ff6b6b" : "#ffffff"};padding-top:4px;">${daysLeft}</div>
          <div style="font-size:9px;color:#666;">REMAINING</div>
        </td>
        <td style="padding:14px 16px;text-align:center;">
          <div style="font-size:9px;font-weight:700;color:#666;letter-spacing:2px;">WEIGHT</div>
          <div style="font-size:22px;font-weight:900;color:#ffffff;padding-top:4px;">${currentWeight ?? "—"}</div>
          <div style="font-size:9px;color:#666;">KG</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:8px 28px 28px;" align="center">
    <a href="${appUrl}" style="display:inline-block;padding:14px 40px;background-color:${typeColor};color:#000000;font-size:13px;font-weight:900;letter-spacing:3px;text-transform:uppercase;text-decoration:none;border-radius:4px;">
      OPEN GRIND &rarr;
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:16px 28px;border-top:1px solid #1a1a1a;">
    <p style="margin:0;font-size:10px;color:#444;text-align:center;letter-spacing:1px;">
      ${weightLine}
    </p>
    <p style="margin:8px 0 0;font-size:9px;color:#333;text-align:center;letter-spacing:1px;">
      GRIND — 33 DAY TRANSFORMATION PROTOCOL
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
