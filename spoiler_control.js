function addSpoilerButton() {
    const spoilerUI_Button = document.createElement('Button');
    spoilerUI_Button.textContent = 'Spoilers control';
    
    // Style the button to fix it to the right edge
    spoilerUI_Button.style.position = 'fixed';
    spoilerUI_Button.style.top = '20%';
    spoilerUI_Button.style.right = '0';
    spoilerUI_Button.style.zIndex = '9998';

    spoilerUI_Button.style.cursor = 'pointer';

    document.body.appendChild(spoilerUI_Button);

    spoilerUI_Button.addEventListener('click', () => {
        let panel = document.getElementById('spoiler-control-panel');
        if(!panel) {
            panel = document.createElement('div');
            panel.id = 'spoiler-control-panel';
            panel.style.position = 'fixed';
            panel.style.top = '0';
            panel.style.right = '0';
            panel.style.width = '20%';
            panel.style.height = '100%';
            panel.style.backgroundColor = 'white';
            panel.style.zIndex = '9999';
            panel.style.display = 'block'
            document.body.appendChild(panel);
        } else {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });
}

addSpoilerButton();