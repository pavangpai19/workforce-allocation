import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(
    NotificationsService.name,
  );

  async notifyManager(data: {
    projectId: string;
    employeeName: string;
    finalScore: number;
    explanation: string;
  }) {
    this.logger.log(`
==============================
MANAGER NOTIFICATION
==============================

Project: ${data.projectId}

Selected Employee:
${data.employeeName}

Final Score:
${(data.finalScore * 100).toFixed(2)}%

Reason:
${data.explanation}
`);
  }

  async notifySelectedEmployee(data: {
    employeeName: string;
    projectId: string;
  }) {
    this.logger.log(`
==============================
EMPLOYEE NOTIFICATION
==============================

Congratulations ${data.employeeName}.

You have been allocated to project:

${data.projectId}

Please check your dashboard for further details.
`);
  }

  async notifyRejectedEmployees(data: {
    selectedEmployeeId: string;
    candidates: {
      employee_id: string;
      employee_name: string;
      final_score: number;
    }[];
  }) {
    const rejected = data.candidates.filter(
      c => c.employee_id !== data.selectedEmployeeId,
    );

    for (const employee of rejected) {
      this.logger.log(`
==============================
REJECTED EMPLOYEE
==============================

Hello ${employee.employee_name},

You were not selected for the current allocation.

Final Score:
${(employee.final_score * 100).toFixed(2)}%

The system recommends improving your skills and recent performance to increase future allocation opportunities.
`);
    }
  }
}