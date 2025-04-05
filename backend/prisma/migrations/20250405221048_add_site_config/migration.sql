-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "singlePropertyMode" BOOLEAN NOT NULL DEFAULT false,
    "mainPropertyId" TEXT,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);
