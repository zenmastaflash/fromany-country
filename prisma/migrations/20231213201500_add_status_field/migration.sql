-- CreateEnum
CREATE TYPE IF NOT EXISTS "DocumentType" AS ENUM ('PASSPORT', 'VISA', 'TAX_RETURN', 'DRIVERS_LICENSE', 'RESIDENCY_PERMIT', 'BANK_STATEMENT', 'INSURANCE', 'OTHER');

-- CreateTable
CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'OTHER',
    "status" TEXT DEFAULT 'active',
    "number" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "issuingCountry" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "metadata" JSONB,
    "tags" TEXT[],
    "sharedWith" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;