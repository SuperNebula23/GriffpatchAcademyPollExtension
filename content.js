function createPollButton() {
    const btn = document.createElement('button');
    // Using the same class as the other buttons to match styling
    btn.className = 'comments-input-btn gp-poll-btn';
    btn.type = 'button';
    btn.title = 'Add Poll';
    
    // SVG icon matching the scale of the original buttons
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 13V3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 10L7 12L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    btn.onclick = openPollModal;
    return btn;
}

function openPollModal() {
    const overlay = document.createElement('div');
    overlay.className = 'gp-poll-overlay';

    const container = document.createElement('div');
    container.className = 'gp-poll-container';

    const iframe = document.createElement('iframe');
    iframe.src = 'https://speechless-parrot.github.io/ga-polls/';
    iframe.className = 'gp-poll-iframe';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'gp-poll-close';
    closeBtn.onclick = () => overlay.remove();

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    window.addEventListener('message', (event) => {
        if (event.data === 'close-poll-maker') {
            overlay.remove();
        }
    }, { once: true });
}

// Watcher logic
const observer = new MutationObserver(() => {
    // 1. Find the "Add Video" button by its title or class
    const videoBtn = document.querySelector('button[title="Add Video"].comments-input-btn');
    
    // 2. If it exists and we haven't added our button yet
    if (videoBtn && !document.querySelector('.gp-poll-btn')) {
        // 3. Insert our button immediately after the Video button
        videoBtn.after(createPollButton());
    }
});

observer.observe(document.body, { childList: true, subtree: true });