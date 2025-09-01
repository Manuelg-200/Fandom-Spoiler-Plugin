function sources_Scan() {
    mwContentText = document.getElementById("mw-content-text");
    if (mwContentText) {
        const sources = {};
        const p_elements = mwContentText.querySelectorAll('p');
        p_elements.forEach(p => {
            const sourceElements = p.querySelectorAll('a[href^="/wiki/"] > span');
            sourceElements.forEach(span => {
                if (span.textContent === "edit" || span.textContent === "citation needed")
                    return;
                if (!span.title.includes('(')) {
                    const category = span.title;
                    if (!sources[category]) {
                        sources[category] = [];
                        sources[category].push(span.textContent);
                    }
                }
                else {
                    const episode = span.title;
                    const parentContent = span.title.match(/\(([^)]+)\)/);
                    const categoryAbbreviation = parentContent[1].split(' ')[0];
                    Object.entries(sources).forEach(([category, episodes]) => {
                        if (episodes[0] === categoryAbbreviation) {
                            if (!episodes.includes(episode)) {
                                episodes.push(episode);
                            }
                        }
                    })
                }
            });
        })
        return sources;
    }
    return [];
}
