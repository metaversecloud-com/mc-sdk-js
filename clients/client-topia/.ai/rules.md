1. Create factories only in topiaInit.ts

Always create the Topia instance and factories once in a utility file called utils/topiaInit.ts.

Never create new factories or clients inside controllers or routes.

Correct ✅

```ts
import dotenv from "dotenv";
dotenv.config();

import { AssetFactory, DroppedAssetFactory, UserFactory, VisitorFactory, WorldFactory, Topia } from "@rtsdk/topia";

const config = {
  apiDomain: process.env.INSTANCE_DOMAIN || "https://api.topia.io/",
  interactiveKey: process.env.INTERACTIVE_KEY,
  interactiveSecret: process.env.INTERACTIVE_SECRET,
};

const myTopiaInstance = new Topia(config);

const Asset = new AssetFactory(myTopiaInstance);
const DroppedAsset = new DroppedAssetFactory(myTopiaInstance);
const User = new UserFactory(myTopiaInstance);
const Visitor = new VisitorFactory(myTopiaInstance);
const World = new WorldFactory(myTopiaInstance);

export { Asset, DroppedAsset, User, Visitor, World };
```

Incorrect ❌

```ts
// ❌ Never instantiate Topia or factories directly in a controller
const client = new Topia({});
const User = new UserFactory(client);
```

2. Always import factories from topiaInit.ts

Controllers and services must import Asset, DroppedAsset, User, Visitor, World from ../utils/topiaInit.

Never re-create them.

Correct ✅

```ts
import { Request, Response } from "express";
import { DroppedAsset } from "utils/topiaInit.ts";
import { VisitorInterface } from "@rtsdk/topia";

export const getDroppedAssetAndVisitor = async (req: Request, res: Response) => {
  try {
    const { assetId, interactiveNonce, interactivePublicKey, urlSlug, visitorId } = req.query;

    const credentials = {
      interactiveNonce,
      interactivePublicKey,
      assetId,
      urlSlug,
      visitorId,
    };

    const droppedAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });

    await droppedAsset.fetchDroppedAssetDataObject();

    const visitor: VisitorInterface = await Visitor.get(visitorId, urlSlug, { credentials });

    return { droppedAsset, isAdmin: visitor.isAdmin };
  } catch (error) {
    return res.status(error.status || 500).send({ error, success: false });
  }
};
```

Incorrect ❌

```ts
// ❌ Don’t import directly from @rtsdk/topia in controllers
import { UserFactory } from "@rtsdk/topia";
```

3. Use the exported methods exactly as typed

Only use methods that exist in the SDK types.

Do not invent new methods like getWorldById or fetchVisitorData.

Correct ✅

```ts
const droppedAsset = await DroppedAsset.get(assetId, urlSlug, {
  credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId },
});

await droppedAsset.fetchDataObject();

const visitor = await Visitor.get(visitorId, urlSlug, {
  credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId },
});

return { droppedAsset, isAdmin: visitor.isAdmin };
```

Incorrect ❌

```ts
// ❌ Method does not exist
const visitor = await Visitor.fetch(visitorId);
```

4. Always pass credentials explicitly

When calling .get() methods, credentials must be included.

Never omit or rename required fields.

Correct ✅

```ts
Visitor.get(visitorId, urlSlug, { credentials });
```

Incorrect ❌

```ts
Visitor.get(visitorId); // ❌ missing credentials
```

5. File structure is fixed

Factories live in utils/topiaInit.ts.

Controllers import from that file.

Do not create alternative setups or duplicate factories.

✅ Follow these rules to ensure correct usage.
❌ Do not deviate or invent new patterns.
