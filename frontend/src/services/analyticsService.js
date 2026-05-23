import api from "./api";

export const getOverview = () => api.get("/analytics/overview");
export const getActivity = () => api.get("/activity");
