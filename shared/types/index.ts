/**
 * ThePower LMS - Shared Types
 * Multi-tenant aware type definitions
 */

// ============ BASE TYPES ============

export interface TenantAware {
  tenantId: string;
}

export interface Auditable {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface SoftDeletable {
  deletedAt?: Date;
  deletedBy?: string;
}

// ============ TENANT ============

export interface Tenant extends Auditable {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  cif?: string; // For FUNDAE
  sector?: string;
  branding: TenantBranding;
  featureFlags: FeatureFlags;
  gamificationConfig: GamificationConfig;
  notificationConfig: NotificationConfig;
}

export interface TenantBranding {
  logoUrl?: string;
  primaryColor: string; // #1e3740
  secondaryColor: string; // #a1e6c5
  accentColor: string; // #98d3b6
  fontFamily: string; // Poppins
  emailTemplates?: Record<string, string>;
}

export interface FeatureFlags {
  leaderboard: boolean;
  challenges: boolean;
  hrisSync: boolean;
  fundae: boolean;
  advancedExports: boolean;
  ltiIntegration: boolean;
  xapiTracking: boolean;
}

export interface GamificationConfig {
  enabled: boolean;
  leaderboardScopes: LeaderboardScope[];
  optOutEnabled: boolean;
  xpRules: XpRules;
  antiCheatEnabled: boolean;
  dailyXpLimit?: number;
}

export interface NotificationConfig {
  quietHoursStart?: string; // HH:MM
  quietHoursEnd?: string;
  weeklyNotificationCap?: number;
  channels: NotificationChannel[];
}

// ============ USER & RBAC ============

export interface User extends TenantAware, Auditable, SoftDeletable {
  id: string;
  email: string;
  dni?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  status: UserStatus;
  department?: string;
  manager?: string;
  roles: Role[];
  preferences: UserPreferences;
}

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface Role extends TenantAware {
  id: string;
  name: RoleName;
  permissions: Permission[];
  isCustom: boolean;
}

export type RoleName = 
  | 'alumno' 
  | 'manager' 
  | 'docente' 
  | 'ld_manager' 
  | 'admin' 
  | 'c_level';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  hideFromLeaderboard: boolean;
  muteSounds: boolean;
  emailNotifications: boolean;
}

// ============ COURSE & CONTENT ============

export interface Course extends TenantAware, Auditable {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  hours: number;
  level: CourseLevel;
  familyProfessional?: string; // FUNDAE
  status: CourseStatus;
  version: number;
  fundaeCompatible: boolean;
  tags: string[];
  modules: Module[];
}

export type CourseLevel = 'basico' | 'intermedio' | 'avanzado';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: ModuleType;
  contentUrl?: string;
  durationMinutes: number;
  orderIndex: number;
  isMandatory: boolean;
  xpReward: number;
}

export type ModuleType = 'video' | 'pdf' | 'text' | 'quiz' | 'scorm' | 'lti';

