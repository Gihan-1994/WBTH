-- Migration: Rename 'location' column to 'district' in accommodations table
-- This reflects that the field represents Sri Lankan districts, not generic locations

ALTER TABLE accommodations 
RENAME COLUMN location TO district;
