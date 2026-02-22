-- Add per-profile contact info columns to profiles (keeps existing profile data)
ALTER TABLE "profiles" ADD COLUMN "phone" TEXT;
ALTER TABLE "profiles" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "profiles" ADD COLUMN "github" TEXT;
ALTER TABLE "profiles" ADD COLUMN "lastCompany" TEXT;
ALTER TABLE "profiles" ADD COLUMN "university" TEXT;

-- Remove global contact_info table if it existed (contact info is now on each profile)
DROP TABLE IF EXISTS "contact_info";
