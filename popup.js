document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitText');
    const textInput = document.getElementById('textInput');
    const toggleOptionalButton = document.getElementById('toggleOptionalButton');
    const optionalSettings = document.getElementById('optionalSettings');
    const passphraseInput = document.getElementById('passphraseInput');
    //const kindInput = document.getElementById('kind');
    const noteInput = document.getElementById('noteInput');
    const message = document.getElementById('message');
    const expireDays = document.getElementById('expireDays');
    const maxViews = document.getElementById('maxViews');
    const oneStepValue = document.getElementById('oneStepCheckbox');
    const userDeletable = document.getElementById('deletableCheckbox');
    
    chrome.storage.sync.get({
        serverUrl: "pwpush.com",
        daysValue: 14,
        viewsValue: 100,
        oneStepValue: false,
        userDeletable: false
    }, (items) => {
        document.getElementById('expireDays').value = items.daysValue;
        document.getElementById('maxViews').value = items.viewsValue;
        document.getElementById("oneStepCheckbox").checked = items.oneStepValue;
        document.getElementById("deletableCheckbox").checked = items.userDeletable;

        const serverLink = document.getElementById("serverLink");
        serverLink.href = `https://${items.serverUrl.replace(/^https?:\/\//, '')}/`;
        serverLink.textContent = `${items.serverUrl.replace(/^https?:\/\//, '')}`;

    });


    toggleOptionalButton.addEventListener('click', () => {
        optionalSettings.classList.toggle('hidden');
        toggleOptionalButton.textContent = optionalSettings.classList.contains('hidden') ? 'Show Optional Settings' : 'Hide Optional Settings';
    });

    submitButton.addEventListener('click', () => {
        const payload = textInput.value.trim();
        if (!payload) {
            alert('Please enter some text or a URL to push.');
            return;
        }

        const data = {
            payload: payload,
            expire_after_days: parseInt(expireDays.value, 10),
            expire_after_views: parseInt(maxViews.value, 10),
            oneStepValue: oneStepValue.checked,
            userDeletable: userDeletable.checked,
            passphrase: passphraseInput.value.trim(),
            //kind: kindInput.value,
            note: noteInput.value.trim()
        };

        chrome.runtime.sendMessage({ action: 'submitToPWPush', data: data }, (response) => {
            if (response.success) {
                console.log('PWPush request sent.');
                textInput.value = '';
            } else {
                console.error('Error:', response.error);
                alert('Failed to generate PWPush link.');
            }
        });
    });

    // Nasłuchiwanie wiadomości z background.js, aby skopiować link do schowka
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "copyToClipboard" && request.url) {
            navigator.clipboard.writeText(request.url).then(() => {
                console.log('PWPush link copied to clipboard:', request.url);
                message.style.visibility = 'visible';
                message.style.opacity = '1';
                setTimeout(() => {
                    message.style.opacity = '0';
                    message.style.visibility = 'hidden';
                }, 3000);
            }).catch(err => console.error('Clipboard error:', err));
        }
    });

    document.getElementById("openSettings").addEventListener("click", () => {
        chrome.runtime.openOptionsPage();
    });
});
