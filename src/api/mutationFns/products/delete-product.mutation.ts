import { MutateFunction } from "@tanstack/react-query";
import config from "../../config";
import authFetch from "../../auth/helpers/authFetch";

const url = `${config.baseUrl}/products/:id`;

export interface DeleteProductMutationVariables {
  id: number;
}

export interface DeleteProductMutationResponse {
  id: number;
  productName: string;
  productPrice: number;
  photoPath: string;
}

const deleteProductMutationFn: MutateFunction<DeleteProductMutationResponse, Error, DeleteProductMutationVariables> = async (arg) => {
  const response = await authFetch(url.replace(':id', arg.id.toString()), {
    method: 'DELETE',
  });

  const data: DeleteProductMutationResponse = await response.json();

  return data;
}

export default deleteProductMutationFn;
