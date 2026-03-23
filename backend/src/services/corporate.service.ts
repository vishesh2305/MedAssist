import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

export class CorporateService {
  /**
   * Create a new corporate health program.
   */
  async createProgram(data: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    employeeCount?: number;
    plan?: string;
    features?: string[];
    monthlyFee?: number;
  }) {
    try {
      const program = await prisma.corporateProgram.create({
        data: {
          companyName: data.companyName,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          employeeCount: data.employeeCount,
          plan: data.plan || 'standard',
          features: data.features || [],
          monthlyFee: data.monthlyFee,
          status: 'active',
        },
      });

      logger.info(`Corporate program ${program.id} created for ${data.companyName}`);
      return program;
    } catch (error) {
      logger.error('Error creating corporate program:', error);
      throw ApiError.internal('Failed to create corporate program');
    }
  }

  /**
   * Get a corporate program by ID.
   */
  async getProgram(programId: string) {
    const program = await prisma.corporateProgram.findUnique({
      where: { id: programId },
      include: {
        employees: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!program) {
      throw ApiError.notFound('Corporate program not found');
    }

    return program;
  }

  /**
   * Add an employee to a corporate program.
   */
  async addEmployee(
    programId: string,
    employeeData: {
      name: string;
      email: string;
      department?: string;
      userId?: string;
    }
  ) {
    try {
      const program = await prisma.corporateProgram.findUnique({
        where: { id: programId },
      });

      if (!program) {
        throw ApiError.notFound('Corporate program not found');
      }

      if (program.status !== 'active') {
        throw ApiError.badRequest('Corporate program is not active');
      }

      const employee = await prisma.corporateEmployee.create({
        data: {
          programId,
          name: employeeData.name,
          email: employeeData.email,
          department: employeeData.department,
          userId: employeeData.userId,
          isActive: true,
        },
      });

      // Update employee count
      const count = await prisma.corporateEmployee.count({
        where: { programId, isActive: true },
      });

      await prisma.corporateProgram.update({
        where: { id: programId },
        data: { employeeCount: count },
      });

      logger.info(`Employee ${employee.id} added to program ${programId}`);
      return employee;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error adding employee:', error);
      throw ApiError.internal('Failed to add employee');
    }
  }

  /**
   * Get analytics dashboard for a corporate program.
   */
  async getDashboard(programId: string) {
    const program = await prisma.corporateProgram.findUnique({
      where: { id: programId },
      include: {
        employees: true,
      },
    });

    if (!program) {
      throw ApiError.notFound('Corporate program not found');
    }

    const totalEmployees = program.employees.length;
    const activeEmployees = program.employees.filter((e) => e.isActive).length;
    const linkedAccounts = program.employees.filter((e) => e.userId).length;

    // Aggregate department stats
    const departmentMap: Record<string, number> = {};
    for (const emp of program.employees) {
      const dept = emp.department || 'Unassigned';
      departmentMap[dept] = (departmentMap[dept] || 0) + 1;
    }
    const departments = Object.entries(departmentMap).map(([name, count]) => ({
      name,
      count,
    }));

    // Get consultation/payment stats for linked users
    const linkedUserIds = program.employees
      .filter((e) => e.userId)
      .map((e) => e.userId!);

    let consultationStats = { total: 0, completed: 0, cancelled: 0 };
    let paymentStats = { total: 0, totalAmount: 0 };

    if (linkedUserIds.length > 0) {
      const consultations = await prisma.consultation.findMany({
        where: { userId: { in: linkedUserIds } },
        select: { status: true },
      });

      consultationStats = {
        total: consultations.length,
        completed: consultations.filter((c) => c.status === 'COMPLETED').length,
        cancelled: consultations.filter((c) => c.status === 'CANCELLED').length,
      };

      const payments = await prisma.payment.findMany({
        where: { userId: { in: linkedUserIds }, status: 'COMPLETED' },
        select: { amount: true },
      });

      paymentStats = {
        total: payments.length,
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      };
    }

    return {
      program: {
        id: program.id,
        companyName: program.companyName,
        plan: program.plan,
        status: program.status,
        monthlyFee: program.monthlyFee,
      },
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: totalEmployees - activeEmployees,
        linkedAccounts,
        departments,
      },
      consultations: consultationStats,
      payments: paymentStats,
    };
  }

  /**
   * Get locations/activity of employees (those with linked user accounts).
   */
  async getEmployeeLocations(programId: string) {
    const program = await prisma.corporateProgram.findUnique({
      where: { id: programId },
      include: {
        employees: {
          where: { isActive: true, userId: { not: null } },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                travelStatus: true,
              },
            },
          },
        },
      },
    });

    if (!program) {
      throw ApiError.notFound('Corporate program not found');
    }

    const employees = program.employees.map((emp) => ({
      employeeId: emp.id,
      name: emp.name,
      department: emp.department,
      linkedUser: emp.user
        ? {
            userId: emp.user.id,
            name: `${emp.user.firstName} ${emp.user.lastName}`,
            travelStatus: emp.user.travelStatus,
          }
        : null,
    }));

    return {
      programId,
      companyName: program.companyName,
      employees,
    };
  }
}

export const corporateService = new CorporateService();
