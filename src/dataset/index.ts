import dataset from "./dataset.json";

export type Dimension = "pdi" | "idv" | "mas" | "uai" | "lto" | "ind";
export const dimensionList: Dimension[] = ["pdi", "idv", "mas", "uai", "lto", "ind"];

export type Country = {
  abbr: string;
  name: string;
} & Record<Dimension, number | null>;

dataset satisfies Country[];

export default dataset;
