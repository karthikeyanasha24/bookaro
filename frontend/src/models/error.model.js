import { ToastsStore } from 'react-toasts';

export const handleError = (err, hideError) => {
    let message = ''
    if (err) {
        if (err && err.error && err.error.code == 401) {
            localStorage.clear()
            window.location.assign("/");
        }
        message = err && err.error && err.error.message
        if (!message) message = err.message
        if (!message) message = 'Server Error'
    }
    if (!hideError) ToastsStore.error(message);
}