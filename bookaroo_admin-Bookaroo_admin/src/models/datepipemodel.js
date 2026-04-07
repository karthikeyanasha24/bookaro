const monthArray = [
    { value: 'Jan',name:'January', id: 0 },
    { value: 'Feb',name:'February', id: 1 },
    { value: 'Mar',name:'March', id: 2 },
    { value: 'Apr',name:'April', id: 3 },
    { value: 'May',name:'May', id: 4 },
    { value: 'Jun',name:'Jun', id: 5 },
    { value: 'Jul',name:'July', id: 6 },
    { value: 'Aug',name:'Auguest', id: 7 },
    { value: 'Sep',name:'September', id: 8 },
    { value: 'Oct',name:'October', id: 9 },
    { value: 'Nov',name:'November', id: 10 },
    { value: 'Dec',name:'December', id: 11 }
]

const monthname = (id) => {
    let ext = monthArray.find(itm => itm.id === id)
    return ext?ext?.name:'--'
}

const monthfind = (id) => {
    let value = 0
    let ext = monthArray.find(itm => itm.id === id)
    if (ext) value = ext.value
    return value
}

const getWeekDate = (date = new Date(), week = 1) => {
    let d = new Date(date)
    let month = d.getMonth()
    month = String(month + 1)

    let value = 1
    if (week == 1) value = 1
    else if (week > 1) value = 7 * (week - 1)
    if (value > 30) value = 30

    return new Date(`${d.getFullYear()}-${month}-${value}`)
}

const date = (p) => {
    if(!p) return '--'
    if(p.includes('T')) p=p.split('T')[0]
    let d = new Date(p)
    return `${d.getDate()} ${monthfind(d.getMonth())} ${d.getFullYear()}`
}

const stringToDate=(p)=>{
    let d=''
    if(p){
        d=new Date(p)
    }
    return d
}

const daysArray = [
    { value: 'Monday', id: 1 },
    { value: 'Tuesday', id: 2 },
    { value: 'Wednesday', id: 3 },
    { value: 'Thursday', id: 4 },
    { value: 'Friday', id: 5 },
    { value: 'Saturday', id: 6 },
    { value: 'Sunday', id: 0 },
]

const getDayName = (id) => {
    let value = daysArray.find((itm) => itm.id === id).value
    return value;
}

const day = (p) => {
    if (!p) return ''
    let day = new Date(p).getDay()
    day = getDayName(day)
    return day
}

const time = (p) => {
    if (!p) return ''
    let v = p.split('T')
    if (v.length === 2) {
        return new Date(p).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    } else {
        return new Date(`2020-07-19 ${p}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
}

const datetime = (p) => {
    if(!p) return ''
    return `${date(p)}, ${time(isototime(p))}`
}

const timeString = (p) => {
    let date = new Date(p)
    let hr = String(date.getHours())
    let minutes = String(date.getMinutes())
    if (hr.length === 1) hr = `0${hr}`
    if (minutes.length === 1) minutes = `0${minutes}`
    return `${hr}:${minutes}:00`
}

const datetostring = (p) => {
    if (!p) return ''
    let date = new Date(p)
    let month = String(date.getMonth() + 1)
    let d = String(date.getDate())
    if (month.length === 1) month = `0${month}`
    if (d.length === 1) d = `0${d}`
    return `${date.getFullYear()}-${month}-${d}`
}

const datetoIso = (p) => {
    if (!p) return ''
    let date = datetostring(p)

    let value = `${date}T00:00:00.000Z`
    return value
}

const datetoIsotime = (p) => {
    let date = datetostring(p)
    let time = timeString(p)
    let value = `${date}T${time}.000Z`
    return value
}

const isototime = (p) => {
    if (!p) return ''
    let value = p.split('T')[1].split('.')
    // if (value.length === 2) {
    // } else {
    //     value = p.split('T')[1].split('+')
    // }
    return value[0]
}

const isotime = (p) => {
    return time(isototime(p))
}

const isotodate = (p) => {
    let d = new Date(`${datetostring(p)} ${isototime(p)}`)
    return d
}

const datetodatepicker = (p) => {
    if(!p) return ''
    let value=p?.split('.')?.[0]
    return `${value}`
}

const DaysNo = (s, e) => {
    // JavaScript program to illustrate 
    // calculation of no. of days between two date 

    // To set two dates to two variables
    var date1 = new Date(s);
    var date2 = new Date(e);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days + 1
}

function getHoursAndMinutes(s, e) {
    let startDate=new Date(s)
    let endDate=new Date(e)
    // Convert dates to timestamps
    var startTimestamp = startDate.getTime();
    var endTimestamp = endDate.getTime();

    // Calculate the difference in milliseconds
    var difference = Math.abs(endTimestamp - startTimestamp);

    // Convert milliseconds to hours and minutes
    var hours = Math.floor(difference / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    let value=''
    if(hours>24){
        let days=hours/24
        days=Math.round(days)
        value=`${days} days`
    }else if(hours){
        value=`${hours} hours ${minutes?`and ${minutes} minutes`:''}`
    }else{
        value=`${minutes?`${minutes} minutes`:''}`
    }

    return value;
}
function getHoursAndMinutesSeconds(s, e) {
    let startDate = new Date(s);
    let endDate = new Date(e);
    // Convert dates to timestamps
    var startTimestamp = startDate.getTime();
    var endTimestamp = endDate.getTime();

    // Calculate the difference in milliseconds
    var difference = Math.abs(endTimestamp - startTimestamp);

    // Convert milliseconds to hours, minutes, and seconds
    var hours = Math.floor(difference / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);

    let value = '';
    if (hours > 24) {
        let days = hours / 24;
        days = Math.round(days);
        value = `${days} days`;
    } else if (hours) {
        value = `${hours} hours ${minutes ? `and ${minutes} minutes` : ''}`;
    } else if (minutes) {
        value = `${minutes} minutes ${seconds ? `and ${seconds} seconds` : ''}`;
    } else {
        value = `${seconds} seconds`;
    }

    return value;
}


const datepipeModel = {
    DaysNo,
    date,
    getHoursAndMinutes,
    getHoursAndMinutesSeconds,
    stringToDate,
    day,
    datetostring,
    datetoIso,
    isototime,
    isotodate,
    isotime,
    datetoIsotime,
    time,
    timeString,
    datetime,
    monthfind,
    getWeekDate,
    monthname,
    monthArray,
    datetodatepicker
}

export default datepipeModel;
