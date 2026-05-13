import ApiClient from "../../methods/api/apiClient";

export const getDashboardPreferences = async () => {
  return ApiClient.get("dashboard/preferences");
};

export const saveDashboardPreferences = async (payload) => {
  return ApiClient.put("dashboard/preferences", payload);
};
