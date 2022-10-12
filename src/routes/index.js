import { Router } from "express";
import HttpStatus from "http-status-codes";
import MaintenanceWorkApi from "./maintenanceWorkApi";

/**
 * Route definitions
 *
 * @author: Yuvini Sumanasekera

 */
const router = Router();

router.get("/health", (req, res, next) => {
  res.status(HttpStatus.OK).send("Server health check passed");
});

router.get("/charts/headers", (req, res, next) => {
  res.json([
    { pieChartHeader: "Top Products" },
    { bubbleChartHeader: "Sales Growth" },
    { barChartHeader: "Sales By Age" },
    { donutChartHeader: "Sales By Customer" },
  ]);
  console.log("Fetched chart headers");
});

const maintenanceWorkApi = new MaintenanceWorkApi();
router.use("/maintenance-work", maintenanceWorkApi.router);

export default router;
