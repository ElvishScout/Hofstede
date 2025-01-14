import "./App.css";

import { useRef, useState } from "react";
import dataset, { dimensionList } from "./dataset";
import CountryChart, { CountryChartOptions } from "./components/CountryChart";
import OptionEditor from "./components/OptionEditor";

export default function App() {
  const [options, setOptions] = useState<CountryChartOptions>({
    countries: dataset,
    dimensions: Array.from(dimensionList),
    clusters: 12,
    fillNull: false,
    showLabels: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartKey, setChartKey] = useState(0);

  return (
    <>
      <div className="md:flex absolute p-2 left-0 top-0 w-full sm:h-full">
        <div className="p-2">
          <OptionEditor
            options={options}
            onChange={(options) => {
              setOptions(options);
              setChartKey(chartKey + 1);
            }}
          />
        </div>
        <div className="md:flex-grow p-2 min-w-0">
          <div ref={containerRef} className="w-full h-full text-center border-2 border-gray-300">
            <CountryChart key={chartKey} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}
