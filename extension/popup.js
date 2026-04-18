const btn = document.getElementById("btn-send");
const status = document.getElementById("status");
const titleEl = document.getElementById("page-title");
const urlEl = document.getElementById("page-url");

let currentTab = null;

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  currentTab = tab;
  titleEl.textContent = tab.title || "(bez názvu)";
  urlEl.textContent = tab.url || "";
});

btn.addEventListener("click", async () => {
  if (!currentTab) return;

  btn.disabled = true;
  status.textContent = "Odesílám...";
  status.className = "status";

  try {
    const [{ result: text }] = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: () => document.body.innerText,
    });

    const response = await chrome.runtime.sendMessage({
      action: "send-page",
      text,
      url: currentTab.url,
      title: currentTab.title,
    });

    if (response?.ok) {
      status.textContent = "Odesláno do Konfida.";
      status.className = "status ok";
    } else {
      throw new Error(response?.error || "Neznámá chyba");
    }
  } catch (err) {
    status.textContent = "Chyba: " + err.message;
    status.className = "status err";
  } finally {
    btn.disabled = false;
  }
});
