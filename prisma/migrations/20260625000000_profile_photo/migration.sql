-- Add optional profile photo (base64 data URL) for the Photo PDF template
ALTER TABLE "profiles" ADD COLUMN "photo" TEXT;
