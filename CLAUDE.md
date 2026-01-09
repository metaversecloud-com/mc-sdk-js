# mc-sdk-js (@rtsdk/topia)

The public JavaScript/TypeScript SDK published to npm as `@rtsdk/topia`. Enables developers to build interactive applications that run inside Topia worlds.

## Project Structure

```
mc-sdk-js/
├── clients/
│   ├── boilerplate/              # Template for new packages
│   └── client-topia/             # Main SDK package (@rtsdk/topia)
│       ├── src/
│       │   ├── controllers/      # Business logic classes
│       │   ├── factories/        # Factory pattern implementations
│       │   ├── interfaces/       # TypeScript interfaces
│       │   ├── types/            # TypeScript type definitions
│       │   ├── utils/            # Utility functions
│       │   ├── __mocks__/        # Test mocks
│       │   └── index.ts          # Main entry point
│       ├── dist/                 # Compiled output (ESM + CJS)
│       ├── dist-types/           # Declaration files
│       ├── rollup.config.js      # Build configuration
│       └── package.json
├── lerna.json                    # Lerna monorepo config
└── package.json                  # Root workspace config
```

## Build System

- **Monorepo**: Lerna with Yarn workspaces
- **Build Tool**: Rollup with TypeScript
- **Output**: Dual format (ESM: `dist/index.js`, CJS: `dist/index.cjs`)
- **Types**: Generated to `dist-types/`

## Development Commands

```bash
# Install dependencies
yarn install

# Build SDK
yarn build

# Run tests
yarn test

# Lint code
yarn lint

# Generate documentation
cd clients/client-topia && yarn docs
```

---

## Local Development with Yalc

When developing SDK changes, use yalc to test locally with SDK apps before publishing.

### Step 1: Build and Push SDK to Yalc

```bash
# From mc-sdk-js/clients/client-topia directory
cd clients/client-topia
npm run yalc-push
```

This builds the SDK and pushes it to your local yalc store.

### Step 2: Link SDK in Consumer App

In each SDK app that needs the updated SDK:

```bash
# Example: virtual-pet app
cd /path/to/topia-sdk-apps/virtual-pet/server
npm run link-sdk
cd ..
```

This links the local yalc version to the app's server workspace.

### Workflow

1. Make changes to SDK source files
2. Run `npm run yalc-push` from `mc-sdk-js/clients/client-topia`
3. Run `npm run link-sdk` in each consuming app's server directory
4. Test your changes
5. Repeat as needed

---

## Architecture

### Class Hierarchy

```
SDKController (base class)
├── Topia (root client, axios instance)
├── Asset
│   └── DroppedAsset (extends Asset)
├── User
│   └── Visitor (extends User)
├── World
├── Scene
├── Ecosystem
├── InventoryItem
├── UserInventoryItem
├── WebRTCConnector
└── WorldActivity
```

### Factory Pattern

**CRITICAL**: Always use factories, never instantiate controllers directly.

```typescript
// ✅ CORRECT - Single Topia instance, reused factories
// utils/topiaInit.ts
import { Topia, DroppedAssetFactory, VisitorFactory, WorldFactory } from "@rtsdk/topia";

const topia = new Topia({
  apiDomain: process.env.INSTANCE_DOMAIN,
  apiProtocol: process.env.INSTANCE_PROTOCOL,
  interactiveKey: process.env.INTERACTIVE_KEY,
  interactiveSecret: process.env.INTERACTIVE_SECRET,
});

export const DroppedAsset = new DroppedAssetFactory(topia);
export const Visitor = new VisitorFactory(topia);
export const World = new WorldFactory(topia);

// ❌ INCORRECT - Don't create Topia per request
// ❌ INCORRECT - Don't create factories in controllers
```

### Available Factories

| Factory | Methods |
|---------|---------|
| `WorldFactory` | `create(urlSlug, options)` |
| `UserFactory` | `create(options)` |
| `VisitorFactory` | `create(visitorId, urlSlug, options)`, `get(...)` |
| `DroppedAssetFactory` | `create(id, urlSlug, options)`, `get(...)`, `getWithUniqueName(...)`, `drop(...)` |
| `AssetFactory` | `create(id, options)` |
| `SceneFactory` | `create(id, options)` |
| `EcosystemFactory` | `create(options)` |
| `WebRTCConnectorFactory` | `create(options)` |
| `WorldActivityFactory` | `create(options)` |

---

## Core Controllers

### Topia (Root Client)

