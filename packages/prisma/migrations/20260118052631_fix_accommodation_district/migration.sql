-- Fix accommodations table schema
-- Rename location to district and add new optional location column

-- Step 1: Rename existing location column to district
ALTER TABLE "accommodations" RENAME COLUMN "location" TO "district";

-- Step 2: Add new optional location column for detailed addresses
ALTER TABLE "accommodations" ADD COLUMN "location" TEXT;

-- Step 3: Add images column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'accommodations' AND column_name = 'images'
    ) THEN
        ALTER TABLE "accommodations" ADD COLUMN "images" TEXT[];
    END IF;
END $$;
