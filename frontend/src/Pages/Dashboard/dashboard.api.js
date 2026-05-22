import ApiClient from "../../methods/api/apiClient";
import { isGuestMode } from "../../methods/guestMode";

export const getDashboardOverview = async (period = "day") => {
  const params = { period };
  if (isGuestMode()) params.guest = 'true';

  const primary = await ApiClient.get("dashboard/overview", params);
  if (primary?.success) return primary;

  return ApiClient.get("api/dashboard/overview", params);
};
