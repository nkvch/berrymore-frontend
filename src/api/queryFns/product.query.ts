import authFetch from '../auth/helpers/authFetch';
import config from '../config';

const url = `${config.baseUrl}/products/:id`;

export interface ProductTableItem extends Record<string, string | number> {
  id: number;
  productName: string;
  productPrice: number;
  photoPath: string;
}

export interface GetProductParams {
  id: number;
}

const getProduct = async ({ id }: GetProductParams) => {
  const urlWithParams = new URL(url.replace(':id', id.toString()));

  const response = await authFetch(urlWithParams.toString());

  const data: ProductTableItem = await response.json();

  return data;
};

export default getProduct;
