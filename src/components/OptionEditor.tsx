import { useState } from "react";
import { Dimension, dimensionList } from "../dataset";
import CountrySelector from "./CountrySelector";
import { CountryChartOptions } from "./CountryChart";

const dimensionLabels: Record<Dimension, string> = {
  pdi: "PDI (Power distance)",
  idv: "IDV (Individualism vs collectivism)",
  uai: "UAI (Uncertainty avoidance)",
  mas: "MAS (Masculinity)",
  lto: "LTO (Long-term orientation)",
  ind: "IND (Indulgence vs restraint)",
};

export type OptionEditorProps = {
  options: CountryChartOptions;
  onChange: (options: CountryChartOptions) => void;
};

export default function OptionEditor({ options: oldOptions, onChange }: OptionEditorProps) {
  const [options, setOptions] = useState(Object.assign({}, oldOptions));
  const [showSelector, setShowSelector] = useState(false);

  return (
    <>
      <div>
        <div className="mx-1 my-4">
          <button
            className="px-2 py-0.5 text-white bg-blue-500 rounded-md"
            type="button"
            onClick={() => {
              setShowSelector(true);
            }}
          >
            Select Countries
          </button>
        </div>
        <div className="mx-1 my-4">
          <div className="my-1">Dimensions</div>
          {dimensionList.map((dim, i) => {
            return (
              <div key={i} className="my-1">
                <label>
                  <input
                    className="mx-1"
                    type="checkbox"
                    checked={options.dimensions.includes(dim)}
                    onChange={(ev) => {
                      const dimensions = options.dimensions.filter((value) => value !== dim);
                      if (ev.currentTarget.checked) {
                        dimensions.push(dim);
                      }
                      setOptions({ ...options, dimensions });
                    }}
                  />
                  <span>{dimensionLabels[dim]}</span>
                </label>
              </div>
            );
          })}
        </div>
        <div className="mx-1 my-4">
          <label>
            <span className="mx-1">Clusters</span>
            <input
              className="mx-1 w-32 text-center border-b-2 border-gray-300 focus:outline-none"
              type="number"
              min={1}
              step={1}
              value={options.clusters}
              onChange={(ev) => {
                const clusters = parseInt(ev.currentTarget.value);
                setOptions({ ...options, clusters });
              }}
            />
          </label>
        </div>
        <div className="mx-1 my-4">
          <label>
            <input
              className="mx-1"
              type="checkbox"
              checked={options.fillNull}
              onChange={(ev) => {
                const fillNull = ev.currentTarget.checked;
                setOptions({ ...options, fillNull });
              }}
            />
            <span className="mx-1">Fill null data</span>
          </label>
        </div>
        <div className="mx-1 my-4">
          <button
            className="px-2 py-0.5 text-white bg-green-500 rounded-md"
            type="button"
            onClick={() => {
              onChange(options);
            }}
          >
            Update
          </button>
        </div>
      </div>
      {showSelector && (
        <CountrySelector
          selected={options.countries}
          onChange={(countries) => {
            if (countries) {
              setOptions({ ...options, countries });
            }
            setShowSelector(false);
          }}
        />
      )}
    </>
  );
}
