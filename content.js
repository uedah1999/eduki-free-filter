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

const observer = new MutationObserver(filterPaidItems);
observer.observe(document.body, { childList: true, subtree: true });