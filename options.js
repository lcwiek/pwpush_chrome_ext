document.addEventListener("DOMContentLoaded", function () {
    const serverUrl = document.getElementById("serverUrl");
    const serverToken = document.getElementById("serverToken");
    const daysValue = document.getElementById("daysValue");
    const viewsValue = document.getElementById("viewsValue");
    const oneStep = document.getElementById("oneStep");
    const userDeletable = document.getElementById("userDeletable");
    const saveButton = document.getElementById("saveOptions");
    const status = document.getElementById("status");

    function showStatus(message, color) {
        status.textContent = message;
        status.style.color = color;
    }
    
    function cleanServerUrl(input) {
        try {
            const url = new URL(input.includes('://') ? input : 'https://' + input);
            return url.hostname;
        } catch (e) {
            return '';
        }
    }
    
    chrome.storage.sync.get({
        serverUrl: "pwpush.clss.pl",
        daysValue: 14,
        viewsValue: 100,
        oneStepValue: false,
        userDeletable: false
    }, (items) => {
        serverUrl.value = items.serverUrl;
        daysValue.value = items.daysValue;
        viewsValue.value = items.viewsValue;
        oneStep.checked = items.oneStepValue;
        userDeletable.checked = items.userDeletable;
        
        const serverLink = document.getElementById("serverLink");
        serverLink.href = `https://${items.serverUrl.replace(/^https?:\/\//, '')}/`;
        serverLink.textContent = `${items.serverUrl.replace(/^https?:\/\//, '')}`;

        showStatus("Settings loaded.", "gray");
        setTimeout(() => showStatus("", "black"), 3000);
    });

    chrome.storage.local.get("serverToken", (items) => {
        serverToken.value = items.serverToken || "";
    });

    saveButton.addEventListener("click", function () {

        chrome.storage.sync.set({
            serverUrl: cleanServerUrl(serverUrl.value),
            daysValue: parseInt(daysValue.value, 10),
            viewsValue: parseInt(viewsValue.value, 10),
            oneStepValue: oneStep.checked,
            userDeletable: userDeletable.checked
        });

        chrome.storage.local.set({
            serverToken: serverToken.value
        });

        showStatus("Settings saved successfully!", "green");
        setTimeout(() => showStatus("", "black"), 3000);
    });
});
