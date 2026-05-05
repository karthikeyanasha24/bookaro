const list = [
    { id: 'assistant', name: 'Assistant Group Leader' },
        { id: 'meetManager', name: 'Connect Meet Manager' },
    {id:'member',name:'Member'},
]

const find = (id) => {
    let ext = list.find(itm=>itm.id == id)
    return ext
}

const name = (id) => {
    let ext = list.find(itm=>itm.id == id)
    return ext?ext.name:id
}

const rolesModel = { list, find,name }
export default rolesModel