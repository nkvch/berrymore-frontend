import { Typography } from '@mui/material';
import { useState } from 'react';
import useAuthenticatedQuery from '../../api/auth/hooks/useAuthenticatedQuery';
import getLatestStats from '../../api/queryFns/stats.query';
import LoadingBox from '../../components/common/LoadingBox/LoadingBox';
import authorized from '../../helpers/withAuth';
import Chart from './components/Chart/Chart';
import { endOfDay, startOfDay } from 'date-fns';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import EmployeesResultsTable from './components/EmployeesResultsTable/EmployeesResultsTable';


const Stats = () => {
  const [foremanId, setForemanId] = useState<number | undefined>();
  const [productId, setProductId] = useState<number | undefined>();

  const [fromDateTime, setFromDateTime] = useState<Date>(startOfDay(new Date()));
  const [toDateTime, setToDateTime] = useState<Date>(endOfDay(new Date()));

  const {
    data: stats,
    isFetching,
  } = useAuthenticatedQuery(
    ['stats', foremanId, productId, fromDateTime, toDateTime],
    () => getLatestStats({
      foremanId,
      productId,
      fromDateTime,
      toDateTime,
    }),
    {
      enabled: !!fromDateTime && !!toDateTime,
    }
  );

  const top10Employees = stats?.topEmployees?.slice(0, 10);

  console.log(stats);

  return (
    <>
      <SearchToolbar
        fromDateTime={fromDateTime}
        setFromDateTime={setFromDateTime}
        toDateTime={toDateTime}
        setToDateTime={setToDateTime}
        foremanId={foremanId}
        setForemanId={setForemanId}
        productId={productId}
        setProductId={setProductId}
      />
      {
        top10Employees && (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Топ 10 сборщиков за период
            </Typography>
            <Chart
              data={top10Employees}
            />
          </>
        )
      }
      {
        isFetching ? <LoadingBox /> : <Typography variant="h4" component="h1" gutterBottom>
          Всего за период собрано: {stats?.totalAmount.toFixed(2)} кг
          <br />
          Всего неоплачено: {stats?.unpaid.pay.toFixed(2)} руб.
        </Typography>
      }
      {
        stats?.topEmployees && (
          <EmployeesResultsTable
            employees={stats.topEmployees}
          />
        )
      }
    </>
  );
};

export default authorized(Stats);
