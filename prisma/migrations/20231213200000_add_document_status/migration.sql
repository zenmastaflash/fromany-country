-- AlterTable
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active';