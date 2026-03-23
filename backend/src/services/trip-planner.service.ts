import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { getEmergencyNumbersForCountry } from '../data/emergency-numbers';
import { getVaccinationsForCountry } from '../data/vaccination-requirements';

/**
 * Health checklist items by category.
 * Tailored per destination risk profile.
 */
const baseChecklist = [
  { category: 'Before Travel', item: 'Visit your doctor for a travel health consultation', priority: 'high' },
  { category: 'Before Travel', item: 'Check passport validity (min 6 months)', priority: 'high' },
  { category: 'Before Travel', item: 'Get required vaccinations', priority: 'high' },
  { category: 'Before Travel', item: 'Purchase travel health insurance', priority: 'high' },
  { category: 'Before Travel', item: 'Pack a travel medical kit', priority: 'medium' },
  { category: 'Before Travel', item: 'Research local healthcare facilities at destination', priority: 'medium' },
  { category: 'Before Travel', item: 'Register with your embassy', priority: 'low' },
  { category: 'Medications', item: 'Carry prescription medications in original containers', priority: 'high' },
  { category: 'Medications', item: 'Bring copies of prescriptions', priority: 'high' },
  { category: 'Medications', item: 'Pack extra supply of regular medications', priority: 'high' },
  { category: 'Medications', item: 'Include basic OTC medicines (painkillers, antihistamines, antidiarrheal)', priority: 'medium' },
  { category: 'Documents', item: 'Carry medical ID/passport', priority: 'high' },
  { category: 'Documents', item: 'Keep digital copies of insurance cards', priority: 'high' },
  { category: 'Documents', item: 'Store emergency contacts in phone', priority: 'high' },
  { category: 'Documents', item: 'Keep vaccination records accessible', priority: 'medium' },
  { category: 'On Arrival', item: 'Note location of nearest hospital', priority: 'medium' },
  { category: 'On Arrival', item: 'Save local emergency numbers in phone', priority: 'high' },
  { category: 'On Arrival', item: 'Learn basic health phrases in local language', priority: 'low' },
];

const tropicalExtras = [
  { category: 'Before Travel', item: 'Start malaria prophylaxis as prescribed', priority: 'high' },
  { category: 'Before Travel', item: 'Pack insect repellent (DEET-based)', priority: 'high' },
  { category: 'During Stay', item: 'Use mosquito nets at night', priority: 'high' },
  { category: 'During Stay', item: 'Wear long sleeves at dawn/dusk', priority: 'medium' },
  { category: 'During Stay', item: 'Only drink bottled or purified water', priority: 'high' },
  { category: 'During Stay', item: 'Avoid ice from unknown sources', priority: 'medium' },
  { category: 'During Stay', item: 'Eat thoroughly cooked food', priority: 'high' },
  { category: 'During Stay', item: 'Carry oral rehydration salts', priority: 'medium' },
];

const highAltitudeExtras = [
  { category: 'Before Travel', item: 'Consult doctor about altitude sickness prevention', priority: 'high' },
  { category: 'During Stay', item: 'Acclimatize gradually (ascend no more than 500m/day above 3000m)', priority: 'high' },
  { category: 'During Stay', item: 'Stay hydrated (3-4 liters daily)', priority: 'high' },
  { category: 'Medications', item: 'Carry Acetazolamide (Diamox) if prescribed', priority: 'medium' },
];

// Countries with tropical disease risk
const tropicalCountries = new Set([
  'TH', 'VN', 'KH', 'MM', 'LA', 'ID', 'PH', 'MY', 'IN', 'BD', 'LK', 'NP',
  'KE', 'TZ', 'NG', 'GH', 'ET', 'UG', 'RW', 'SN', 'CM', 'CI', 'MG',
  'BR', 'CO', 'PE', 'EC', 'BO', 'VE', 'CR', 'PA', 'GT', 'HN',
  'PG', 'FJ',
]);

// Countries with high altitude destinations
const highAltitudeCountries = new Set([
  'NP', 'PE', 'BO', 'EC', 'CO', 'ET', 'KE', 'TZ', 'CN', 'IN',
]);

/**
 * Generic health alerts per region. In production, these would come from WHO RSS/API.
 */
