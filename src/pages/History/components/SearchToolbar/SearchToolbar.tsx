import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import getEmployees, { EmployeeTableItem } from "../../../../api/queryFns/employees.query";
import getForemen, { ForemanTableItem } from "../../../../api/queryFns/foremen.query";
import getProducts, { ProductTableItem } from "../../../../api/queryFns/products.query";
import DateTimeInput from "../../../../components/common/DateTimeInput/DateTimeInput";
import FetchSelect from "../../../../components/common/FetchSelect/FetchSelect";
import { ToolbarWrapper } from "./elements";

interface SearchToolbarPropd {
  fromDateTime?: Date;
  setFromDateTime: (fromDateTime?: Date) => void;
  toDateTime?: Date;
  setToDateTime: (toDateTime?: Date) => void;
  foremanId?: ForemanTableItem['id'];
  setForemanId: (foremanId?: ForemanTableItem['id']) => void;
  productId?: number;
  setProductId: (productId?: number) => void;
  employeeId?: number;
  setEmployeeId: (employeeId: number) => void;
  sort: 'asc' | 'desc';
  setSort: (sort: 'asc' | 'desc') => void;
}

function SearchToolbar(props: SearchToolbarPropd) {
  const {
    fromDateTime,
    setFromDateTime,
    toDateTime,
    setToDateTime,
    foremanId,
    setForemanId,
    productId,
    setProductId,
    employeeId,
    setEmployeeId,
    sort,
    setSort,
  } = props;

  return (
    <ToolbarWrapper>
      <DateTimeInput
        label='От'
        value={fromDateTime}
        onChangeValue={(value) => setFromDateTime(value)}
      />
      <DateTimeInput
        label='До'
        value={toDateTime}
        onChangeValue={(value) => setToDateTime(value)}
      />
      <FetchSelect<ProductTableItem>
        label='Продукт'
        multiple={false}
        value={productId as number}
        onChange={(value) => setProductId(value as number)}
        queryFn={(_, pagParams) => getProducts(pagParams)}
        showInOption={[{
          key: 'productName',
          type: 'text'
        }]}
        showInValue={[{
          key: 'productName',
          type: 'text'
        }]}
        valueKey='id'
      />
      <FetchSelect<EmployeeTableItem>
        label='Сборщик'
        multiple={false}
        value={employeeId as number}
        onChange={(value) => setEmployeeId(value as number)}
        queryFn={(search, pagParams) => getEmployees({ search }, pagParams)}
        showInOption={[{
          key: 'firstName',
          type: 'text'
        }, {
          key: 'lastName',
          type: 'text'
        }]}
        showInValue={[{
          key: 'firstName',
          type: 'text'
        }, {
          key: 'lastName',
          type: 'text'
        }]}
        valueKey='id'
      />
      <FetchSelect<ForemanTableItem>
        label='Бригадир'
        multiple={false}
        value={foremanId as ForemanTableItem['id']}
        onChange={(value) => setForemanId(value as ForemanTableItem['id'])}
        queryFn={getForemen}
        showInOption={[{
          key: 'firstName',
          type: 'text'
        }, {
          key: 'lastName',
          type: 'text'
        }]}
        showInValue={[{
          key: 'firstName',
          type: 'text'
        }, {
          key: 'lastName',
          type: 'text'
        }]}
        valueKey='id'
      />
      <FormControl>
        <InputLabel>Сортировка</InputLabel>
        <Select
          label='Сортировка'
          value={sort}
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
        >
          <MenuItem value='asc'>От старых к новым</MenuItem>
          <MenuItem value='desc'>От новых к старым</MenuItem>
        </Select>
      </FormControl>
    </ToolbarWrapper>
  )
}

export default SearchToolbar;
