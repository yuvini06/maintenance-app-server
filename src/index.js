import express from "express";
import HttpStatus from "http-status-codes";
import bodyParser from "body-parser";
import router from "./routes/index";
import serverConfig from "./config/serverConfiguration";
import maintenanceWorkService from "./services/maintenanceWorkService";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to enable/disable maintenance mode
app.use(async (req, res, next) => {
  const response = await maintenanceWorkService.isMaintenanceInProgress();
  const enableMaintenanceMode = Boolean(response[0].active);
  if (enableMaintenanceMode) {
    console.log("Maintenance mode enabled");
    res.status(HttpStatus.TEMPORARY_REDIRECT);
  } else {
    res.status(HttpStatus.OK);
  }
  next();
});

// Middleware to handle backend API calls
app.use("/api", router);

// Middleware to handle errors
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .send({ message: "Process failure" });
});

const port = serverConfig.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
