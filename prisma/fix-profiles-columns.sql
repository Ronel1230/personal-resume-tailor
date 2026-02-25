-- Run this once to add contact columns to profiles (fix after Option B).
-- Use: npx prisma db execute --file prisma/fix-profiles-columns.sql
-- Or run these in your PostgreSQL client (psql, pgAdmin, etc.)

ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "linkedin" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "github" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "lastCompany" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "university" TEXT;
DROP TABLE IF EXISTS "contact_info";
