import maintenanceWorkRepository from "../repositories/maintenanceWorkRepository";
import { USER_TYPE, ACTION_TYPES, STATUS_TYPES } from "../common/constants";

/**
 * Service to manage maintenance work related operations
 *
 * @author: Yuvini Sumanasekera
 */
class MaintenanceWorkService {
  static async isMaintenanceInProgress() {
    return await maintenanceWorkRepository.isMaintenanceInProgress();
  }

  static async getMaintenanceSchedule(userType) {
    console.log(`Fetching maintenance schedule for ${userType}S`);
    if (userType == USER_TYPE.ADMIN) {
      return await maintenanceWorkRepository.getMaintenanceScheduleForAdmins();
    }
    return await maintenanceWorkRepository.getMaintenanceScheduleForCustomers();
  }

  static async updateMaintenanceTask(params) {
    console.log(`Updating maintenance task: ${params.taskId}`);
    switch (params.action) {
      case ACTION_TYPES.START:
        params.updatedStatus = STATUS_TYPES.IN_PROGRESS;
        break;
      case ACTION_TYPES.CANCEL:
        params.updatedStatus = STATUS_TYPES.CANCELLED;
        break;
      case ACTION_TYPES.COMPLETE:
        params.updatedStatus = STATUS_TYPES.COMPLETED;
        break;
      default:
        console.log(`Invalid action type ${params.action}`);
        return;
    }
    return await maintenanceWorkRepository.updateMaintenanceTask(params);
  }

  static async createMaintenanceTask(data) {
    console.log(`Creating new maintenance task`);
    return await maintenanceWorkRepository.createMaintenanceTask(data);
  }
}

export default MaintenanceWorkService;
