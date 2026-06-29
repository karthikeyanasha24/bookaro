const list = [
    { id: 'now', name: 'Now' },
    { id: 'later', name: 'Later' }
]

const find = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext?ext.name:key
}

const NowLaterModel = { list, find,name }
export default NowLaterModel