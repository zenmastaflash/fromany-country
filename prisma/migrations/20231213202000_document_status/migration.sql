-- Drop existing constraint if it exists
ALTER TABLE IF EXISTS "Document" DROP CONSTRAINT IF EXISTS "Document_userId_fkey";

-- Drop table if it exists
DROP TABLE IF EXISTS "Document";

-- Create Document table
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT DEFAULT 'OTHER',
    "status" TEXT DEFAULT 'active',
    "number" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "issuingCountry" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "metadata" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sharedWith" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;