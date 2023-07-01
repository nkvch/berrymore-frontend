import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import getEmployees, { EmployeeTableItem } from "../../../../api/queryFns/employees.query";
import getForemen, { ForemanTableItem } from "../../../../api/queryFns/foremen.query";
import getProducts, { ProductTableItem } from "../../../../api/queryFns/products.query";
import DateTimeInput from "../../../../components/common/DateTimeInput/DateTimeInput";
import FetchSelect from "../../../../components/common/FetchSelect/FetchSelect";
import { HotButton, ToolbarWrapper } from "./elements";
import { useCallback } from "react";
import { notification } from "../../../../components/Notifications/Notifications";
import { endOfDay, startOfDay } from "date-fns";

interface SearchToolbarPropd {
  fromDateTime?: Date;
  setFromDateTime: (fromDateTime: Date) => void;
  toDateTime?: Date;
  setToDateTime: (toDateTime: Date) => void;
  foremanId?: ForemanTableItem['id'];
  setForemanId: (foremanId?: ForemanTableItem['id']) => void;
  productId?: number;
  setProductId: (productId?: number) => void;
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
  } = props;

  const onChangeDateTime = useCallback((value: Date | undefined, setter: (value: Date) => void) => {
    if (value) {
      setter(value);
    } else {
      notification.open({
        type: 'warning',
        title: 'Дата обязательна',
      });
    }
  }, []);

  const onTodayClick = useCallback(() => {
    setFromDateTime(startOfDay(new Date()));
    setToDateTime(endOfDay(new Date()));
  }, [setFromDateTime, setToDateTime]);

  const onWeekClick = useCallback(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setFromDateTime(startOfDay(weekAgo));
    setToDateTime(endOfDay(today));
  }, [setFromDateTime, setToDateTime]);

  const onMonthClick = useCallback(() => {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setFromDateTime(startOfDay(monthAgo));
    setToDateTime(endOfDay(today));
  }, [setFromDateTime, setToDateTime]);

  return (
    <ToolbarWrapper>
      <HotButton
        onClick={onTodayClick}
      >
        За сегодня
      </HotButton>
      <HotButton
        onClick={onWeekClick}
      >
        За неделю
      </HotButton>
      <HotButton
        onClick={onMonthClick}
      >
        За месяц
      </HotButton>
      <DateTimeInput
        label='От'
        value={fromDateTime}
        onChangeValue={(value) => onChangeDateTime(value, setFromDateTime)}
      />
      <DateTimeInput
        label='До'
        value={toDateTime}
        onChangeValue={(value) => onChangeDateTime(value, setToDateTime)}
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
    </ToolbarWrapper>
  )
}

export default SearchToolbar;
