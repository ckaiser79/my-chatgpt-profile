window.myApp = {
    load() {
        console.log('Prompt page loaded');
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Load prompt from file
    fetch('data/default-prompt.txt')
        .then(r => r.text())
        .then(text => {
            const promptEl = document.getElementById('prompt-1');
            if (promptEl) {
                promptEl.textContent = text;
            }
        })
        .catch(err => {
            console.error('Failed to load prompt:', err);
            document.getElementById('prompt-1').textContent = Polyglot.t('prompts.error');
        });
});

function copyToClipboard(elementId, button) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied to Clipboard';
        setTimeout(() => {
            button.textContent = 'Copy Prompt';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            button.textContent = 'Copied to Clipboard';
            setTimeout(() => {
                button.textContent = 'Copy Prompt';
            }, 2000);
        } catch (fallbackErr) {
            console.error('Fallback copy failed: ', fallbackErr);
            button.textContent = 'Copy Failed';
            setTimeout(() => {
                button.textContent = 'Copy Prompt';
            }, 2000);
        }
        document.body.removeChild(textArea);
    });
}