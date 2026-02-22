-- CreateTable
CREATE TABLE "contact_info" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "lastCompany" TEXT,
    "university" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- Insert default row so we have a singleton
INSERT INTO "contact_info" ("id", "updatedAt") VALUES ('default', NOW());
