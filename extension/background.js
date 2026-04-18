const API_URL = "https://konfido-extension.vercel.app/api/send";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-selection",
    title: "Poslat do Konfida",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-selection") {
    sendToKonfido({
      text: info.selectionText,
      url: tab.url,
      title: tab.title,
      source: "selection",
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "send-page") {
    sendToKonfido({
      text: message.text,
      url: message.url,
      title: message.title,
      source: "page",
    }).then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }
});

async function sendToKonfido({ text, url, title, source }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, url, title, source }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon128.png",
    title: "Konfido",
    message: source === "selection"
      ? "Výběr odeslán do Konfida."
      : "Stránka odeslána do Konfida.",
  });
}
