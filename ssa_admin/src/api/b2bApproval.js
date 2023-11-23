import { axiosInstance } from 'src/services/axios.service'

export const getAllB2bApprovalAccounts = async function() {
    const response = await axiosInstance.get('/fact')
    return response
}

export const getSingleB2bAccountDetails = async function() {}