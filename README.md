# Koordinates - Land Information New Zealand (LINZ)

The repository provides access to LINZ datasets hosted by Koordinates. It is built on module [@zhiweiliu/koordiates-base](https://www.npmjs.com/package/@zhiweiliu/koordinates-base). Please refer to the base module for more details.

## Supported datasets

- NZ Addresses
- NZ 8m Digital Elevation Model (2012)
- NZ Parcels

## Example

```typescript
// import Koordinates modules
import { KoordinatesDataset } from "@zhiweiliu/koordinates-base";
import { LinzDatasets } from "@zhiweiliu/koordinates-linz";

// Koordinates API key, it is recommended to load it at run time instead of hard-coding it in a file
import apiKey from "./api-key";

// Find dataset
let nza: KoordinatesDataset = LinzDatasets.find(
  (d) => d.getName() === "NZ Addresses"
) as KoordinatesDataset;

// Invoke methods on the dataset object
let json = await nza.getLayerCapabilitiesJson(apiKey);
console.log(json);
```
