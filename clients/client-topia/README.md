# Javascript RTSDK - Topia Client Library

The Topia Client Library leverages the Topia Public API and allows users to interact with the topia systems and modify their world programmatically. With the SDK you can now build new features to be used in Topia! Questions, comments, or have something exciting to share with the Topia team? Reach out to [developers@topia.io](mailto:developers@topia.io)!

## Authorization

A Topia provided API Key can be included with every object initialization as a parameter named `apiKey`. This API Key is used to in authorization headers in all calls to the Public API. Use it wisely and sparingly! The API Key should only be used to authorize your app (and therefore all of it's users) to perform specific actions. In most case the ability to interact with an SDK application should be controlled per user using Interactive Credentials (see below).

### Want to build interactive assets? This is how you can get started:

Getting a Key Pair:

- Navigate directly to your [integrations page](https://topia.io/t/dashboard/integrations) or follow the steps below from within a world.
  - Click on your image (or circle) at the top left of the left hand navbar.
  - Click Edit Profile. This will bring you to a separate dashboard.
  - Click Integrations on the left nav
- Click the “Add Key Pair” button. This is going to be your public / private key pair for your app.

Adding a Key Pair to an asset:

Make an asset “interactive” by adding your PUBLIC key to the integrations page of the asset editor.

- Go back to your world. Make sure you are in “Edit Mode” by toggling on Edit on the left nav bar
- Hover over any asset. Click the pencil icon that should show up on hover and select “Edit”
- Go to the Integrations tab
- At the bottom, you'll see a section that says “Add player session credentials to asset interactions”. Toggle that on. Now webhooks that fire from this asset and iframes that open from this asset will include the following values:
  - assetId
  - interactivePublicKey
  - interactiveNonce
  - visitorId
  - urlSlug
- The above values are included in the query params of the iframe URL as well as payload of the webhook.
- Once you have the above values you can pass them as credentials into the factory classes when creating class instances.

```ts
await DroppedAsset.get(assetId, urlSlug, {
  credentials: {
    interactivePublicKey,
    interactiveNonce,
    visitorId,
  },
});
```

<br />

### Need an API Key to test locally? This is how you can create one:

- Navigate directly to your [integrations page](https://topia.io/t/dashboard/integrations) or follow the steps below from within a world.
  - Click on your image (or circle) at the top left of the left hand navbar.
  - Click Edit Profile. This will bring you to a separate dashboard.
  - Click Integrations on the left nav
- Click Generate New API Key and copy the API Key to be used in your .env and while using https://sdk-examples.metaversecloud.com

Alternatively, visitors of a [topia.io](https://topia.io/) world interact with each other and the interactively configured assets in your world without the need for an API Key. This is all made possible through Interactive Session credentials passed to the SDK with every request, when applicable. What does this mean for you? Not much, actually! All of the magic happens behind the scenes and all you have to do is make sure that new class constructors include an options object like this: `options: WorldOptionalInterface = { attributes: {}, credentials: {} }` and all calls to `this.topia.axios` include the inherited `this.requestOptions` parameter.

![Interactive Application Development Diagram](https://raw.githubusercontent.com/metaversecloud-com/mc-sdk-js/main/clients/client-topia/InteractiveApplicationDevelopment.png)

<br>

<hr/>

# Developers

<hr/>

Need inspiration?! Check out the following applications which utilizes the SDK to create new and enhanced features inside [topia.io](https://topia.io/):

- **TicTacToe:** A turn based multiplayer game built completely on the canvas.
  - [Github](https://github.com/metaversecloud-com/sdk-tictactoe)
  - [Demo](https://topia.io/tictactoe-prod)
- **Quest:** A dynamic hide and seek game where an admin can drop multiple quest items within a world for users to find.
  - [Github](https://github.com/metaversecloud-com/sdk-quest)
  - [Demo](https://topia.io/quest-prod)

<br>

## Get Started

### Boilerplates

We have two boilerplates available to help you get started. Pick the one that best suits your needs, clone it, and let the coding begin!

- [Javascript](https://github.com/metaversecloud-com/sdk-boilerplate)
- [Typescript](https://github.com/metaversecloud-com/sdk-ts-boilerplate)

Run `yarn add @rtsdk/topia` or `npm install @rtsdk/topia`

Create your instance of Topia and instantiate the factories you need:

```js
dotenv.config();
import dotenv from "dotenv";

import { AssetFactory, Topia, DroppedAssetFactory, UserFactory, WorldFactory } from "@rtsdk/topia";

const config = {
  apiDomain: process.env.INSTANCE_DOMAIN || "https://api.topia.io/",
  interactiveKey: process.env.INTERACTIVE_KEY,
  interactiveSecret: process.env.INTERACTIVE_SECRET,
};

const myTopiaInstance = new Topia(config);

const Asset = new AssetFactory(myTopiaInstance);
const DroppedAsset = new DroppedAssetFactory(myTopiaInstance);
const User = new UserFactory(myTopiaInstance);
const World = new WorldFactory(myTopiaInstance);

export { Asset, DroppedAsset, myTopiaInstance, User, World };
```

<br/>

Put it to use:

```js
import { DroppedAsset } from "./pathToAboveCode";

export const getAssetAndDataObject = async (req) => {
  const { assetId, interactiveNonce, interactivePublicKey, urlSlug, visitorId } = req.query;

  const droppedAsset = await DroppedAsset.get(assetId, urlSlug, {
    credentials: {
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    },
  });

  await droppedAsset.fetchDroppedAssetDataObject();
  return droppedAsset;
};
```

## Data Objects

Data Objects can be used to store information such as game state, configurations, themes, and analytics.
There are three types of Data Objects:

- **World:** The World data object should be used to store information unique to your app in a given world but not necessarily specific details about an instance or an active game. This information would persist even if the app was removed from the world.
  - **Example - Update two specific data points:**
    ```js
    await world.updateDataObject({
      [`keyAssets.${keyAssetId}.itemsCollectedByUser.${profileId}`]: { [dateKey]: { count: 1 }, total: 1 },
      [`profileMapper.${profileId}`]: username,
    });
    ```
  - **Example - Increment a specific value within the data object by 1:**
    ```js
    await world.incrementDataObjectValue([`keyAssets.${keyAssetId}.totalItemsCollected.count`], 1);
    ```
- **Dropped Asset:** The Dropped Asset data object should only store what is unique to the specific instance of the app in the world such as game state. If the Dropped Asset is deleted, the data object would be lost as well so be sure to only store information here the doesn't need to persist!
  - **Example - Initialize data object with default data and keyAssetId:**
    ```js
    await droppedAsset.setDataObject(
      {
        ...defaultGameData,
        keyAssetId: droppedAsset.id,
      },
      { lock: { lockId, releaseLock: true } },
    );
    ```
  - **Example - Update lastInteraction date and playerCount:**
    ```js
    await droppedAsset.updateDataObject({ lastInteraction: new Date(), playerCount: playerCount + 1 });
    ```
- **User:** The User data object should be used to store information unique to a user that is NOT unique to a world or instance (dropped asset) of an app.
  - **Example - Update totalMessagesSentCount by a user across all worlds:**
    ```js
    await world.incrementDataObjectValue([`totalMessagesSentCount`], 1);
    ```

### Data Object Locking

All of our data object set, update, and increment methods have an optional lock argument. You can create a lock id using that parameters specific to the action you are taking plus a timestamp so that the lock will expire after a certain amount of time has passed. As an example, TicTacToe allows users to Reset the game board so that they can start a new game but we'd only want the reset to happen once even if the user(s) press the button multiple times. To prevent multiple resets from happening within a 10 second window (stopping the calls from going through and preventing the race condition), we'd lock the object by doing the following:

```js
try {
  await droppedAsset.updateDataObject(
    { isResetInProgress: true },
    {
      lock: { lockId: `${assetId}-${resetCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
    },
  );
} catch (error) {
  return res.status(409).json({ message: "Reset already in progress." });
}
```

Using the code above would also allow us to check if `isResetInProgress === true` and prevent the code from progress immediately. Make sure that when using a lock such as this that you also call `await droppedAsset.updateDataObject({ isResetInProgress: false })};` after all reset functionality has been executed.

**Turn based locking**
Locking data object updates can also be extremely helpful when building a turn based game. As an example, TicTacToe should only allow one user to take a turn at a time. To prevent multiple moves at once we could use the following:

```js
try {
  const timestamp = new Date(Math.round(new Date().getTime() / 5000) * 5000);
  const lockId = `${keyAssetId}-${resetCount}-${turnCount}-${timestamp}`;
  await droppedAsset.updateDataObject({}, { lock: { lockId, releaseLock: false } });
} catch (error) {
  return res.status(409).json({ message: "Move already in progress." });
}
```

Once complete be sure to also call `await keyAsset.updateDataObject({ turnCount: turnCount + 1 });` so that the next player is free to take their turn!

**Custom analytics**
You can leverage the data object methods for all types to track analytics unique to your Public Key by passing `analytics` as an optional array to all calls that set, update, or increment data objects!

```js
await droppedAsset.updateDataObject({ isResetInProgress: true }, { analytics: ["resetCount"], lock: { lockId } });
```

Note: This does NOT impact the data objects themselves but rather allows you to track custom analytics (incremented by 1) across all instances of your application with a given Public Key.

<br>

<hr/>

<br>

# Contributors

<hr/>

<br>

## Get Started

Run `gh repo clone metaversecloud-com/mc-sdk-js`

<br>

## Issues

We've added an Issue template to help standardize Issues and ensure they have enough detail for a developer to start work and help prevent contributors from forgetting to add an important piece of information.

<br>

## Pull Requests

We've added a Pull Request template to help make it easier for developers to clarify what the proposed changes will do. This helps facilitate clear communication between all contributors of the SDK and ensures that we are all on the same page!

<br>

## Documentation

We use [TypeDoc](https://typedoc.org/guides/overview) to convert comments in TypeScript source code into rendered HTML documentation. Comments should be simple and concise and include examples where applicable. Please be sure to add or update comments accordingly!

To update docs run `yarn docs`.

To view docs locally open `mc-sdk-js/clients/client-topia/docs/modules.html` in your browser.

Example of Class comments:

````ts
/**
 * @summary
 * Create an instance of Dropped Asset class with a given dropped asset id, url slug, and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new DroppedAsset(topia, "1giFZb0sQ3X27L7uGyQX", "example", { attributes: { text: "" }, credentials: { assetId: "1giFZb0sQ3X27L7uGyQX" } } });
 * ```
 */
````

Example of method comments

````ts
/**
 * @summary
 * Sets the data object for a dropped asset.
 *
 * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
 *
 * @usage
 * ```ts
 * await droppedAsset.setDroppedAssetDataObject({
 *   "exampleKey": "exampleValue",
 * });
 * const { dataObject } = droppedAsset;
 * ```
 */
````

<br>

## Testing

We use Jest for testing and take advantage of dependency injection to pass mock data into our services.

To run the test suite, please run `yarn test`.

<br><br>
