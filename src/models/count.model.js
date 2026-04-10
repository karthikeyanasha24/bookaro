const list = [
    { id: 'per', name: 'Percent' },
    { id: 'amount', name: 'Amount' },
]

const find = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext?ext.name:key
}

const countModel = { list, find,name }
export default countModel