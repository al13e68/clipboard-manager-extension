let clipboardHistory = [];

// Load history on startup
chrome.storage.local.get("clipboardHistory", (data) => {
    if (data.clipboardHistory) {
        clipboardHistory = data.clipboardHistory;
    }
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "copy") {
        const text = request.text;
        clipboardHistory.push(text);
        chrome.storage.local.set({ clipboardHistory });
        sendResponse({ status: "success" });
    } else if (request.action === "getHistory") {
        sendResponse({ history: clipboardHistory });
    } else if (request.action === "deleteItem") {
        const index = request.index;
        if (index >= 0 && index < clipboardHistory.length) {
            clipboardHistory.splice(index, 1); // Remove the item from the history
            chrome.storage.local.set({ clipboardHistory }); // Save the updated history
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
    } else if (request.action === "clearAll") {
        clipboardHistory = []; // Clear the history
        chrome.storage.local.set({ clipboardHistory }); // Save the cleared history
        sendResponse({ success: true });
    } else {
        sendResponse({ success: false });
    }
});