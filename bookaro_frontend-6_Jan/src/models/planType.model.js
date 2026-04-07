const list = [
    { id: 'month', name: 'Monthly' },
    { id: 'year', name: 'Yearly' }
]

const find = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext?ext.name:key
}

const planTypeModel = { list, find,name }
export default planTypeModel