```typescript
const topia = new Topia({
  apiDomain: "api.topia.io",       // API domain
  apiProtocol: "https",            // Protocol
  apiKey: "...",                   // Optional: API key for admin access
  interactiveKey: "...",           // Public key (sent in headers)
  interactiveSecret: "...",        // Secret key (signs JWTs)
});
```

### World

```typescript
const world = World.create(urlSlug, { credentials });

// Fetch world details
await world.fetchDetails();

// Update world settings
await world.updateDetails({ name, description, width, height });

// Dropped assets
await world.fetchDroppedAssets();
await world.fetchDroppedAssetsWithUniqueName({ uniqueName: "MyApp_*" });

// Scenes
await world.fetchScenes();
await world.dropScene({ sceneId, position: { x, y } });

// Effects
await world.triggerParticle({ name: "confetti", duration: 3000 });
await world.triggerActivity({ type: WorldActivityType.GAME_ON, assetId });

// Notifications
await world.fireToast({ groupId, title: "Hello!", text: "Welcome" });

// Data persistence
await world.fetchDataObject();
await world.setDataObject(data, { lock: { lockId, releaseLock: true } });
await world.updateDataObject(partialData, { analytics: [...] });
await world.incrementDataObjectValue("score", 10);
```

### Visitor

```typescript
const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

// Visitor actions
await visitor.fetchVisitor();
await visitor.moveVisitor({ x: 100, y: 200, shouldTeleportVisitor: true });
await visitor.fireToast({ title: "Welcome!", text: "Enjoy your stay" });
await visitor.openIframe({ url: "https://...", width: 400, height: 600 });

// Data persistence
await visitor.fetchDataObject();
await visitor.setDataObject(data, { analytics: [...] });
await visitor.updateDataObject(partialData);

// Inventory (inherited from User)
await visitor.fetchInventoryItems();
await visitor.grantInventoryItem(itemId, quantity);
await visitor.modifyInventoryItemQuantity(itemId, delta);
```

### DroppedAsset

```typescript
// Get existing asset
const asset = await DroppedAsset.get(assetId, urlSlug, { credentials });

// Drop new asset into world
const newAsset = await DroppedAsset.drop(baseAsset, {
  position: { x: 100, y: 200 },
  urlSlug,
  uniqueName: "MyApp_item_123",
  isInteractive: true,
  interactivePublicKey: credentials.interactivePublicKey,
  clickType: DroppedAssetClickType.LINK,
  clickableLink: "https://my-app.com/interact",
  isOpenLinkInDrawer: true,
  layer0: "",           // Background layer URL
  layer1: imageUrl,     // Main image layer URL
});

// Update asset
await asset.updateDroppedAsset({ position: { x, y }, text: "Hello" });
await asset.updateClickType({ clickType: DroppedAssetClickType.WEBHOOK });
await asset.setAssetText("New text");
await asset.deleteDroppedAsset();

// Data persistence
await asset.fetchDataObject();
await asset.setDataObject(data, { lock: { lockId } });
await asset.updateDataObject(partialData);
await asset.incrementDataObjectValue("clicks", 1);
```

### User

```typescript
const user = User.create({ credentials });

// User data
await user.fetchAvatars();
await user.fetchAssets();
await user.fetchScenes();

// Inventory
await user.fetchInventoryItems();
await user.grantInventoryItem(itemId, quantity);

// Data persistence
await user.fetchDataObject();
await user.setDataObject(data);
```

---

## Data Object Pattern

All major classes support data object persistence:

```typescript
// Fetch current data
await entity.fetchDataObject();
console.log(entity.dataObject);

// Set complete data (replaces existing)
await entity.setDataObject({ score: 0, items: [] });

// Update partial data (merges with existing)
await entity.updateDataObject({ score: 100 });

// Atomic increment
await entity.incrementDataObjectValue("score", 10);
```

### Locking for Concurrency

```typescript
// Time-based lock ID prevents conflicts
const lockId = `myApp_${assetId}_${Math.floor(Date.now() / 60000) * 60000}`;

// Acquire lock
await asset.updateDataObject({}, { lock: { lockId } });

// Do operations...

// Release lock
await asset.updateDataObject(
  { lastUpdated: Date.now() },
  { lock: { lockId, releaseLock: true } }
);
```

### Analytics Integration

```typescript
await visitor.updateDataObject(
  { gameComplete: true },
  {
    analytics: [
      {
        analyticName: "completions",
        profileId,
        urlSlug,
        uniqueKey: profileId,
        incrementBy: 1,  // Optional: for increment tracking
      },
    ],
  }
);
```

---

## Type Definitions

### InteractiveCredentials

