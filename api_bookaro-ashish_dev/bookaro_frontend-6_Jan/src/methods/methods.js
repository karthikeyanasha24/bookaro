import environment from "../environment";

const isTranslatePage = () => {
  let value = false;
  let url = window.location.href;
  if (url.includes("translation")) value = true;
  return value;
};

const generatekeysArr = (arr, key = "typeofresult") => {
  let keys = {};
  if (!arr) return { keys, arr: [] };
  arr.map((itm) => {
    if (keys[itm[key]]) {
      keys[itm[key]].push(itm);
    } else {
      keys[itm[key]] = [itm];
    }
  });
  return {
    keys,
    arr: Object.keys(keys).map((itm) => {
      return { key: itm, value: keys[itm] };
    }),
  };
};

const userImg = (img,modal='img') => {
  let value = "/assets/img/person.jpg";
  // if (img) value = environment.api + 'img/' + img
  if (img) value = `${environment.api}/img/${img}`;
  return value;
};

const noImg = (img, modal = "img") => {
  let  value = "/assets/img/placeholder.png";
  if (img) value = `${environment.api}img/${img}`;
  if(img =="User must be deleted")
  {
    value = "/assets/img/placeholder.png";
  }
  return value;
};

const video = (video,modal='videos') => {
  let value = "";
  if (video) value = `${environment.api}/videos/${video}`;
  return value;
};

const docAsset = (img, modal = "img") => {
  let value = "/assets/img/placeholder.png";
  // if (img) value = environment.api + 'img/' + img
  if (img) value = `${environment.api}document/${img}`;
  return value;
};

const getPrams = (p) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(p)||'';
};

const isNumber = (e) => {
  let key = e.target;
  let maxlength = key.maxLength ? key.maxLength : 1;

  let max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;

  if (key.value.length > maxlength&&maxlength>0) key.value = key.value.slice(0, maxlength);
  key.value = key.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

const isRatio = (e) => {
  let key = e.target;
  let maxlength = key.maxLength ? key.maxLength : 1;

  let max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;

  if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
  key.value = key.value.replace(/[^0-9.>]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

const find = (arr, value, key = "key") => {
  let ext = arr?.find((itm) => itm[key] == value);
  return ext;
};

/* ###################### Form Methods #########################  */

// get Single field error
const getError = (key, fvalue, formValidation) => {
  let ext = find(formValidation, key);
  let res = matchError(ext, fvalue);
  return res;
};

const emailRequiredFor = (role) => {
  let value = false;
  if (
    role == "Clinic Admin" ||
    role == "Counsellor" ||
    role == "Owner" ||
    role == "admin"
  )
    value = true;
  return value;
};

const validateUsername = (val) => {
  return /^(?=[a-zA-Z0-9._-]{8,20}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/.test(val);
};

const dialMatch = (val) => {
  let value = false;
  value = val.match(/^(?=.*[0-9])(?=.*[+])[0-9+]{2,5}$/);
  return value;
};
const emailvalidation = (val) => {
  if (
    val.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return true;
  }
  // if(!val.includes(".")){
  //     return false
  // }
  return false;
};

const urlValidation = (val) => {
  if (
    val.match(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    )
  ) {
    return true;
  }
  // if(!val.includes(".")){
  //     return false
  // }
  return false;
};
// match errors for fields
const matchError = (ext, fValue) => {
  let invalid = false;
  let kValue = fValue[ext.key];
  let value = {
    minLength: false,
    maxLength: false,
    confirmMatch: false,
    required: false,
  };
  let message = "";
  if (ext.required) {
    if (!kValue || (!kValue.length && typeof kValue != "object")) {
      invalid = true;
      message = ext?.message || "This is Required";
    }
  }
  if (ext.minLength && kValue) {
    if (kValue.length < ext.minLength) {
      value.minLength = true;
      message = ext?.message || `Min Length is ${ext.minLength}`;
    }
  }
  if (ext.email && kValue) {
    if (!emailvalidation(kValue)) {
      value.email = true;
      message = ext?.message || `Email is invalid`;
    }
  }
  if (ext.maxLength && kValue) {
    if (kValue.length > ext.maxLength) {
      value.maxLength = true;
      message = ext?.message || `Max Length is ${ext.maxLength}`;
    }
  }
  if (ext.dialCode && kValue) {
    if (dialMatch(kValue)) {
      kValue.indexOf("+");
      if (kValue.indexOf("+") != 0) {
        value.dialCode = true;
        message = ext?.message || `DialCode is Invalid`;
      }
    } else {
      value.dialCode = true;
      message = ext?.message || `DialCode is Invalid`;
    }
  }

  if (ext.username && kValue) {
    if (!validateUsername(kValue)) value.username = true;
  }

  if (ext.confirmMatch && kValue) {
    if (fValue[ext.confirmMatch[0]] != fValue[ext.confirmMatch[1]]) {
      value.confirmMatch = true;
      message = ext?.message || `Confirm Password is not matched`;
    }
  }

  let vArr = Object.keys(value);
  vArr.map((itm) => {
    if (value[itm]) invalid = true;
  });

  let res = { invalid: invalid, err: value, message };
  return res;
};

// get form error (All Fields)
const getFormError = (formValidation, fvalue) => {
  let invalid = false;
  formValidation.map((ext) => {
    if (matchError(ext, fvalue).invalid) {
      // console.log("getFormError", ext);
      invalid = true;
    }
  });

  return invalid;
};

/* ###################### Form Methods end #########################  */

const route = (route) => {
  localStorage.setItem("route", route);
  // let el = document.getElementById("routerDiv");
  setTimeout(() => {
    // if (el) el.click();
  });
};

const flagIcon = (icon = "", width = 50) => {
  const imageErr = (e) => {
    e.target.src = "/assets/img/placeholder.png";
  };
  return (
    <>
      <img
        src={`https://flagsapi.com/${icon?.toUpperCase()}/flat/64.png`}
        width={width}
        onError={imageErr}
      />
    </>
  );
};

function containsSpaceonly(text) {
  return /\s/.test(text);
}

const msToTime = (milliseconds, ago = true) => {
  //get hours from milliseconds
  var hours = milliseconds / (1000 * 60 * 60);
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours;
  //get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteminutes = Math.floor(minutes);
  var m = absoluteminutes;

  //get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteminutes) * 60;
  var absoluteseconds = Math.floor(seconds);
  var s = absoluteseconds;

  var time = "";
  if (h > 0) {
    time += `${h}h`;
  }
  if (m > 0) {
    time += ` ${m}m`;
  }

  if (ago) {
    if (h == 0 && m == 0) {
      time += `a few seconds`;
    }
    time += " ago";
  }
  return time;
};

const methodModel = {
  userImg,
  video,
  route,
  flagIcon,
  isNumber,
  isRatio,
  find,
  getError,
  getFormError,
  getPrams,
  emailRequiredFor,
  emailvalidation,
  noImg,
  isTranslatePage,
  generatekeysArr,
  containsSpaceonly,
  msToTime,
  urlValidation,
  document: docAsset
};
export default methodModel;

