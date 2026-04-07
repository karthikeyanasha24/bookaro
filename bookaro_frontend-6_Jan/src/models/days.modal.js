const list = [
    { id: '1', name: '1 day' },
    { id: '2', name: '2 days' },
    { id: '3', name: '3 days' },
    { id: '4', name: '4 days' },
    { id: '5', name: '5 days' },
    { id: '6', name: '6 days' },
    { id: '7', name: '7 days' },
    { id: '8', name: '8 days' },
    { id: '9', name: '9 days' },
    { id: '10', name: '10 days' },
    { id: '11', name: '11 days' },
    { id: '12', name: '12 days' },
    { id: '13', name: '13 days' },
    { id: '14', name: '14 days' },
    { id: '15', name: '15 days' },
    { id: '16', name: '16 days' },
    { id: '17', name: '17 days' },
    { id: '18', name: '18 days' },
    { id: '19', name: '19 days' },
    { id: '20', name: '20 days' },
    { id: '21', name: '21 days' },
    { id: '22', name: '22 days' },
    { id: '23', name: '23 days' },
    { id: '24', name: '24 days' },
    { id: '25', name: '25 days' },
    { id: '26', name: '26 days' },
    { id: '27', name: '27 days' },
    { id: '28', name: '28 days' },
    { id: '29', name: '29 days' },
    { id: '30', name: '30 days' },
    { id: '31', name: '31 days' },
]

const find = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext?ext.name:key
}

const daysModel = { list, find,name }
export default daysModel