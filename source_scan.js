function sourceScan() {
    mwContentText = document.getElementById("mw-content-text");
    if (mwContentText) {
        const sourcesList = [];
        const p_elements = mwContentText.querySelectorAll('p');
        p_elements.forEach(p => {
            const sourceElements = p.querySelectorAll('a[href^="/wiki/"] > span');
            sourceElements.forEach(span => {
                sourcesList.push(span.title);
            });
        })        
        
        return sourcesList;
    }
    return [];
}
