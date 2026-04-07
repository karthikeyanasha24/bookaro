const loader = (p) => {
    if (p) {
        document.getElementById('loader').classList.remove('d-none');
    } else {
        document.getElementById('loader').classList.add('d-none');
    }
}

export default loader;