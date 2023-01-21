export { Topia } from "controllers";
export { AssetFactory, DroppedAssetFactory, UserFactory, VisitorFactory, WorldFactory } from "factories";

process.on("unhandledRejection", (reason: any) => {
  console.error(reason);
  if (reason.data) {
    const { errors } = reason.data;
    if (Array.isArray(errors)) {
      for (const error of errors) {
        console.error(error);
      }
    }
  }
  console.trace();
  console.error(`Please surround your use of the RTSDK with a try/catch block.`);
  process.exit(1);
});

process.on("uncaughtException", function (err) {
  // Handle the error safely
  console.trace(err);
  process.exit(1);
});
