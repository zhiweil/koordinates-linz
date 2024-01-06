import { APIKind, KoordinatesDataset } from "@zhiweiliu/koordinates-base";
export let LinzHost: string = "https://data.linz.govt.nz";
export let initialDatasetLocation: string =
  "https://s3.ap-southeast-2.amazonaws.com/linz-datasets.zhiweiliu.com";

export let LinzDatasets = [
  new KoordinatesDataset({
    koordinatesHost: LinzHost,
    name: "NZ Addresses",
    layerId: 105689,
    apiKind: APIKind.WFS,
    apiVersion: "v1",
    version: "v2.0.0",
    initialDatasetTs: "2023-12-20T00:00:00Z",
    initialDatasetLocation,
    initialDataset: "nz-addresses.csv",
  }),
  new KoordinatesDataset({
    koordinatesHost: LinzHost,
    name: "NZ 8m Digital Elevation Model (2012)",
    layerId: 51768,
    apiKind: APIKind.WMTS,
    apiVersion: "v1",
    version: "1.0.0",
    initialDatasetTs: "2014-05-13T05:27:00Z",
    initialDatasetLocation: "",
    initialDataset: "",
  }),
];
