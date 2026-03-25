function createPollButton() {
    const btn = document.createElement('button');
    btn.className = 'comments-input-btn gp-poll-btn';
    btn.type = 'button';
    btn.title = 'Add Poll (Community Tool)';
    
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13V7M8 13V3M13 13V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    btn.onclick = () => {
        const overlay = document.createElement('div');
        overlay.className = 'gp-poll-overlay';
        overlay.innerHTML = `
            <div class="gp-poll-container">
                <button class="gp-poll-close">&times;</button>
                <iframe src="https://speechless-parrot.github.io/ga-polls/" class="gp-poll-iframe"></iframe>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.gp-poll-close').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    };
    return btn;
}

// This function finds ALL video buttons and adds the poll button next to them
function injectPollButtons() {
    const videoButtons = document.querySelectorAll('button[title="Add Video"].comments-input-btn');
    
    videoButtons.forEach(videoBtn => {
        // If the poll button isn't already next to THIS specific video button
        if (!videoBtn.nextElementSibling || !videoBtn.nextElementSibling.classList.contains('gp-poll-btn')) {
            videoBtn.after(createPollButton());
        }
    });
}

// 1. Run it immediately when the script loads
injectPollButtons();

// 2. Watch for new comment boxes appearing (MutationObserver)
const observer = new MutationObserver((mutations) => {
    injectPollButtons();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
