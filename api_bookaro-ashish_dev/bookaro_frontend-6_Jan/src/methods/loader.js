const loader = (p) => {
    const el = document.getElementById("loader");
    if (!el) return;
    if (p) {
        el.classList.remove("d-none");
    } else {
        el.classList.add("d-none");
    }
};

export default loader;