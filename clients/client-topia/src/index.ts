export { Topia } from "controllers";
export { AssetFactory, DroppedAssetFactory, UserFactory, VisitorFactory, WorldFactory } from "factories";
process.on("unhandledRejection", (reason) => {
  console.error(reason);
  console.trace();
  process.exit(1);
});
process.on("uncaughtException", function (err) {
  // Handle the error safely
  console.trace(err);
  process.exit(1);
});
