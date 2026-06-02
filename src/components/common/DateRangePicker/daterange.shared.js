import datepipeModel from "../../../models/datepipemodel"


export const rangeList = [
    { id: 'Today', name: "Today" },
    { id: 'Yesterday', name: "Yesterday" },
    { id: 'This Week', name: "This Week" },
    { id: 'Last Week', name: "Last Week" },
    { id: 'This Month', name: "This Month" },
    { id: 'Last Month', name: "Last Month" },
    { id: 'This Year', name: "This Year" },
    { id: 'Last Year', name: "Last Year" },
    // { id: 'Last Sunday', name: "Last Sunday" },
    // { id: 'Last 2 Year', name: "Last 2 Year" },
    // { id: 'Last 3 Year', name: "Last 3 Year" },
    // { id: 'Last 4 Year', name: "Last 4 Year" },
    // { id: 'Last 5 Year', name: "Last 5 Year" }
]

export const getRange = (e) => {
    let startDate = ''
    let endDate = ''
    let range = ''

    if (e == 'Today' || e == 'today') {
        range = 'Today'
        let current = new Date()
        startDate = datepipeModel.datetostring(current)
        endDate = startDate
    }

    if (e == 'Yesterday' || e == 'yesterday') {
        range = 'Yesterday'
        let current = new Date()
        let yesterday = new Date()
        yesterday.setDate(current.getDate() - 1)
        startDate = datepipeModel.datetostring(yesterday)
        endDate = startDate
    }

    if (e == 'Last Month' || e == 'last_month') {
        range = 'Last Month'
        let current = new Date()
        let monthdate = current.setDate(0)
        monthdate = datepipeModel.datetostring(monthdate)
        startDate = `${monthdate.split('-')[0]}-${monthdate.split('-')[1]}-01`
        endDate = monthdate
    }
    else if (e == 'This Month' || e == 'Month' || e == 'this_month') {
        range = 'This Month'
        let current = datepipeModel.datetostring(new Date())
        startDate = `${current.split('-')[0]}-${current.split('-')[1]}-01`
        let month2 = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        endDate = datepipeModel.datetostring(month2)
    }
    else if (e == 'This Year' || e == 'this_year') {
        range = 'This Year'
        let current = datepipeModel.datetostring(new Date())
        startDate = `${current.split('-')[0]}-01-01`
        let month2 = new Date(new Date().getFullYear() + 1, 0, 0)
        endDate = datepipeModel.datetostring(month2)
    }
    else if (e == 'Last Year' || e == 'last_year') {
        range = 'Last Year'
        let current = new Date()
        startDate = `${current.getFullYear() - 1}-01-01`
        let month2 = new Date(current.getFullYear(), 0, 0)
        endDate = datepipeModel.datetostring(month2)
    }
    else if (e == 'Last 2 Year' || e == 'Last 2 Year') {
        range = 'Last 2 Year'
        let current = new Date()
        startDate = `${current.getFullYear() - 1}-01-01`
        let month2 = new Date(current.getFullYear() + 1, 0, 0)
        endDate = datepipeModel.datetostring(month2)
    }
    else if (e == 'Last 3 Year' || e == 'Last 3 Year') {
        range = 'Last 3 Year'
        let current = new Date()
        startDate = `${current.getFullYear() - 2}-01-01`
        let month2 = new Date(current.getFullYear() +1, 0, 0)
        endDate = datepipeModel.datetostring(month2)
    }
    else if (e == 'Last 4 Year' || e == 'Last 4 Year') {
        range = 'Last 4 Year'
        let current = new Date()
        startDate = `${current.getFullYear() - 3}-01-01`
        let month2 = new Date(current.getFullYear() + 1, 0, 0)
        endDate = datepipeModel.datetostring(month2)
    }
    else if (e == 'Last 5 Year' || e == 'Last 5 Year') {
        range = 'Last 5 Year'
        let current = new Date()
        startDate = `${current.getFullYear() - 4}-01-01`
        let month2 = new Date(current.getFullYear() + 1, 0, 0)
        endDate = datepipeModel.datetostring(month2)
    }
    else if (e == 'Last Week' || e == 'last_week') {
        range = 'Last Week'
        let current = new Date()
        let day = current.getDay()
        let diff = (day === 0 ? 7 : day) + 6 // Go back to previous Sunday and then one more week back
        let lastWeekStart = new Date(current)
        lastWeekStart.setDate(current.getDate() - diff)
        let lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
        startDate = datepipeModel.datetostring(lastWeekStart)
        endDate = datepipeModel.datetostring(lastWeekEnd)
    }
    else if (e == 'This Week' || e == 'Week' || e == 'this_week') {
        range = 'This Week'
        let current = new Date()
        let day = current.getDay()
        let thisWeekStart = new Date(current)
        thisWeekStart.setDate(current.getDate() - (day === 0 ? 6 : day - 1)) // Monday as the start of the week
        let thisWeekEnd = new Date(thisWeekStart)
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6)
        startDate = datepipeModel.datetostring(thisWeekStart)
        endDate = datepipeModel.datetostring(thisWeekEnd)
    }else if (e == 'Last Sunday'||e=='last_sunday') {
        range='Last Sunday'
       let current = new Date()
    //    let monthdate = current.setDate(0)
    //    monthdate = datepipeModel.datetostring(monthdate)
       startDate = datepipeModel.getLastSunday()
       endDate = datepipeModel.getLastSunday()
   } 

    return {
        startDate, endDate, range: range
    }
}




const getDays = (s, e) => {
    // Define two date objects
    const startDate = new Date(s); // Replace with your start date
    const endDate = new Date(e);   // Replace with your end date
    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;
    // Convert milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference
}

const previousYear = (value) => {
    let start = ''
    let end = ''
    if (value.startDate && value.endDate) {
        let ssplit = value.startDate.split('-')
        let esplit = value.endDate.split('-')
        let year = Number(ssplit[0])
        let eyear = Number(esplit[0])

        let d = new Date(`${year - 1}-${ssplit[1]}-${ssplit[2]}`)
        start = datepipeModel.datetostring(d)

        let ed = new Date(`${eyear - 1}-${esplit[1]}-${esplit[2]}`)
        end = datepipeModel.datetostring(ed)
    }
    return { start, end }
}

const previousMonth = (value) => {
    let start = ''
    let end = ''
    if (value.startDate && value.endDate) {
        let current = new Date(value.startDate)
        let monthdate = current.setDate(0)
        monthdate = datepipeModel.datetostring(monthdate)
        start = `${monthdate.split('-')[0]}-${monthdate.split('-')[1]}-01`
        end = monthdate
    }
    return { start, end }
}

const previousPeriod = (value) => {
    let start = ''
    let end = ''
    if (value.startDate && value.endDate) {
        let days = getDays(value.startDate, value.endDate) + 1

        let d = new Date(value.startDate)
        d.setDate(d.getDate() - days)
        start = datepipeModel.datetostring(d)

        let ed = new Date(value.startDate)
        ed.setDate(ed.getDate() - 1)
        end = datepipeModel.datetostring(ed)
    }
    return { start, end }
}



export const getCompareRange = (e, value) => {
    let start = ''
    let end = ''
    if (e == 'Previous Period') {
        start = previousPeriod(value).start
        end = previousPeriod(value).end
    } else if (e == 'Previous Year') {
        start = previousYear(value).start
        end = previousYear(value).end
    } else if (e == 'Previous Month') {
        start = previousMonth(value).start
        end = previousMonth(value).end
    }


    return {
        compareStart: start,
        compareEnd: end,
        compare: e
    }
}
