import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import ApiClient from "../../methods/api/apiClient";
import { firebaseApp } from "./firebase";

export const requestForToken = async () => {
  try {
    const messaging = getMessaging(firebaseApp);
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const currentToken = await getToken(messaging, {
      // vapidKey: 'BKDvw1GVNCvBOZ7kfhS040suFajcCADy5tHFZGQWkj_yVVl3OTsGaIXGJ2ufdNDPDidemlISqJ9xWwtEH53qZ58',
      vapidKey: 'BCWn5kn3hqhwpJ4Drbkk96Y3L9a3SfJYORx07OU-0zXhtY_Z8ZiOaVFuuIsx8Xzju8BnHF2mqVTRfnT6o22tE7E',
      serviceWorkerRegistration: swRegistration,
    });
    if (currentToken) {
      return currentToken
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
  }
};

// export const message = (navigate) => {
//   let messaging = getMessaging(firebaseApp)
//   return onMessage(messaging, (payload) => {
//     console.log("onMessage payload- ", payload)
//     const title = payload?.notification?.body;
//     const route = payload?.data?.route || "/";
//     toast.success(title, {
//       onClick: function () {
//         debugger
//         navigate(route)
//       }
//     })
//     document.getElementById('unreadnoti')?.click()
//   })
// };

export const notificationListener = (navigate, setNotLength) => {
  const messaging = getMessaging(firebaseApp);
  onMessage(messaging, (payload) => {
    console.log("Firebase Message received: ", payload);
    let msg = payload?.notification?.body;
    let data = payload?.data;
    toast.success(msg, {
      onClick: () => {
        debugger
        if (data?.notification_type === "property") {
          navigate(`/property-details?id=${data?.property_id}`)
          if (payload?.notification?.notficationId) {
            const dto = { status: "read", ids: [payload?.notification?.notficationId] }
            ApiClient.put("notification/change-status-multiple", dto)
            setNotLength(prev => +prev - 1)
          }
        }
      },
    });
    setNotLength(prev => +prev + 1);
  },err=>{
    console.log("err",err)
  });
};
