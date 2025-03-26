// content.js
document.addEventListener('copy', (event) => {
    const copiedText = window.getSelection().toString(); // Get the selected text
    console.log("Copied text:", copiedText);
    if (copiedText) {
        try {
            // Send the copied text to the background script
            chrome.runtime.sendMessage({ action: "copy", text: copiedText });
        } catch (error) {
            console.error("Error sending message to background script:", error);
        }
    }
});