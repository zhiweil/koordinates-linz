import { KoordinatesDataset } from "@zhiweiliu/koordinates-base";
import { LinzDatasets } from "../src/index";
import apiKey from "./api-key";

const TIMEOUT: number = 60000;

test(
  "NZ addresses capabilites endpoint",
  async () => {
    let nza: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Addresses"
    ) as KoordinatesDataset;
    expect(nza).not.toBe(undefined);

    let json = await nza.getLayerCapabilitiesJson(apiKey);
    expect(json["wfs:WFS_Capabilities"]["$"]["version"]).toBe("2.0.0");

    let xml = await nza.getLayerCapabilitiesXml(apiKey);
    expect(xml).toContain('wfs:WFS_Capabilities version="2.0.0"');

    xml = await nza.getAllCapabilitiesXml(apiKey);
    expect(xml).toContain("wfs:WFS_Capabilities");

    json = await nza.getAllCapabilitiesJson(apiKey);
    expect(json["wfs:WFS_Capabilities"]["$"]["version"]).toBe("2.0.0");

    // CS-W endpoint
    xml = await nza.getWebCatalogServicesXml();
    expect(xml).toContain("csw:Capabilities");
    json = await nza.getWebCatalogServicesJson();
    expect(json["csw:Capabilities"]).toBeDefined();
  },
  TIMEOUT
);

test(
  "NZ addresses changesets endpoint",
  async () => {
    let nza: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Addresses"
    ) as KoordinatesDataset;
    expect(nza).not.toBe(undefined);

    let changesets = await nza.getWfsChangesets(
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
  "NZ addresses spatial data query endpoints",
  async () => {
    let nza: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Addresses"
    ) as KoordinatesDataset;
    expect(nza).not.toBe(undefined);

    let spatialDataJson = await nza.queryWfsSpatialApiJson(
      apiKey,
      -37.78828,
      175.28011,
      100,
      10000
    );
    expect(
      spatialDataJson["vectorQuery"]["layers"][`${nza.getLayerId()}`]
    ).toBeDefined();

    let spatialDataXml = await nza.queryWfsSpatialApiXml(
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
  "NZ addresses initial dataset",
  async () => {
    let nza: KoordinatesDataset = LinzDatasets.find(
      (d) => d.getName() === "NZ Addresses"
    ) as KoordinatesDataset;
    expect(nza).not.toBe(undefined);

    let actualCount = await nza.getInitialDatasetCount();
    console.log(`Initial dataset for ${nza.getName()} is ${actualCount}`);
    const batchSize = 100000;
    let start = 0;
    let count = 0;
    while (start < actualCount) {
      let dataset = await nza.getInitialDatasetInBatch(start, batchSize);
      count += dataset.length;
      start += dataset.length;
      console.log(`Loaded ${count} out of ${actualCount} records!`);
    }
    expect(actualCount).toBe(count);
  },
  TIMEOUT * 5
);
