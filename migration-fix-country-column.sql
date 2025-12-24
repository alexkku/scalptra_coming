-- Fix Country Column Length Issue
-- Run this in Supabase SQL Editor to fix the VARCHAR(2) constraint

-- Step 1: Check current data in country column
SELECT DISTINCT country, LENGTH(country) as length 
FROM waitlist 
WHERE country IS NOT NULL;

-- Step 2: Clean up invalid country data (longer than 2 chars)
UPDATE waitlist 
SET country = NULL 
WHERE country IS NOT NULL 
AND (LENGTH(country) > 2 OR country = 'unknown');

-- Step 3: Alternative - if you want to keep the data, expand the column
-- ALTER TABLE waitlist ALTER COLUMN country TYPE VARCHAR(10);

-- Step 4: Verify the fix
SELECT country, COUNT(*) as count
FROM waitlist 
GROUP BY country 
ORDER BY count DESC;