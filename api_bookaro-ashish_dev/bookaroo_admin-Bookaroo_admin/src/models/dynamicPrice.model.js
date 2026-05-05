const list = [
    { id: 'publicHoliday', name: 'Public Holiday', icon: 'public' },
    { id: 'schoolHoliday', name: 'School Holiday', icon: 'school' },
    { id: 'events', name: 'Event', icon: 'event' },
    { id: 'earlyBirdCustomDates', name: 'Early Bird Pricing Custom Dates', icon: 'today' },
    { id: 'earlybirdtimeframes', name: 'Early Bird Pricing Time Frames', icon: 'timelapse' },
    { id: 'earlybirdinventory', name: 'Early Bird Pricing Inventory', icon: 'inventory' },
    { id: 'lastminutefixeddates', name: 'Last Minute Pricing Fixed Dates', icon: 'fixed' },
    { id: 'lastminuteinventory', name: 'Last Minute Pricing Inventory Discounting', icon: 'inventory' },
  ]

const find = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext
}

const name = (key) => {
    let ext = list.find(itm=>itm.id == key)
    return ext?ext.name:key
}

const dynamicPriceModel = { list, find,name }
export default dynamicPriceModel