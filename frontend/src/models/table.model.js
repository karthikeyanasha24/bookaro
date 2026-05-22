import { Link } from "react-router-dom"
import datepipeModel from "./datepipemodel"
import rolesModel from "./roles.model"

const list = [
    { key: 'fullName', value: 'Name', pipe: '',className:'text-capitalize',
    html:(p)=>{
        return <Link to={'/userDetail/'+p.id}>{p.fullName}</Link>
    } 
    },
    { key: 'mobileNo', value: 'Phone Number', pipe: 'mobile', codeKey: 'dialCode' },
    { key: 'email', value: 'Email', pipe: '', className: '' },
    { key: 'role', value: 'Role', pipe: 'role', className: '' },
    { key: 'createdAt', value: 'Created At', pipe: 'dateNtime' },
    { key: 'address', value: 'Address', pipe: '' },
]

const category=[
    { key: 'name', value: 'Name', pipe: '' },
    { key: 'catType', value: 'Type',pipe:'' },
    { key: 'createdAt', value: 'Created At', pipe: 'dateNtime' },
    // { key: 'description', value: 'Description',pipe:'' },
]

const relellerCategory=[
    { key: 'name', value: 'Name', pipe: '' },
    { key: 'createdAt', value: 'Created At', pipe: 'dateNtime' },
    // { key: 'description', value: 'Description',pipe:'' },
]

const Continents=[
    {key:"name",value:'Name',pipe:''},
    {key:"createdAt",date:"Created At",pipe:'dateNtime'}
]

const Country=[
 {key:'name',value:'Name',pipe:''},
 {key:"continent",value:'Continent',pipe:''},
 {key:"currency",value:'Currency',pipe:''},
 {key:'productCount',value:'productCount',pipe:''},
 {key:'createdAt',value:'Created At',pipe:'dateNtime'}
]

const find = (key,table='list') => {
    let value = [table].find(itm => itm.id == key)
    return value
}

const colView = (col, item) => {
    let value = item[col.key]
    let html=''
    if(col.html) html=col.html(item)

    if (col.includes && value) {
        col.includes.map(itm => {
            value = value[itm]
        })
    }

    if (col.pipe == 'date') {
        value = value ? `${datepipeModel.date(value)}` : ''
    }

    if (col.pipe == 'role') {
        value = value ? `${rolesModel.find(value)?rolesModel.find(value).name:value}` : ''
    }

    else if (col.pipe == 'dateNtime') {
        value = value ? `${datepipeModel.date(value)} | ${datepipeModel.time(value)}` : ''
    }
    else if (col.pipe == 'mobile') {
        value = value ? `${item[col && col.codeKey]} ${value}` : ''
    }
    return html?html:value
}

const userTableModel = { list,category,relellerCategory,Continents,Country, find, colView }
export default userTableModel