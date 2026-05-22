import ApiClient from "../methods/api/apiClient"

const list = [
    { key: 'Blog', name: 'Blog' },
    { key: 'Product', name: 'Product' },
    { key: 'FAQ', name: 'FAQ' },
    // { key: 'Plan', name: 'Plan' },
]

const find = (key) => {
    let ext = list.find(itm.key == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm.key == key)
    return ext?ext.name:key
}

const categoryType = { list, find,name }
export default categoryType