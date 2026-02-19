-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "cohort_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "time_spent_seconds" INTEGER NOT NULL DEFAULT 0,
    "score" DECIMAL(5,2),
    "completed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_xp" (
    "user_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_xp_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "xp_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "source_id" TEXT,
    "multiplier" DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon_url" TEXT,
    "criteria" JSONB NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'common',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "user_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("user_id","badge_id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "criteria" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_participants" (
    "user_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_participants_pkey" PRIMARY KEY ("user_id","challenge_id")
);

-- CreateTable
CREATE TABLE "level_configs" (
    "level" INTEGER NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "xp_required" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "level_configs_pkey" PRIMARY KEY ("level")
);

-- CreateTable
CREATE TABLE "fundae_expedients" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "cohort_id" TEXT,
    "empresa_cif" TEXT NOT NULL,
    "empresa_nombre" TEXT NOT NULL,
    "empresa_sector" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "compliance_score" INTEGER NOT NULL DEFAULT 0,
    "validation_errors" JSONB NOT NULL DEFAULT '[]',
    "pdf_url" TEXT,
    "xml_url" TEXT,
    "docente_id" TEXT,
    "total_hours" DECIMAL(5,2) NOT NULL,
    "family_professional" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "validated_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),

    CONSTRAINT "fundae_expedients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expedient_participants" (
    "id" TEXT NOT NULL,
    "expedient_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "attendance_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "meets_threshold" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT,
    "signed_at" TIMESTAMP(3),

    CONSTRAINT "expedient_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fundae_attendance" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "expedient_id" TEXT,
    "total_required_hours" DECIMAL(5,2) NOT NULL,
    "attended_hours" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "attendance_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "method" TEXT NOT NULL DEFAULT 'platform_access',
    "meets_threshold" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fundae_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "attendance_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hours" DECIMAL(5,2) NOT NULL,
    "method" TEXT NOT NULL,
    "verified_by" TEXT,
    "notes" TEXT,
    "is_exception" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docentes" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "certifications" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "docentes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enrollments_tenant_id_user_id_idx" ON "enrollments"("tenant_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_tenant_id_user_id_course_id_key" ON "enrollments"("tenant_id", "user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "progress_tenant_id_user_id_module_id_key" ON "progress"("tenant_id", "user_id", "module_id");

-- CreateIndex
CREATE INDEX "user_xp_tenant_id_total_xp_idx" ON "user_xp"("tenant_id", "total_xp" DESC);

-- CreateIndex
CREATE INDEX "xp_transactions_tenant_id_user_id_created_at_idx" ON "xp_transactions"("tenant_id", "user_id", "created_at");

-- CreateIndex
CREATE INDEX "xp_transactions_tenant_id_created_at_idx" ON "xp_transactions"("tenant_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "badges_tenant_id_name_key" ON "badges"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "user_badges_tenant_id_earned_at_idx" ON "user_badges"("tenant_id", "earned_at");

-- CreateIndex
CREATE INDEX "challenges_tenant_id_status_idx" ON "challenges"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "challenges_tenant_id_start_date_end_date_idx" ON "challenges"("tenant_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "challenge_participants_tenant_id_challenge_id_progress_idx" ON "challenge_participants"("tenant_id", "challenge_id", "progress" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "level_configs_tenant_id_level_key" ON "level_configs"("tenant_id", "level");

-- CreateIndex
CREATE INDEX "fundae_expedients_tenant_id_status_idx" ON "fundae_expedients"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "fundae_expedients_tenant_id_empresa_cif_idx" ON "fundae_expedients"("tenant_id", "empresa_cif");

-- CreateIndex
CREATE UNIQUE INDEX "expedient_participants_expedient_id_user_id_key" ON "expedient_participants"("expedient_id", "user_id");

-- CreateIndex
CREATE INDEX "fundae_attendance_tenant_id_expedient_id_idx" ON "fundae_attendance"("tenant_id", "expedient_id");

-- CreateIndex
CREATE UNIQUE INDEX "fundae_attendance_tenant_id_user_id_course_id_key" ON "fundae_attendance"("tenant_id", "user_id", "course_id");

-- CreateIndex
CREATE INDEX "attendance_records_attendance_id_timestamp_idx" ON "attendance_records"("attendance_id", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "docentes_tenant_id_user_id_key" ON "docentes"("tenant_id", "user_id");

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expedient_participants" ADD CONSTRAINT "expedient_participants_expedient_id_fkey" FOREIGN KEY ("expedient_id") REFERENCES "fundae_expedients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "fundae_attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