function getStaticHealthAlerts(countryCode: string) {
  const alerts: Array<{ level: string; title: string; description: string; source: string }> = [];
  const code = countryCode.toUpperCase();

  // Tropical disease alerts
  if (tropicalCountries.has(code)) {
    alerts.push({
      level: 'advisory',
      title: 'Mosquito-borne Disease Risk',
      description: 'Risk of dengue fever, malaria, and/or Zika virus. Use insect repellent and protective clothing.',
      source: 'WHO',
    });
  }

  // General food/water advisory for developing nations
  const foodWaterRisk = new Set([
    'IN', 'BD', 'NP', 'PK', 'KH', 'MM', 'LA', 'VN', 'EG', 'NG', 'ET',
    'KE', 'TZ', 'UG', 'GH', 'SN', 'BO', 'PE',
  ]);
  if (foodWaterRisk.has(code)) {
    alerts.push({
      level: 'advisory',
      title: 'Food and Water Safety',
      description: 'Drink only bottled or boiled water. Avoid raw/uncooked food from street vendors.',
      source: 'CDC',
    });
  }

  // High altitude warning
  if (highAltitudeCountries.has(code)) {
    alerts.push({
      level: 'info',
      title: 'High Altitude Risk',
      description: 'Some destinations are at high altitude. Risk of altitude sickness above 2500m.',
      source: 'WHO',
    });
  }

  return alerts;
}

export class TripPlannerService {
  /**
   * Create a new trip plan with auto-generated health data.
   */
  async create(
    userId: string,
    destination: string,
    destinationCode: string | undefined,
    startDate: Date,
    endDate: Date,
    notes?: string
  ) {
    try {
      const code = destinationCode?.toUpperCase();

      // Auto-generate health data if country code provided
      let checklist: any = undefined;
      let vaccinations: any = undefined;
      let emergencyNumbersData: any = undefined;
      let healthAlerts: any = undefined;

      if (code) {
        checklist = this.generateChecklist(code);
        vaccinations = getVaccinationsForCountry(code);
        emergencyNumbersData = getEmergencyNumbersForCountry(code);
        healthAlerts = getStaticHealthAlerts(code);
      }

      const tripPlan = await prisma.tripPlan.create({
        data: {
          userId,
          destination,
          destinationCode: code,
          startDate,
          endDate,
          checklist,
          vaccinations,
          emergencyNumbers: emergencyNumbersData,
          healthAlerts,
          notes,
        },
      });

      logger.info(`Trip plan ${tripPlan.id} created for user ${userId}`);
      return tripPlan;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating trip plan:', error);
      throw ApiError.internal('Failed to create trip plan');
    }
  }

  /**
   * Generate a health checklist tailored to the destination.
   */
  generateChecklist(destinationCode: string) {
    const code = destinationCode.toUpperCase();
    const items = [...baseChecklist];

    if (tropicalCountries.has(code)) {
      items.push(...tropicalExtras);
    }

    if (highAltitudeCountries.has(code)) {
      items.push(...highAltitudeExtras);
    }

    return items;
  }

  /**
   * Get vaccination requirements for a destination.
   */
  getVaccinationRequirements(destinationCode: string) {
    return getVaccinationsForCountry(destinationCode);
  }

  /**
   * Get local emergency numbers.
   */
  getEmergencyNumbers(destinationCode: string) {
    return getEmergencyNumbersForCountry(destinationCode);
  }

  /**
   * Get health alerts for a destination.
   */
  getHealthAlerts(destinationCode: string) {
    return getStaticHealthAlerts(destinationCode);
  }

  /**
   * Get trip plans for a user.
   */
  async getByUserId(userId: string) {
    return prisma.tripPlan.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * Get a specific trip plan by ID.
   */
  async getById(id: string, userId: string) {
    const plan = await prisma.tripPlan.findFirst({
      where: { id, userId },
    });

    if (!plan) {
      throw ApiError.notFound('Trip plan not found');
    }

    return plan;
  }

  /**
   * Delete a trip plan.
   */
  async delete(id: string, userId: string) {
    const plan = await prisma.tripPlan.findFirst({
      where: { id, userId },
    });

    if (!plan) {
      throw ApiError.notFound('Trip plan not found');
    }

    await prisma.tripPlan.delete({ where: { id } });
    logger.info(`Trip plan ${id} deleted for user ${userId}`);
    return { success: true };
  }
}

export const tripPlannerService = new TripPlannerService();
