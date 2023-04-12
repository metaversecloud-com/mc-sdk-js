export { Topia } from "controllers";
export {
  AssetFactory,
  DroppedAssetFactory,
  SceneFactory,
  UserFactory,
  VisitorFactory,
  WorldActivityFactory,
  WorldFactory,
} from "factories";

Error.stackTraceLimit = 20;
process.on("unhandledRejection", (reason: any) => {
  if (reason && reason.data) {
    const { errors } = reason.data;
    if (Array.isArray(errors)) {
      for (const error of errors) {
        console.error(error);
      }
    }
  } else {
    console.error("Unhandled rejection failed with no defined reason.");
  }
  console.error(reason?.stack || "no stack");
  if (reason && reason.stack) delete reason.stack;
  console.error(reason);
  console.error(`Please surround your use of the RTSDK with a try/catch block.`);
  process.exit(1);
});

process.on("uncaughtException", function (err) {
  // Handle the error safely
  console.trace(err);
  process.exit(1);
});