```typescript
type InteractiveCredentials = {
  apiKey?: string;
  assetId?: string;
  interactiveNonce?: string;
  interactivePublicKey?: string;
  profileId?: string | null;
  urlSlug?: string;
  visitorId?: number;
  iframeId?: string;
  gameEngineId?: string;
};
```

### DroppedAssetClickType

```typescript
enum DroppedAssetClickType {
  NONE = "none",
  LINK = "link",
  PORTAL = "portal",
  TELEPORT = "teleport",
  WEBHOOK = "webhook",
}
```

### WorldActivityType

```typescript
enum WorldActivityType {
  GAME_ON = "gameOn",
  // ... other types
}
```

---

## Error Handling

All SDK methods throw structured errors:

```typescript
try {
  await visitor.moveVisitor({ x: 100, y: 200 });
} catch (error) {
  // Error structure:
  // {
  //   success: false,
  //   status: 401,
  //   message: "Invalid credentials",
  //   method: "PUT",
  //   url: "/api/v1/world/.../visitors/...",
  //   sdkMethod: "Visitor.moveVisitor",
  //   params: { x: 100, y: 200 },
  //   stack: "...",
  //   stackTrace: Error,
  //   data: {}
  // }
}
```

---

## Adding New Features

### New Controller

1. Create `src/controllers/MyController.ts`:

```typescript
import { AxiosResponse } from "axios";
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";
import { MyInterface, MyOptionalInterface } from "interfaces";
import { ResponseType } from "types";

export class MyController extends SDKController implements MyInterface {
  readonly id: string;

  constructor(topia: Topia, id: string, options: MyOptionalInterface = {}) {
    super(topia, options.credentials);
    this.id = id;
    Object.assign(this, options.attributes);
  }

  async fetchData(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/endpoint/${this.id}`,
        this.requestOptions,
      );
      Object.assign(this, response.data);
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "MyController.fetchData" });
    }
  }
}
```

2. Create interface in `src/interfaces/MyInterfaces.ts`
3. Export from `src/controllers/index.ts`
4. Create factory in `src/factories/MyFactory.ts`
5. Export from `src/factories/index.ts`

### New Factory

```typescript
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";
import { MyController } from "controllers/MyController";
import { MyOptionalInterface } from "interfaces";

export class MyFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  create(id: string, options?: MyOptionalInterface): MyController {
    return new MyController(this.topia, id, options);
  }

  async get(id: string, options?: MyOptionalInterface): Promise<MyController> {
    const instance = this.create(id, options);
    await instance.fetchData();
    return instance;
  }
}
```

---

## Testing

```typescript
import MockAdapter from "axios-mock-adapter";
import { Topia } from "controllers/Topia";
import { MyFactory } from "factories/MyFactory";

describe("MyController", () => {
  let mock: MockAdapter;
  let factory: MyFactory;

  beforeEach(() => {
    const topia = new Topia({ apiKey: "test-key" });
    mock = new MockAdapter(topia.axios);
    factory = new MyFactory(topia);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should fetch data", async () => {
    mock.onGet("/api/v1/endpoint/123").reply(200, { id: "123", name: "Test" });

    const instance = await factory.get("123");

    expect(instance.id).toBe("123");
    expect(instance.name).toBe("Test");
  });
});
```

---

## Key Source Paths

| Path | Purpose |
|------|---------|
| `clients/client-topia/src/controllers/SDKController.ts` | Base class with JWT signing |
| `clients/client-topia/src/controllers/Topia.ts` | Root axios client |
| `clients/client-topia/src/controllers/` | All controller classes |
| `clients/client-topia/src/factories/` | All factory classes |
| `clients/client-topia/src/interfaces/` | TypeScript interfaces |
| `clients/client-topia/src/types/` | TypeScript types |
| `clients/client-topia/example.ts` | Usage example |
| `clients/client-topia/rollup.config.js` | Build configuration |

---

## Publishing

**DO NOT PUBLISH TO NPM WITHOUT EXPLICIT APPROVAL.**

Publishing breaking changes to npm will break all existing SDK apps in production. Always:
1. Test changes locally using yalc (see "Local Development with Yalc" above)
2. Get explicit approval from the team lead before publishing
3. Coordinate with all SDK app maintainers for breaking changes
4. Consider backwards compatibility and migration paths

```bash
cd clients/client-topia

# 1. Update version in package.json
# 2. Build and test
yarn build
yarn test

# 3. Generate docs
yarn docs

# 4. Publish to npm (ONLY WITH APPROVAL)
yarn pkg  # Runs: yarn && yarn build && yarn docs && npm publish
```

Package: `@rtsdk/topia` on npm registry.
