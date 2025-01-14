import "./App.css";

import { useRef, useState } from "react";
import dataset, { dimensionList } from "./dataset";
import CountryChart, { CountryChartOptions, CountryChartStyles } from "./components/CountryChart";
import OptionEditor from "./components/OptionEditor";

export default function App() {
  const [options, setOptions] = useState<CountryChartOptions>({
    countries: dataset,
    dimensions: Array.from(dimensionList),
    clusters: 12,
    fillNull: false,
  });
  const [styles, setStyles] = useState<CountryChartStyles>({ showLabels: false });
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="md:flex absolute p-2 left-0 top-0 w-full sm:h-full">
        <div className="flex flex-col p-2 justify-between">
          <div>
            <OptionEditor
              options={options}
              onChange={(options) => {
                setOptions(options);
              }}
            />
          </div>
          <div>
            <div className="mx-1 my-4">
              <label>
                <input
                  className="mx-1"
                  type="checkbox"
                  checked={styles.showLabels}
                  onChange={(ev) => {
                    const showLabels = ev.currentTarget.checked;
                    setStyles({ ...styles, showLabels });
                  }}
                />
                <span className="mx-1">Show labels</span>
              </label>
            </div>
          </div>
        </div>
        <div className="md:flex-grow p-2 min-w-0">
          <div ref={containerRef} className="w-full h-full text-center border-2 border-gray-300">
            <CountryChart options={options} styles={styles} />
          </div>
        </div>
      </div>
    </>
  );
}
