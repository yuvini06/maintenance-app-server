import { Router } from "express";
import maintenanceWorkService from "../services/maintenanceWorkService";

/**
 * API to manage maintenance work related operations
 *
 * @author: Yuvini Sumanasekera
 */
class MaintenanceWorkApi {
  constructor() {
    this.router = new Router({ mergeParams: true });
    this.router.get("/schedule", this.getMaintenanceSchedule);
    this.router.patch("/update/tasks", this.updateMaintenanceTask);
    this.router.post("/create", this.createMaintenanceTask);
  }

  async getMaintenanceSchedule(req, res, next) {
    try {
      const { userType } = req.query;
      const data = await maintenanceWorkService.getMaintenanceSchedule(
        userType
      );
      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async updateMaintenanceTask(req, res, next) {
    try {
      const data = await maintenanceWorkService.updateMaintenanceTask(req.body);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async createMaintenanceTask(req, res, next) {
    try {
      const data = await maintenanceWorkService.createMaintenanceTask(req.body);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
}

export default MaintenanceWorkApi;
