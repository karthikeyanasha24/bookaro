const fs = require("fs");
const path = require("path");
const axios = require("axios");
const db = require("../models");
const { JWT } = require("google-auth-library");

const credPath = path.join(__dirname, "../../google-services.json");

/** Load Firebase service account; never throw at module load (Render has no gitignored JSON). */
function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw && typeof raw === "string" && raw.trim()) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[FcmServices] FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON:", e.message);
    }
  }
  if (!fs.existsSync(credPath)) {
    console.warn(
      "[FcmServices] No FCM credentials: set FIREBASE_SERVICE_ACCOUNT_JSON (Render secret) or add google-services.json locally. Push notifications disabled."
    );
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(credPath, "utf8"));
  } catch (e) {
    console.warn("[FcmServices] Could not read google-services.json:", e.message);
    return null;
  }
}

const serviceAccount = loadServiceAccount();

function getAccessToken() {
  if (!serviceAccount) {
    return Promise.reject(new Error("FCM credentials not configured"));
  }
  try {
    const SCOPES = "https://www.googleapis.com/auth/firebase.messaging";
    return new Promise(function (resolve, reject) {
      const jwtClient = new JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        SCOPES,
        null
      );

      jwtClient.authorize(function (err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  } catch (error) {
    console.log(error, "=================error");
  }
}

function fcmApiUrl() {
  const projectId = serviceAccount && serviceAccount.project_id;
  if (!projectId) return null;
  return `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
}

exports.send_fcm_push_notification = async (data) => {
  if (!serviceAccount) {
    console.warn("[FcmServices] Skipping FCM send: credentials not configured");
    return null;
  }
  const url = fcmApiUrl();
  if (!url) {
    console.warn("[FcmServices] Missing project_id in service account JSON");
    return null;
  }
  try {
    let access = await getAccessToken();
    let payload = {
      message: {
        token: data.device_token,
        notification: {
          title: data.title,
          body: data.message,
        },
        data: {
          count: "0",
          property_id: data.property_id,
          notification_type: "property"
        },
      },
    };
    const config = {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(url, payload, config);
    let all_unread_notification = await db.notifications.countDocuments({
      sendTo: data.sendTo,
      isDeleted: false,
      status: "unread",
    });
    await db.users.updateOne(
      { _id: data.sendTo },
      { unread_notifications_count: all_unread_notification }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error sending FCM notification:",
      error.response ? error.response.data : error.message
    );
    return "Error sending FCM notification";
  }
};
