import authFetch from "../../auth/helpers/authFetch";
import config from "../../config";

const url = `${config.baseUrl}/employees/:id`;

export interface UpdateEmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  berryId: string;
  contract: string;
  phone: string;
  address: string;
  additionalInfo: string;
}

export interface UpdateEmployeeRequest {
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

const updateEmployee = async (id: number, {
  firstName,
  lastName,
  foremanId,
  address,
  phone,
  contract,
  flags,
  additionalInfo,
  photo,
}: UpdateEmployeeRequest) => {
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

  const response = await authFetch(url.replace(':id', id.toString()), {
    method: "PUT",
    body: formData,
  });

  return response.json();
}

export default updateEmployee;
