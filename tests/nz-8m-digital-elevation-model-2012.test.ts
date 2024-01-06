import { KoordinatesDataset } from "../src/koordinates-dataset";
import { LinzDatasets } from "../src/index";
import apiKey from "./api-key";
import fs from "fs";
import Buffer from "buffer";

const TIMEOUT: number = 60000;

test(
  "NZ 8m Digital Elevation Model (2012) capabilites endpoint",
  async () => {
    let nz8m: KoordinatesDataset = LinzDatasets.find(
      (d) => d.name === "NZ 8m Digital Elevation Model (2012)"
    ) as KoordinatesDataset;
    expect(nz8m).not.toBe(undefined);

    let xml = await nz8m.getLayerCapabilitiesXml(apiKey);
    expect(xml).toContain(
      "<ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>"
    );

    let json = await nz8m.getLayerCapabilitiesJson(apiKey);
    expect(json["Capabilities"]["$"]["version"]).toBe(nz8m.version);

    xml = await nz8m.getAllCapabilitiesXml(apiKey);
    expect(xml).toContain(
      "<ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>"
    );

    json = await nz8m.getAllCapabilitiesJson(apiKey);
    expect(json["Capabilities"]["$"]["version"]).toBe(nz8m.version);

    // CS-W endpoint
    xml = await nz8m.getWebCatalogServicesXml();
    expect(xml).toContain("csw:Capabilities");
  },
  TIMEOUT
);

test(
  "NZ 8m Digital Elevation Model (2012) spatial data query endpoints",
  async () => {
    let nz8m: KoordinatesDataset = LinzDatasets.find(
      (d) => d.name === "NZ 8m Digital Elevation Model (2012)"
    ) as KoordinatesDataset;
    expect(nz8m).not.toBe(undefined);

    let spatialDataJson = await nz8m.queryWmtsSpatialApiJson(
      apiKey,
      -37.78828,
      175.28011
    );

    expect(
      spatialDataJson["rasterQuery"]["layers"][`${nz8m.layerId}`]
    ).toBeDefined();
  },
  TIMEOUT
);

test(
  "NZ 8m Digital Elevation Model (2012) XYZ tile service endpoint",
  async () => {
    let nz8m: KoordinatesDataset = LinzDatasets.find(
      (d) => d.name === "NZ 8m Digital Elevation Model (2012)"
    ) as KoordinatesDataset;
    expect(nz8m).not.toBe(undefined);

    let blob = await nz8m.queryXyzTileServiceApi(apiKey, 827933, 3729820, 6);
    let buffer = Buffer.Buffer.from(blob);
    await fs.createWriteStream(`./test.png`).write(buffer);
  },
  TIMEOUT
);
