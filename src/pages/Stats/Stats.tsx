import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthenticatedQuery from '../../api/auth/hooks/useAuthenticatedQuery';
import getLatestStats from '../../api/queryFns/stats.query';
import Chart from './Chart/Chart';
import authorized from '../../helpers/withAuth';
import { Typography } from '@mui/material';


const Stats = () => {
  const navigate = useNavigate();

  const [foremanId, setForemanId] = useState<number | undefined>();
  const [productId, setProductId] = useState<number | undefined>();

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
      <Typography variant="h4" component="h1" gutterBottom>
        Всего за 2 нед. собрано: {stats?.totalAmount.toFixed(2)} кг
      </Typography>
    </>
  );
};

export default authorized(Stats);
