const isNumber = (e) => {
    let key = e.target;
    let maxlength = key.maxLength ? key.maxLength : 1;

    let max = Number(key.max ? key.max : key.value);
    if (Number(key.value) > max) key.value = max;

    // let min = key.min;
    // if (min && Number(key.value)<Number(min)) key.value = min;

    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
    key.value = key.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

    return key.value
}

const dialMatch = (val) => {
    let value = false
    value = val.match(/^(?=.*[0-9])(?=.*[+])[0-9+]{2,5}$/)
    return value
}

// get Single field error
const getError = (formname='profileForm',key) => {
    let res = matchError(formname, key)
    return res
}

const getAttribute=(formname,key,attribute)=>{
    let field=document.forms[formname].elements[key]
    if(!field){
        console.error("getAttribute err",key)
        console.error("getAttribute err",attribute)
        return ''
    } 
    return field[attribute]?field[attribute]:field?.getAttribute(attribute)
}



const emailvalidation = (val) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
        return true
    }
    return false
}
// match errors for fields
const matchError = (formname, key) => {
    
    let invalid = false
    let kValue = getAttribute(formname,key,'value')
    let value = { minLength: false, maxLength: false, confirmMatch: false ,required:false}
    if (getAttribute(formname,key,'required')) {
        if (!kValue || !kValue?.length){
            value.required = true
        }
    }
    if (getAttribute(formname,key,'minLength')>-1 && kValue) {
        if (kValue.length < Number(getAttribute(formname,key,'minLength'))) value.minLength = true
    }
    if (getAttribute(formname,key,'maxLength')>-1 && kValue) {
        if (kValue.length > Number(getAttribute(formname,key,'maxLength'))) value.maxLength = true
    }
    if (getAttribute(formname,key,'dialCode') && kValue) {
        if (dialMatch(kValue)) {
            kValue.indexOf("+");
            if (kValue.indexOf("+") != 0) {
                value.dialCode = true
            }

        } else {
            value.dialCode = true
        }
    }

    if (getAttribute(formname,key,'confirmMatch') && kValue) {
        let confirmMatch=JSON.parse(getAttribute(formname,key,'confirmMatch'))
        if (getAttribute(formname,confirmMatch[0],'value') != getAttribute(formname,confirmMatch[1],'value')) value.confirmMatch = true
    }

    let vArr = Object.keys(value)
    vArr.map(itm => {
        if (value[itm]) invalid = true
    })

    let res = { invalid: invalid, err: value }
    return res
}

// get form error (All Fields)
const getFormError = (formname='profileForm') => {
    let invalid = false
    let fields=document.forms[formname].elements

    for(let i=0;i<fields.length;i++){
        if(fields[i].getAttribute('name')){
            let err=matchError(formname,fields[i].getAttribute('name'))
            if(err.invalid) invalid=true
        }
    }

    return invalid
}

const formModel = {getFormError,getError,isNumber }
export default formModel