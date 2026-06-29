const permissions = {
    prodMgmtRead:false,
    prodMgmtEdit:false,
    prodMgmtDelete:false,
    prodMgmtAdd:false,
    userMgmtRead:false,
    userMgmtDelete:false,
    userMgmtEdit:false,
    userMgmtAdd:false,
}

const roleUrl=[
    {
      url:'dashboard',
      key:'readDashboard',
    },
    {
      url:'roles',
      key:'readRole'
    },
    {
      url:'users',
      key:'readAdmins'
    },
    {
      url:'types',
      key:'readTypes'
    },
    {
      url:'categories',
      key:'readCategory'
    },
    {
      url:'category',
      key:'readResellerCategory'
    },
    {
      url:'features',
      key:'readPlanFeatures'
    },
    {
      url:'plans',
      key:'readPlan'
    },
    {
      url:'coupon',
      key:'readCoupons'
    },
    {
      url:'currency',
      key:'readCurrency'
    },
    {
      url:'bookingSystem',
      key:'readBooking'
    },
    {
      url:'continents',
      key:'readContinents'
    },
    {
      url:'countries',
      key:'readCountries'
    },
    {
      url:'regions',
      key:'readRegion'
    },
    {
      url:'cities',
      key:'readCities'
    },
    {
      url:'emailtemplate',
      key:'readEmailTemplate'
    },
  ]

  const urlAllow=(permissions,u='')=>{
    let url=u?u:window.location.href
    let value=true
    let ext=roleUrl.find(itm=>url.includes(itm.url))
    if(ext) value=permissions?.[ext.key]
    return value
  }

const permissionModel = { permissions,urlAllow }

export default permissionModel