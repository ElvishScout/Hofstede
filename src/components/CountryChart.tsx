import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ScaleOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Country, Dimension, dimensionList } from "../dataset";
import { kmeans } from "../algorithms/kmeans";
import { pca } from "../algorithms/pca";
import { useMemo } from "react";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, ChartDataLabels);

const randomColor = () => {
  let r: number, g: number, b: number;
  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  } while (((r ^ g) & (r ^ b)) >> 7);
  return `rgb(${r},${g},${b})`;
};

export type CountryChartOptions = {
  countries: Country[];
  dimensions: Dimension[];
  clusters: number;
  fillNull: boolean;
};

export type CountryChartStyles = {
  showLabels: boolean;
};

type CountryChartData = {
  point: [number, number];
  country: Country;
  cluster: number;
};

const generateChartData = ({
  countries,
  dimensions,
  clusters: n_clusters,
  fillNull,
}: CountryChartOptions): CountryChartData[] => {
  countries = countries.sort(({ abbr: ctr1 }, { abbr: ctr2 }) => ctr1.localeCompare(ctr2));
  dimensions = dimensions.sort((dim1, dim2) => dim1.localeCompare(dim2));

  if (!fillNull) {
    countries = countries.filter((country) => {
      return dimensions.every((dim) => {
        return country[dim] !== null;
      });
    });
  }

  if (countries.length === 0) {
    return [];
  } else if (countries.length === 1) {
    return [
      {
        point: [0, 0],
        country: countries[0],
        cluster: 0,
      },
    ];
  }

  let dimensionData = countries.map((country) => {
    return dimensions.map((dim) => {
      return country[dim] ?? NaN;
    });
  });

  if (fillNull) {
    const mean = dimensionData[0].map((_, j) => {
      const [sum, count] = dimensionData.reduce(
        ([sum, count], row) => {
          const value = row[j];
          if (isNaN(value)) {
            return [sum, count];
          }
          return [sum + value, count + 1];
        },
        [0, 0]
      );
      return sum / count;
    });
    dimensionData = dimensionData.map((row) => {
      return row.map((data, j) => {
        return isNaN(data) ? mean[j] : data;
      });
    });
  }
  const projectedData = pca(dimensionData, 2);
  const clusters = kmeans(projectedData, n_clusters);

  return clusters.flatMap((cluster, i) => {
    return cluster.map((point) => {
      const index = projectedData.indexOf(point);
      return {
        point: point as [number, number],
        country: countries[index],
        cluster: i,
      };
    });
  });
};

export type CountryChartProps = {
  options: CountryChartOptions;
  styles: CountryChartStyles;
  onSelect?: (selection: { country: Country; position: [number, number] } | null) => void;
};

export default function CountryChart({ options, styles, onSelect }: CountryChartProps) {
  const data = useMemo(() => {
    return generateChartData(options);
  }, [options]);

  const pointColors = useMemo(() => {
    const palette: string[] = [];
    return data.map(({ cluster }) => {
      while (cluster >= palette.length) {
        palette.push(randomColor());
      }
      return palette[cluster];
    });
  }, [data]);

  const [min, max] = data.reduce(
    ([min, max], { point: [x, y] }) => {
      return [Math.min(min, x, y), Math.max(max, x, y)];
    },
    [-1, 1]
  );

  const scale: ScaleOptions = {
    type: "linear",
    min: Math.floor(min * 2) / 2,
    max: Math.ceil(max * 2) / 2,
    ticks: { stepSize: 0.5 },
  };

  const chartData: ChartData<"scatter"> = {
    datasets: [
      {
        data: data.map(({ point: [x, y] }) => {
          return { x, y };
        }),
        pointBackgroundColor: pointColors,
        pointRadius: 4,
        pointHoverRadius: 5,
      },
    ],
    labels: data.map(
      ({ country, cluster }) =>
        `${country.name}\nGroup ${cluster + 1}` +
        "\n" +
        dimensionList.map((dim) => `${dim.toUpperCase()}: ${country[dim] ?? "null"}`).join(" | ")
    ),
  };

  const chartOptions: ChartOptions<"scatter"> = {
    aspectRatio: 1,
    responsive: true,
    scales: { x: scale, y: scale },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label() {
            return "";
          },
        },
      },
      datalabels: {
        display: styles.showLabels,
        color: "black",
        align: "top",
        formatter(_, context) {
          return data[context.dataIndex].country.name;
        },
      },
    },
    onClick(event, elements) {
      const ev = event.native as MouseEvent;

      if (elements.length > 0) {
        ev.stopPropagation();
        if (onSelect) {
          const country = data[elements[0].index].country;
          const { x, y } = ev;
          onSelect({ country, position: [x, y] });
        }
      }
    },
    onHover(event, elements) {
      const ev = event.native as MouseEvent;
      const target = ev.target as HTMLElement;
      if (elements.length > 0) {
        target.style.cursor = "pointer";
      } else {
        target.style.cursor = "default";
      }
    },
  };

  return (
    <div
      className="w-full h-full"
      onClick={() => {
        if (onSelect) {
          onSelect(null);
        }
      }}
    >
      <div className="mx-auto max-w-full max-h-full aspect-square">
        <Scatter data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
