import { KoordinatesDataset } from "@zhiweiliu/koordinates-base";
import { LinzDatasets } from "../src/index";
import apiKey from "./api-key";

const TIMEOUT: number = 60000;

test(
  "NZ Parcels capabilites endpoint",
  async () => {
    let nzp: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Parcels"
    ) as KoordinatesDataset;
    expect(nzp).not.toBe(undefined);

    let json = await nzp.getLayerCapabilitiesJson(apiKey);
    expect(json["wfs:WFS_Capabilities"]["$"]["version"]).toBe("2.0.0");

    let xml = await nzp.getLayerCapabilitiesXml(apiKey);
    expect(xml).toContain('wfs:WFS_Capabilities version="2.0.0"');

    xml = await nzp.getAllCapabilitiesXml(apiKey);
    expect(xml).toContain("wfs:WFS_Capabilities");

    json = await nzp.getAllCapabilitiesJson(apiKey);
    expect(json["wfs:WFS_Capabilities"]["$"]["version"]).toBe("2.0.0");

    // CS-W endpoint
    xml = await nzp.getWebCatalogServicesXml();
    expect(xml).toContain("csw:Capabilities");
    json = await nzp.getWebCatalogServicesJson();
    expect(json["csw:Capabilities"]).toBeDefined();
  },
  TIMEOUT
);

test(
  "NZ Parcels changesets endpoint",
  async () => {
    let nzp: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Parcels"
    ) as KoordinatesDataset;
    expect(nzp).not.toBe(undefined);

    let changesets = await nzp.getWfsChangesets(
      apiKey,
      "2023-01-01T00:00:00Z",
      "2023-01-15T00:00:00Z"
    );
    expect(changesets.type).toBe("FeatureCollection");
    expect(changesets.features.length).toBe(changesets.numberReturned);
  },
  TIMEOUT
);

test(
  "NZ Parcels spatial data query endpoints",
  async () => {
    let nzp: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Parcels"
    ) as KoordinatesDataset;
    expect(nzp).not.toBe(undefined);

    let spatialDataJson = await nzp.queryWfsSpatialApiJson(
      apiKey,
      -37.78828,
      175.28011,
      100,
      10000
    );
    expect(
      spatialDataJson["vectorQuery"]["layers"][`${nzp.getLayerId()}`]
    ).toBeDefined();

    let spatialDataXml = await nzp.queryWfsSpatialApiXml(
      apiKey,
      -37.78828,
      175.28011,
      100,
      10000
    );
    expect(spatialDataXml).toContain("kx:vectorQuery");
    expect(spatialDataXml).toContain("gml:featureMember");
  },
  TIMEOUT
);

test(
  "NZ Parcels initial dataset",
  async () => {
    let nzp: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Parcels"
    ) as KoordinatesDataset;
    expect(nzp).not.toBe(undefined);

    let actualCount = await nzp.getInitialDatasetCount();
    console.log(`Initial dataset for ${nzp.getName()} is ${actualCount}`);
    const batchSize = 100000;
    let start = 0;
    let count = 0;
    while (start < actualCount) {
      let dataset = await nzp.getInitialDatasetInBatch(start, batchSize);
      count += dataset.length;
      start += dataset.length;
      console.log(`Loaded ${count} out of ${actualCount} records!`);
    }
    expect(actualCount).toBe(count);
  },
  TIMEOUT * 20
);
