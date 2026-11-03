chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "G10_INJECT_PAGE_WORLD") {
    return false;
  }
  const tabId = sender.tab?.id;
  if (!tabId) {
    sendResponse({ ok: false, error: "No tab id for injection." });
    return false;
  }
  chrome.scripting
    .executeScript({
      target: { tabId },
      files: ["content/bridge/page-world.js"],
      world: "MAIN"
    })
    .then(() => sendResponse({ ok: true }))
    .catch((err) => sendResponse({ ok: false, error: String(err.message || err) }));
  return true;
});
