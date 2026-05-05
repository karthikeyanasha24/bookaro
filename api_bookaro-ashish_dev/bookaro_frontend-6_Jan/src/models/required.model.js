const list = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
]

const find = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext?ext.name:key
}

const requiredModel = { list, find,name }
export default requiredModel