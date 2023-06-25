import authFetch from "../../auth/helpers/authFetch";
import config from "../../config";

const url = `${config.baseUrl}/products/:id`;

export interface UpdateProductMutationData {
  id: number;
  productName?: string;
  productPrice?: number;
  photo?: File;
}

export interface UpdateProductMutationResponse {
  id: string;
  productName: string;
  productPrice: number;
  photoPath: string;
}

const updateProductMutationFn = async (
  data: UpdateProductMutationData
): Promise<UpdateProductMutationResponse> => {
  const formData = new FormData();
  if (data.productName)
    formData.append("productName", data.productName);

  if (data.productPrice)
    formData.append("productPrice", data.productPrice.toString());

  if (data.photo)
    formData.append("photo", data.photo);

  const urlWithParams = new URL(url.replace(':id', data.id.toString()));

  const response = await authFetch(urlWithParams.toString(), {
    method: "PUT",
    body: formData,
  });

  const responseData = await response.json();

  return responseData;
}

export default updateProductMutationFn;
