function currency(num, c = '', cf = ',') {
   // let currency=c
   let currency = ''
   let value = '0'
   if (num) {
      value = Number(num).toFixed(2)
      if (value.split('.')[1] == '00') {
         value = value.split('.')[0]
      }
      if (cf == ',') {
         value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      } else if (cf == '.') {
         value = value.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      } else {
         value = value.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
      }
   }

   return currency ? `${value} ${currency}` : `$${value}  `
}

 function number(num,nofloat=false) {
    let value=''
    if(num){
      value=Number(num).toFixed(2)
      if(value.split('.')[1]=='00'){
         value=value.split('.')[0]
      }
      value=String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (value||'0')
 }

function inputCurreny(num, nofloat = false) {
   if (!num || isNaN(num)) return '0';

   let value = Number(num);
   if (!nofloat) value = value.toFixed(2);

   const parts = String(value).split('.');
   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

   return nofloat || parts[1] === '00' ? parts[0] : parts.join('.');
}


function NoFloatnumber(num, nofloat = false) {
   let value = ''
   if (num) {
      if (nofloat == false) {
         value = String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      } else {
         value = Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
   }

   return value || '0'
}

const capitalizeFirstLetter = (str) => {
   return str.charAt(0).toUpperCase() + str.slice(1);
}

const pipeModel = { currency, number, inputCurreny,capitalizeFirstLetter, NoFloatnumber }
export default pipeModel