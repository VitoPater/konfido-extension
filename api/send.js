const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, url, title, source } = req.body || {};

  if (!text) return res.status(400).json({ error: "Chybí text" });

  const date = new Date().toLocaleString("cs-CZ", { timeZone: "Europe/Prague" });
  const sourceLabel = source === "selection" ? "Vybraný text" : "Celá stránka";

  const emailBody = `
Zdroj: ${sourceLabel}
Datum: ${date}
URL: ${url || "—"}
Název stránky: ${title || "—"}

---

${text}
`.trim();

  await transporter.sendMail({
    from: `"Konfido Extension" <${process.env.GMAIL_USER}>`,
    to: process.env.RECIPIENT || "vit.pater@gnj.cz",
    subject: `[Konfido] ${title || url || "Nový dokument"}`,
    text: emailBody,
  });

  return res.status(200).json({ ok: true });
};
