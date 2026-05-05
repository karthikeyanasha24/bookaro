import ApiClient from "../../methods/api/apiClient";

export const getDashboardOverview = async (period = "day") => {
  const primary = await ApiClient.get("dashboard/overview", { period }, "", true);
  if (primary?.success) return primary;

  return ApiClient.get("api/dashboard/overview", { period }, "", true);
};
