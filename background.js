async function sendToPWPush(data, sendResponse, tab) {

    function cleanServerUrl(input) {
        try {
            const url = new URL(input.includes('://') ? input : 'https://' + input);
            return url.hostname;
        } catch (e) {
            return '';
        }
    }

    try {
        const syncSettings = await new Promise((resolve) => {
            chrome.storage.sync.get({
                serverUrl: "pwpush.clss.pl",
                daysValue: 14,
                viewsValue: 100,
                oneStepValue: false,
                userDeletable: false
            }, resolve);
        });

        const localSettings = await new Promise((resolve) => {
            chrome.storage.local.get("serverToken", resolve);
        });

        const normalizedUrl = cleanServerUrl(syncSettings.serverUrl);
        const apiUrl = `https://${normalizedUrl}/p.json`;
        const serverToken = localSettings.serverToken || "";

        const urlencoded = new URLSearchParams();
        urlencoded.append("password[payload]", data.payload);
        urlencoded.append("password[expire_after_days]", data.expire_after_days || syncSettings.daysValue);
        urlencoded.append("password[expire_after_views]", data.expire_after_views || syncSettings.viewsValue);
        urlencoded.append("password[deletable_by_viewer]", data.userDeletable !== undefined ? data.userDeletable : syncSettings.userDeletable);
        urlencoded.append("password[retrieval_step]", data.oneStepValue !== undefined ? data.oneStepValue : syncSettings.oneStepValue);
        urlencoded.append("password[passphrase]", data.passphrase || "");
        urlencoded.append("password[note]", data.note || "");
        
        const headers = { 
            "Content-Type": "application/x-www-form-urlencoded"
        };

        if (serverToken.trim() !== "") {
            headers["Authorization"] = `Bearer ${serverToken}`;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: urlencoded.toString(),
        });

        const result = await response.json();

        const pwpushUrl = `https://${normalizedUrl}/p/${result.url_token}${(data.oneStepValue !== undefined ? data.oneStepValue : syncSettings.oneStepValue) ? "/r" : ""}`;

        console.log("Generated PWPush URL");

        if (tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (text) => {
                    navigator.clipboard.writeText(text).then(() => {
                        console.log('Text copied to clipboard');
                    }).catch(err => {
                        console.error('Failed to copy text to clipboard:', err);
                    });
                },
                args: [pwpushUrl]
            });
        } else {            
            chrome.runtime.sendMessage({ action: "copyToClipboard", url: pwpushUrl }, () => {
                if (chrome.runtime.lastError) {
                    console.warn("No active listener for sendMessage (Popup closed).");
                }
            });
        }

        chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/pwpush-128.png",
            title: "PWPush",
            message: "PWPush link copied to clipboard!"
        });

        sendResponse && sendResponse({ success: true, response: result });

    } catch (error) {
        console.error('Error sending password to PWPush:', error);

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/pwpush-128.png',
            title: 'PWPush Error',
            message: 'Failed to generate PWPush link.'
        });

        sendResponse && sendResponse({ success: false, error: error.message });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'submitToPWPush') {
        sendToPWPush(request.data, sendResponse, null);
        return true;
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'pwpush_menu' && info.selectionText) {
        console.log("PWPush menu clicked");
        sendToPWPush({ payload: info.selectionText }, null, tab);
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({ url: "instructions.html" });
    }

    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'pwpush_menu',
            title: 'Send to PWPush',
            contexts: ['selection']
        });
    });
});
