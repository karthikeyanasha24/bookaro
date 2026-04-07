const open = (id = '') => {
    document.getElementById('modalJS').setAttribute('modal', id)
    document.getElementById('modalJS').setAttribute('value', 'show')
    document.getElementById('modalJS').click()
}

const close = (id = '') => {
    document.getElementById('modalJS').setAttribute('modal', id)
    document.getElementById('modalJS').setAttribute('value', 'hide')
    document.getElementById('modalJS').click()
}

const modal = (id = '', modal = '') => {
    let value = false
    let mdata = modal ? modal : modalData()
    if (mdata.value === 'show' && mdata.id === id) value = true
    return value
}

const modalData = () => {
    let id = document.getElementById('modalJS').getAttribute('modal')
    let value = document.getElementById('modalJS').getAttribute('value')
    return { id, value }
}

const modalModel = { open, close, modalData, modal }
export default modalModel