export interface Quiz extends Module {
  type: 'quiz';
  questions: Question[];
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // minutes
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'open';
  options?: QuestionOption[];
  correctAnswer: string | string[];
  points: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// ============ ENROLLMENT ============

export interface Enrollment extends TenantAware, Auditable {
  id: string;
  userId: string;
  courseId: string;
  cohortId?: string;
  status: EnrollmentStatus;
  assignedAt: Date;
  deadline?: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // 0-100
}

export type EnrollmentStatus = 
  | 'assigned' 
  | 'in_progress' 
  | 'completed' 
  | 'expired' 
  | 'cancelled';

export interface Cohort extends TenantAware, Auditable {
  id: string;
  name: string;
  courseId: string;
  startDate: Date;
  endDate?: Date;
  maxParticipants?: number;
  docenteId?: string;
}

// ============ PROGRESS ============

export interface Progress extends TenantAware {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  status: ProgressStatus;
  timeSpentSeconds: number;
  score?: number;
  attempts: number;
  completedAt?: Date;
  updatedAt: Date;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

// ============ GAMIFICATION ============

export interface UserXp extends TenantAware {
  userId: string;
  totalXp: number;
  currentLevel: number;
  levelName: string;
  xpToNextLevel: number;
  updatedAt: Date;
}

export interface XpTransaction extends TenantAware {
  id: string;
  userId: string;
  amount: number;
  source: XpSource;
  sourceId?: string;
  multiplier: number;
  createdAt: Date;
}

export type XpSource = 
  | 'module_complete' 
  | 'course_complete' 
  | 'quiz_pass' 
  | 'challenge' 
  | 'streak' 
  | 'bonus';

export interface XpRules {
  moduleComplete: number;
  courseComplete: number;
  quizPass: number;
  perfectQuiz: number;
  dailyStreak: number;
  weeklyChallenge: number;
}

export interface Badge extends TenantAware {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: BadgeCriteria;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface BadgeCriteria {
  type: 'courses_completed' | 'xp_earned' | 'streak' | 'perfect_quiz' | 'custom';
  threshold: number;
  conditions?: Record<string, unknown>;
}

export interface UserBadge extends TenantAware {
  userId: string;
  badgeId: string;
  earnedAt: Date;
  shared: boolean;
}

export interface Challenge extends TenantAware, Auditable {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'bonus' | 'special';
  startDate: Date;
  endDate: Date;
  xpReward: number;
  criteria: ChallengeCriteria;
  status: 'upcoming' | 'active' | 'ended';
}

export interface ChallengeCriteria {
  type: 'complete_modules' | 'earn_xp' | 'complete_courses' | 'perfect_quizzes';
  target: number;
  courseIds?: string[];
}

export type LeaderboardScope = 'global' | 'department' | 'team' | 'course' | 'challenge';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  isCurrentUser: boolean;
}

// ============ CERTIFICATES ============

export interface Certificate extends TenantAware, Auditable {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId?: string;
  templateId?: string;
  issuedAt: Date;
  verificationCode: string;
  verificationUrl: string;
  pdfUrl?: string;
}

// ============ FUNDAE ============

export interface FundaeExpedient extends TenantAware, Auditable {
  id: string;
  courseId: string;
  cohortId?: string;
  empresaCif: string;
  empresaNombre: string;
  status: ExpedientStatus;
  complianceScore: number; // 0-100
  validationErrors: ValidationError[];
  pdfUrl?: string;
  xmlUrl?: string;
  validatedAt?: Date;
  participants: FundaeParticipant[];
}

export type ExpedientStatus = 
  | 'draft' 
  | 'validated' 
  | 'submitted' 
  | 'approved' 
  | 'rejected';

export interface FundaeParticipant {
  userId: string;
  dni: string;
  fullName: string;
  attendancePercentage: number;
  meetsThreshold: boolean;
  signature?: string;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  severity: 'error' | 'warning';
}

export interface FundaeAttendance extends TenantAware {
  id: string;
  userId: string;
  courseId: string;
  expedientId?: string;
  totalRequiredHours: number;
  attendedHours: number;
  attendancePercentage: number;
  method: AttendanceMethod;
  meetsThreshold: boolean;
  records: AttendanceRecord[];
  updatedAt: Date;
}

export type AttendanceMethod = 'platform_access' | 'qr' | 'biometric';

export interface AttendanceRecord {
  timestamp: Date;
  hours: number;
  method: AttendanceMethod;
  verifiedBy?: string;
  notes?: string;
}

export interface Docente extends TenantAware, Auditable {
  userId: string;
  certifications: DocenteCertification[];
  specialties: string[];
  assignedCourses: string[];
}

export interface DocenteCertification {
  name: string;
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  documentUrl?: string;
}

// ============ NOTIFICATIONS ============

export type NotificationChannel = 'email' | 'slack' | 'teams' | 'push';

export interface Notification extends TenantAware {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  createdAt: Date;
}

export type NotificationType = 
  | 'enrollment_assigned'
  | 'deadline_reminder'
  | 'course_completed'
  | 'certificate_issued'
  | 'xp_earned'
  | 'level_up'
  | 'badge_earned'
  | 'challenge_started'
  | 'attendance_warning';

// ============ AUDIT ============

export interface AuditLog extends TenantAware {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// ============ API TYPES ============

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  totalCount?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
