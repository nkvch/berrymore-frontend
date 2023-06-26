import { Typography } from '@mui/material';
import { useState } from 'react';
import useAuthenticatedQuery from '../../api/auth/hooks/useAuthenticatedQuery';
import getLatestStats from '../../api/queryFns/stats.query';
import LoadingBox from '../../components/common/LoadingBox/LoadingBox';
import authorized from '../../helpers/withAuth';
import Chart from './Chart/Chart';


const Stats = () => {
  const [foremanId,] = useState<number | undefined>();
  const [productId,] = useState<number | undefined>();

  const {
    data: stats,
    isFetching,
  } = useAuthenticatedQuery(
    ['stats', foremanId, productId],
    () => getLatestStats({
      foremanId,
      productId,
    }),
    {
      // enabled: !!foremanId || !!productId,
    }
  );

  return (
    <>
      {
        stats?.top10Employees && (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Топ 10 сборщиков за 2 нед.:
            </Typography>
            <Chart
              data={stats?.top10Employees}
            />
          </>
        )
      }
      {
        isFetching ? <LoadingBox /> : <Typography variant="h4" component="h1" gutterBottom>
          Всего за 2 нед. собрано: {stats?.totalAmount.toFixed(2)} кг
        </Typography>
      }
    </>
  );
};

export default authorized(Stats);
