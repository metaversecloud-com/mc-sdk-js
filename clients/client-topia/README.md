# Javascript RTSDK - Topia Client Library

The Topia Client Library leverages the Topia Public API and allows users to interact with the topia systems and modify their world programmatically. With the SDK you can now build new features to be used in Topia! Check out a few awesome examples [here](https://sdk-examples.metaversecloud.com/).

## Get Started

Run `yarn add @rtsdk/topia` or `npm install @rtsdk/topia`

## Authorization

A Topia provided API Key should be included with every object initialization as a parameter named `apiKey`. This API Key is used to in authorization headers in all calls to the Public API.

## Testing

We use Jest for testing and take advantage of dependency injection to pass mock data into our services.

To run the test suite, please run:

`yarn test`
