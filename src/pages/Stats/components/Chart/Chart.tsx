import { useEffect, useState } from 'react';
import {
  Hint,
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';
import { StatsResponse } from '../../../../api/queryFns/stats.query';

interface ChartProps {
  data: StatsResponse['topEmployees']
}

function Chart({ data }: ChartProps) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const handleBarHover = (value: any) => {
    setHoveredBar(value);
  };

  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(document.getElementById('chart-container')!.clientWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const verticalLabels = data.length > 5 || width < 1000;

  const height = verticalLabels ? 600 : 500;

  return (
    <div id="chart-container">
      {width > 0 && (
        <>
          <XYPlot
            xType="ordinal"
            width={width}
            height={height}
            margin={{ bottom: verticalLabels ? 200 : 100 }}
            className="my-chart"
          >
            <XAxis tickLabelAngle={
              // depend on number of employees
              verticalLabels ? -90 : 0
            } />
            <YAxis />
            <VerticalBarSeries
              data={data.map((d) => ({
                x: d.lastName + ' ' + d.firstName,
                y: d.amount,
              }))}
              barWidth={0.5}
              color="#2e7d33"
              onValueMouseOver={handleBarHover}
              onValueMouseOut={() => setHoveredBar(null)}
            />
            {hoveredBar && (
              <Hint
                value={hoveredBar}
                format={(v) => [{ title: 'Всего собрал(а)', value: v.y.toFixed(2) + ' кг' }]}
                className="my-hint"
              />
            )}
          </XYPlot>
        </>
      )}
    </div>
  );
}

export default Chart;
