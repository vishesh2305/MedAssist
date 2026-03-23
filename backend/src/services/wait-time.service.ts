import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

export class WaitTimeService {
  /**
   * Submit a wait time report.
   */
  async report(userId: string, hospitalId: string, department: string | undefined, waitMinutes: number) {
    try {
      // Validate hospital exists
      const hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId },
      });

      if (!hospital) {
        throw ApiError.notFound('Hospital not found');
      }

      if (waitMinutes < 0 || waitMinutes > 720) {
        throw ApiError.badRequest('Wait time must be between 0 and 720 minutes');
      }

      const report = await prisma.waitTimeReport.create({
        data: {
          userId,
          hospitalId,
          department,
          waitMinutes,
        },
      });

      logger.info(`Wait time reported: ${waitMinutes}min at hospital ${hospitalId} by user ${userId}`);
      return report;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error submitting wait time report:', error);
      throw ApiError.internal('Failed to submit wait time report');
    }
  }

  /**
   * Get estimated current wait time for a hospital.
   * Uses the average of reports from the last 4 hours.
   */
  async getEstimate(hospitalId: string, department?: string) {
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

    const where: any = {
      hospitalId,
      reportedAt: { gte: fourHoursAgo },
    };

    if (department) {
      where.department = department;
    }

    const reports = await prisma.waitTimeReport.findMany({
      where,
      orderBy: { reportedAt: 'desc' },
    });

    if (reports.length === 0) {
      return {
        hospitalId,
        department: department || 'all',
        estimatedMinutes: null,
        confidence: 'none',
        reportCount: 0,
        message: 'No recent wait time data available for this hospital.',
      };
    }

    // Weighted average: more recent reports have higher weight
    const now = Date.now();
    let weightedSum = 0;
    let totalWeight = 0;

    for (const report of reports) {
      const ageMs = now - report.reportedAt.getTime();
      const ageHours = ageMs / (1000 * 60 * 60);
      const weight = Math.max(0.1, 1 - ageHours / 4); // Linear decay over 4 hours
      weightedSum += report.waitMinutes * weight;
      totalWeight += weight;
    }

    const estimatedMinutes = Math.round(weightedSum / totalWeight);
    let confidence: string;

    if (reports.length >= 5) {
      confidence = 'high';
    } else if (reports.length >= 2) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    return {
      hospitalId,
      department: department || 'all',
      estimatedMinutes,
      confidence,
      reportCount: reports.length,
      lastReportAt: reports[0].reportedAt,
    };
  }

  /**
   * Get historical best times to visit a hospital.
   * Analyzes past reports grouped by hour of day and day of week.
   */
  async getBestTimes(hospitalId: string) {
    // Get reports from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reports = await prisma.waitTimeReport.findMany({
      where: {
        hospitalId,
        reportedAt: { gte: thirtyDaysAgo },
      },
      orderBy: { reportedAt: 'asc' },
    });

    if (reports.length < 5) {
      return {
        hospitalId,
        message: 'Not enough data to determine best times. At least 5 reports are needed.',
        reportCount: reports.length,
        bestTimes: null,
      };
    }

    // Group by hour of day
    const hourlyAvg: Record<number, { total: number; count: number }> = {};
    const dayAvg: Record<number, { total: number; count: number }> = {};

    for (const report of reports) {
      const hour = report.reportedAt.getHours();
      const day = report.reportedAt.getDay();

      if (!hourlyAvg[hour]) hourlyAvg[hour] = { total: 0, count: 0 };
      hourlyAvg[hour].total += report.waitMinutes;
      hourlyAvg[hour].count += 1;

      if (!dayAvg[day]) dayAvg[day] = { total: 0, count: 0 };
      dayAvg[day].total += report.waitMinutes;
      dayAvg[day].count += 1;
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const byHour = Object.entries(hourlyAvg)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        label: `${parseInt(hour).toString().padStart(2, '0')}:00`,
        avgMinutes: Math.round(data.total / data.count),
        reportCount: data.count,
      }))
      .sort((a, b) => a.avgMinutes - b.avgMinutes);

    const byDay = Object.entries(dayAvg)
      .map(([day, data]) => ({
        day: parseInt(day),
        label: dayNames[parseInt(day)],
        avgMinutes: Math.round(data.total / data.count),
        reportCount: data.count,
      }))
      .sort((a, b) => a.avgMinutes - b.avgMinutes);

    return {
      hospitalId,
      reportCount: reports.length,
      periodDays: 30,
      bestTimes: {
        byHour,
        byDay,
        recommendation: byHour.length > 0
          ? `Best time to visit: ${byHour[0].label} (avg ${byHour[0].avgMinutes} min wait)`
          : 'Insufficient data for recommendation',
      },
    };
  }
}

export const waitTimeService = new WaitTimeService();
