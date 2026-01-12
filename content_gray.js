const TARGET_FREE_ITEMS = 5;
let loadingMore = false;
let done = false;

function getItems() {
    return Array.from(document.querySelectorAll("div.list-item-wrapper"));
}

function isFree(item) {
    const price = item.querySelector("span.price-block");
    return price && price.innerText.trim().toLowerCase() === "kostenlos";
}

function filterPaidItems() {
    getItems().forEach((item) => {
        if (!isFree(item)) {
            item.style.setProperty("display", "none", "important");
            item.setAttribute("data-hidden-by-extension", "true");
        }
    });
}

function countFreeVisible() {
    return getItems().filter(
        item => isFree(item) && item.style.display !== 'none'
    ).length;
}

function tryLoadMore() {
    if (loadingMore || done) return;

    const freeCount = countFreeVisible();
    if (freeCount >= TARGET_FREE_ITEMS) {
        done = true;
        observer.disconnect();
        console.log('Target reached.');
        return;
    }

    const btn = document.querySelector('button.custom-button.yellow.sty');
    if (!btn) {
        done = true;
        observer.disconnect();
        console.log('No more results.');
        return;
    }

    loadingMore = true;
    btn.click();

    // prevent rapid clicking
    setTimeout(() => {
        loadingMore = false;
    }, 1200);
}

const observer = new MutationObserver(() => {
    if (done) return;
    filterPaidItems();
    tryLoadMore();
});

// Start observing once container exists
const startObserver = setInterval(() => {
    if (getItems().length > 0) {
        clearInterval(startObserver);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        filterPaidItems();
        tryLoadMore();
    }
}, 500);