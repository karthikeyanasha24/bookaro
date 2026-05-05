const list = []
let hr = 4
while (hr <= 72) {
    list.push({ hr, value: `${hr} hrs` })
    hr = hr + 4
}

const name = (id) => {
    return list.find(itm => itm.hr == id).value
}

const rescheduleTimeModel = { list, name }
export default rescheduleTimeModel