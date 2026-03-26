/**
 * GRIFFPATCH ACADEMY HUB - POLL EXTENSION
 * Handles injection into Tiptap/ProseMirror editors.
 */

function createPollButton() {
    const btn = document.createElement('button');
    btn.className = 'comments-input-btn gp-poll-btn';
    btn.type = 'button';
    btn.title = 'Add Poll (Community Tool)';
    
    // SVG icon
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13V7M8 13V3M13 13V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    btn.onclick = (e) => {
        // Find the specific editor associated with the toolbar clicked
        // This looks up for the container, then down for the ProseMirror div
        const container = e.currentTarget.closest('.discussion-form, .comment-form, .modal-content, .comments-input-container');
        const editor = container ? container.querySelector('.ProseMirror[contenteditable="true"]') : null;
        
        window.lastUsedEditor = editor;

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
        overlay.onclick = (event) => { if (event.target === overlay) overlay.remove(); };
    };
    return btn;
}

// LISTEN for the message from the poll creator site
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://speechless-parrot.github.io') return;

    if (event.data && event.data.type === 'poll-created') {
        const pollUrl = event.data.url;
        const editor = window.lastUsedEditor;

        if (editor) {
            // Remove the "is-empty" placeholder classes if they exist
            editor.querySelectorAll('.is-empty').forEach(el => el.classList.remove('is-empty', 'is-editor-empty'));

            // Create a new paragraph with the link
            const newPara = document.createElement('p');
            const link = document.createElement('a');
            link.href = pollUrl;
            link.innerText = pollUrl;
            link.target = "_blank";
            
            newPara.appendChild(link);
            editor.appendChild(newPara);

            // Important: Tell the Tiptap editor that the content has changed
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            editor.dispatchEvent(new Event('keyup', { bubbles: true }));
        }

        // Close the popup
        const overlay = document.querySelector('.gp-poll-overlay');
        if (overlay) overlay.remove();
    }
});

// Find ALL video buttons and inject the poll button
function injectPollButtons() {
    const videoButtons = document.querySelectorAll('button[title="Add Video"].comments-input-btn');
    
    videoButtons.forEach(videoBtn => {
        const parent = videoBtn.parentElement;
        if (parent && !parent.querySelector('.gp-poll-btn')) {
            videoBtn.after(createPollButton());
        }
    });
}

const observer = new MutationObserver(injectPollButtons);
observer.observe(document.body, { childList: true, subtree: true });
injectPollButtons();
