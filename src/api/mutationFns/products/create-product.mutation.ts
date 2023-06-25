import authFetch from "../../auth/helpers/authFetch";
import config from "../../config";

const url = `${config.baseUrl}/products`;

export interface CreateProductMutationData {
  productName: string;
  productPrice: number;
  photo: File;
}

export interface CreateProductMutationResponse {
  id: string;
  productName: string;
  productPrice: number;
  photoPath: string;
}

const createProductMutationFn = async (
  data: CreateProductMutationData
): Promise<CreateProductMutationResponse> => {
  const formData = new FormData();
  formData.append("productName", data.productName);
  formData.append("productPrice", data.productPrice.toString());

  if (data.photo)
    formData.append("photo", data.photo);

  const response = await authFetch(url, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();

  return responseData;
}

export default createProductMutationFn;
