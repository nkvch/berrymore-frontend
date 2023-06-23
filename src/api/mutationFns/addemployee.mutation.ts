import { MutationFunction } from "@tanstack/react-query";
import config from "../config";
import authFetch from "../auth/helpers/authFetch";

const url = `${config.baseUrl}/employees`;

export interface AddEmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  berryId: string;
  contract: string;
  phone: string;
  address: string;
  additionalInfo: string;
}

export interface AddEmployeeRequest {
  firstName: string;
  lastName: string;
  foremanId: number;
  address: string;
  phone: string;
  contract: string;
  flags: number[];
  additionalInfo: string;
  photo?: File;
}

const addEmployee: MutationFunction<AddEmployeeResponse, AddEmployeeRequest> = async ({
  firstName,
  lastName,
  foremanId,
  address,
  phone,
  contract,
  flags,
  additionalInfo,
  photo,
}) => {
  const formData = new FormData();

  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("foremanId", foremanId.toString());
  formData.append("address", address);
  formData.append("phone", phone);
  formData.append("contract", contract);
  formData.append("flags", flags.join(","));
  formData.append("additionalInfo", additionalInfo);

  if (photo) {
    formData.append("photo", photo);
  }

  const response = await authFetch(url, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export default addEmployee;
