/**
 * GRIFFPATCH ACADEMY HUB - POLL EXTENSION
 * This script injects "Add Poll" buttons and handles auto-pasting.
 */

function createPollButton() {
    const btn = document.createElement('button');
    btn.className = 'comments-input-btn gp-poll-btn';
    btn.type = 'button';
    btn.title = 'Add Poll (Community Tool)';
    
    // Bar Chart SVG Icon
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13V7M8 13V3M13 13V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    btn.onclick = (e) => {
        // 1. Find the text area associated with THIS button
        // We look for the closest container and then find the textarea inside it
        const container = e.currentTarget.closest('.discussion-form, .comment-form, .modal-content, .comments-input-container');
        const textarea = container ? container.querySelector('textarea, .ql-editor') : null;
        
        // Save this textarea globally so we know where to paste the link later
        window.lastUsedTextarea = textarea;

        // 2. Create the Modal Overlay
        const overlay = document.createElement('div');
        overlay.className = 'gp-poll-overlay';
        overlay.innerHTML = `
            <div class="gp-poll-container">
                <button class="gp-poll-close">&times;</button>
                <iframe src="https://speechless-parrot.github.io/ga-polls/" class="gp-poll-iframe"></iframe>
            </div>
        `;
        document.body.appendChild(overlay);

        // 3. Handle Closing
        overlay.querySelector('.gp-poll-close').onclick = () => overlay.remove();
        overlay.onclick = (event) => { if (event.target === overlay) overlay.remove(); };
    };
    return btn;
}

// LISTEN for the 'poll-created' message from the iframe website
window.addEventListener('message', (event) => {
    // Security: Ensure message comes from the correct domain
    if (event.origin !== 'https://speechless-parrot.github.io') return;

    if (event.data && event.data.type === 'poll-created') {
        const pollUrl = event.data.url;
        const target = window.lastUsedTextarea;

        if (target) {
            // Option A: Standard Textarea (mostly for comments)
            if (target.tagName === 'TEXTAREA') {
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const text = target.value;
                target.value = text.slice(0, start) + `\n${pollUrl}\n` + text.slice(end);
            } 
            // Option B: Rich Text Editor (if the Hub uses Quill/Div-based editors)
            else {
                const linkElement = document.createElement('p');
                linkElement.innerText = pollUrl;
                target.appendChild(linkElement);
            }
            
            // Dispatch 'input' event so the website's code detects the new text
            target.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Auto-close the modal after pasting
        const overlay = document.querySelector('.gp-poll-overlay');
        if (overlay) overlay.remove();
    }
});

// Function to find all "Add Video" buttons and place a "Add Poll" button next to them
function injectPollButtons() {
    const videoButtons = document.querySelectorAll('button[title="Add Video"].comments-input-btn');
    
    videoButtons.forEach(videoBtn => {
        const parent = videoBtn.parentElement;
        // Check if we haven't already added a button here
        if (parent && !parent.querySelector('.gp-poll-btn')) {
            videoBtn.after(createPollButton());
        }
    });
}

// Run immediately and then watch for new elements (like when a comment box opens)
const observer = new MutationObserver(injectPollButtons);
observer.observe(document.body, { childList: true, subtree: true });
injectPollButtons();
