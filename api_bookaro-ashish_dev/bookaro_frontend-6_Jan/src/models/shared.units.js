export const socialOptions = ["Word of Mouth",
    "Drive By",
    "Internet Search",
    "Google Maps",
    "Facebook",
    "Instagram",
    "YouTube",
    "TikTok",
    "Yelp",
    "Shroom Locator",
    "Blog",
    "Flyer",
    "Event",
    "QR Code Sticker",
    "Guest Sign-In",
    "Club Programs",
    "Twitter",
    "Website",
    "Walk-In",
    "Friends & Family",
    "Google",
    "Apple Maps",
    "Other"
]
    .sort()
    .map(itm => ({ id: itm.toLowerCase(), name: itm }))

    export const joinReasons = [
        "Place to Consume",
        "Join Community",
        "Merchandise",
        "Social Events",
        "Education",
        "Work Space",
        "Biz Connections"
    ]
        .sort()
        .map(itm => ({ id: itm.toLowerCase(), name: itm }))

    

    export const memberhsipStatusList=[
        {id:'active',name:'Active'},
        {id:'on-hold',name:'On Hold'},
        {id:'cancelled',name:'Cancelled'},
        {id:'expired',name:'Expired'},
        {id:'dormant',name:'Dormant'},
        {id:'inactive',name:'Inactive'},
    ]

    

    export const customizationList=[
        "Peanuts and Tree Nuts",
        "Dairy-Free",
        "Gluten-Free",
        "Vegan",
        "Other",
    ].map(itm=>({name:itm,id:itm}))

    export const boxPreferenceList=[
        "Canna Discovery Box",
        "Canna Flower Only Box",
        "Canna Edible Only Box",
        "Shroom Discovery Box",
        "Dried Shrooms Only Box",
        "Treats Only Box",
        "Balance Discovery Box",
        "Balanced Flower & Dried Only Box",
        "Balance Treats Only Box"
    ].map(itm=>({name:itm,id:itm}))

    export const receivingMethodList=[
        // {id:"Local Pickup",name:'Local Pickup'},
        // {id:"Flat rate",name:'Shipping'},
        {id:"local_pickup",name:'Local Pickup'},
        {id:"shipping",name:'Shipping'},
    ]

    export const boxStatusList=[
        "Pending",
        "Picked up",
        "Labeled",
        "Mailed",
        "Delivered"
    ].map(itm=>({id:itm,name:itm}))


    export function getRandomCode(length=5) {
        const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += letters[Math.floor(Math.random() * letters.length)];
        }
        return code;
    }

    export function generateSlug(name='') {
        let slug=''
        if(name){
            slug=name.toLowerCase().replaceAll(' ','_').replaceAll('&','and').replaceAll('?','').replaceAll('#','')
        }
        return slug;
    }

    export const generateUniqueArr=(arr=[],key='id')=>{
        const uniqueArr = Array.from(
            new Set(arr.map((item) => item?.[key]))
          ).map((id) => {
            return arr.find((item) => item?.[key] === id);
          });

          return uniqueArr
    }