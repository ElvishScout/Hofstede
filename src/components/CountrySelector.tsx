import { useState } from "react";
import dataset, { Country } from "../dataset";

const matchSearch = (query: string, text: string) => {
  query = query.toLowerCase().trim();
  text = text.toLowerCase().trim();
  let i = 0;
  let j = 0;
  while (i < query.length && j < text.length) {
    if (query[i] === text[j]) {
      i++;
    }
    j++;
  }
  return i === query.length;
};

export type CountrySelectorProps = {
  selected: Country[];
  onChange?: (selected: Country[] | null) => void;
};

export default function CountrySelector({ selected, onChange }: CountrySelectorProps) {
  const countries = dataset.sort(({ abbr: abbr1 }, { abbr: abbr2 }) => abbr1.localeCompare(abbr2));
  const [selectedCountries, setSelectedCountries] = useState(selected);
  const [searchName, setSearchName] = useState("");

  return (
    <div className="fixed sm:p-8 top-0 left-0 w-full h-full z-10 bg-gray-300/50">
      <div className="relative flex flex-col gap-2 p-4 w-full h-full bg-white rounded-lg">
        <button
          className="absolute mx-2 my-1 px-1 py-1 right-0 top-0 z-10"
          type="button"
          onClick={() => {
            if (onChange) {
              onChange(null);
            }
          }}
        >
          X
        </button>
        <div className="flex justify-center text-center">
          <label className="contents">
            <span className="mx-1">Search</span>
            <input
              className="flex-grow mx-1 px-2 max-w-[24rem] min-w-16 border-b-2 border-gray-300 focus:outline-none"
              type="text"
              value={searchName}
              onChange={(ev) => {
                setSearchName(ev.currentTarget.value);
              }}
            />
          </label>
          <label className="contents">
            <input
              className="mx-1"
              type="checkbox"
              checked={countries.every((country) => selectedCountries.includes(country))}
              onChange={(ev) => {
                const updated = ev.currentTarget.checked ? Array.from(dataset) : [];
                setSelectedCountries(updated);
              }}
            />
            <span className="mx-1">All</span>
          </label>
        </div>
        <div className="flex-grow min-h-0 overflow-y-auto">
          <div className="flex flex-wrap justify-between w-full">
            {countries.map((country, i) => {
              const match = matchSearch(searchName, country.name);
              return (
                <div
                  key={i}
                  className="mx-1 my-1"
                  style={{ display: match ? undefined : "none" }}
                  hidden={!match}
                >
                  <label>
                    <div className="px-2 py-1 border-2 border-gray-300 rounded-md">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={(ev) => {
                          const updated = selectedCountries.filter((value) => value !== country);
                          if (ev.currentTarget.checked) {
                            updated.push(country);
                          }
                          setSelectedCountries(updated);
                        }}
                      />
                      <span className="ml-1">{country.name}</span>
                    </div>
                  </label>
                </div>
              );
            })}
            <div className="flex-grow min-w-[10%] h-0"></div>
          </div>
        </div>
        <div className="text-center">
          <button
            className="px-4 py-1 text-white bg-blue-500 rounded-md"
            type="button"
            onClick={() => {
              if (onChange) {
                onChange(Array.from(selectedCountries));
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
