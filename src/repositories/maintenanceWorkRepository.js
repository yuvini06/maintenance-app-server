import { executeQuery, getConnection } from "../config/databaseConfiguration";
import { ACTION_TYPES } from "../common/constants";

/**
 * Handle maintenance work related database operations
 *
 * @author: Yuvini Sumanasekera
 */
class MaintenanceWorkRepository {
  static async isMaintenanceInProgress() {
    return await executeQuery(
      `SELECT active FROM process_status_info WHERE task_type="MAINTENANCE"`
    );
  }

  static async getMaintenanceScheduleForAdmins() {
    return await executeQuery(`SELECT *, CASE WHEN status not in ('CANCELLED', 'COMPLETED') 
        THEN true ELSE false END AS action FROM maintenance_work order by task_id desc`);
  }

  static async getMaintenanceScheduleForCustomers() {
    return await executeQuery(`select task_id, planned_start_time, planned_end_time, status from 
        maintenance_work where status not in ('CANCELLED', 'COMPLETED') order by task_id asc`);
  }

  static async updateMaintenanceTask(params) {
    const { taskId, actualStartTime, actualEndTime, newState, action } = params;

    // Execute as a transaction to ensure ACID
    let connection = null;
    try {
      connection = await getConnection();
      await connection.beginTransaction();

      // Update maintenance task
      const result = await connection.query(
        `UPDATE maintenance_work SET actual_start_time=?, actual_end_time=?, status=? WHERE task_id=?`,
        [actualStartTime, actualEndTime, newState, taskId]
      );

      // Activate/deactivate maintenance flag only if maintenance task update was successful
      if (result[0].affectedRows) {
        const active = action === ACTION_TYPES.START ? 1 : 0; // Get flag state
        await connection.query(
          `UPDATE process_status_info SET active=? WHERE task_type="MAINTENANCE"`,
          [active]
        );
      }
      await connection.commit();
    } catch (error) {
      if (connection) {
        console.error(`Error occurred while updating maintenance task: ${taskId}. Rolling back changes...`, error);
        await connection.rollback();
      } 
      throw error;
    } finally {
      if (connection) await connection.release();
    }
  }

  static async createMaintenanceTask(params) {
    const { startTime, endTime, risk, changeSet, assignee, comments } = params;
    return await executeQuery(
      `INSERT INTO maintenance_work
        (planned_start_time, planned_end_time, actual_start_time, actual_end_time, status, risk, assignee, change_set, comments)
        VALUES(?, ?, ?, ?, "PENDING", ?, ?, ?, ?)`,
      [
        startTime,
        endTime,
        startTime,
        endTime,
        risk,
        assignee,
        changeSet,
        comments,
      ]
    );
  }
}

export default MaintenanceWorkRepository;
