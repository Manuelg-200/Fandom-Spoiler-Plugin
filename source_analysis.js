mwContentText = document.getElementById("mw-content-text");
if (mwContentText) {
    const sourcesList = [];
    const sourceElements = mwContentText.querySelectorAll('a[href^="wiki/"]');
    sourceElements.forEach(a => {
        sourcesList.push(a.href);
    });
}