const list = [
    { id: 'Rezdy', name: 'Rezdy' },
    { id: 'FareHarbour', name: 'FareHarbour' },
    { id: 'IBIS', name: 'IBIS' },
    { id: 'Checkfront', name: 'Checkfront' },
]

const find = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext?ext.name:key
}

const bookingSystemModel = { list, find,name }
export default bookingSystemModel