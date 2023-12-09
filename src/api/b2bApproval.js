import { axiosInstance } from "src/services/axios.service";

export const getAllB2bApprovalAccounts = async function ({ page }) {
  const response = await axiosInstance.get(
    `/api/get-all-b2b-users?page=${page}`
  );
  return response;
};

export const getSingleB2bAccountDetails = async function ({ userId }) {
  const response = await axiosInstance.get(
    `/api/get-single-b2b-user/${userId}`
  );
  return response;
};

export const approveUserInformation = async function ({ userId, is_approved }) {
  const response = await axiosInstance.patch(
    `/api/b2b/user/${userId}/approval`,
    { is_approved }
  );
  return response;
};

export const setDealerCodeHandler = async function ({ userId, code }) {
  const response = await axiosInstance.patch(`/api/b2b/user/dealer/code`, {
    userId,
    code,
  });
  return response;
};
