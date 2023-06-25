import authFetch from '../auth/helpers/authFetch';
import config from '../config';
import { PaginatedResponse, PaginationParams } from '../types/pagination';

const url = `${config.baseUrl}/products`;

export interface ProductTableItem extends Record<string, string | number> {
  id: number;
  productName: string;
  productPrice: number;
  photoPath: string;
}

type GetProductsResponse = PaginatedResponse<ProductTableItem>;

const getProducts = async (pagParams: PaginationParams) => {
  const urlWithParams = new URL(url);
  urlWithParams.searchParams.append('page', pagParams.page.toString());
  urlWithParams.searchParams.append('perPage', pagParams.perPage.toString());

  const response = await authFetch(urlWithParams.toString());

  const data: GetProductsResponse = await response.json();

  return data;
};

export default getProducts;
