document.addEventListener("DOMContentLoaded", () => {
    const historyList = document.getElementById("historyList");
    const clearAllButton = document.getElementById("clearAllButton");

    // Fetch clipboard history
    chrome.runtime.sendMessage({ action: "getHistory" }, (response) => {
        if (response.history) {
            response.history.forEach((item, index) => {
                const li = document.createElement("li");

                // Create a span for the text
                const textSpan = document.createElement("span");
                textSpan.textContent = item;

                // Truncate long text
                if (item.length > 50) {
                    textSpan.classList.add("truncated");
                    textSpan.textContent = item.substring(0, 50) + "...";
                }

                // Create a copy button
                const copyButton = document.createElement("button");
                copyButton.textContent = "Copy";
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(item).then(() => {
                        alert("Copied to clipboard!");
                    });
                };

                // Create a delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = () => {
                    chrome.runtime.sendMessage({ action: "deleteItem", index: index }, (response) => {
                        if (response.success) {
                            li.remove(); // Remove the item from the list
                        } else {
                            alert("Failed to delete item.");
                        }
                    });
                };

                // Create a "Show More" button if the text was truncated
                if (item.length > 50) {
                    const showMoreButton = document.createElement("button");
                    showMoreButton.textContent = "Show More";
                    showMoreButton.classList.add("show-more");
                    showMoreButton.onclick = () => {
                        if (textSpan.classList.contains("truncated")) {
                            textSpan.textContent = item;
                            textSpan.classList.remove("truncated");
                            showMoreButton.textContent = "Show Less";
                        } else {
                            textSpan.textContent = item.substring(0, 50) + "...";
                            textSpan.classList.add("truncated");
                            showMoreButton.textContent = "Show More";
                        }
                    };
                    li.appendChild(showMoreButton);
                }

                // Append the text and buttons to the list item
                li.appendChild(textSpan);
                li.appendChild(copyButton);
                li.appendChild(deleteButton);
                historyList.appendChild(li);
            });
        }
    });

    // Clear all button functionality
    clearAllButton.onclick = () => {
        if (confirm("Are you sure you want to clear all clipboard history?")) {
            chrome.runtime.sendMessage({ action: "clearAll" }, (response) => {
                if (response.success) {
                    historyList.innerHTML = ""; // Clear the displayed history
                } else {
                    alert("Failed to clear history.");
                }
            });
        }
    };
});