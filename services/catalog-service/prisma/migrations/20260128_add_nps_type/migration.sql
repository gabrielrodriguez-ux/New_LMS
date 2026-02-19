-- Add 'nps' to the allowed content types in the check constraint
ALTER TABLE contents DROP CONSTRAINT IF EXISTS modules_type_check;

ALTER TABLE contents ADD CONSTRAINT modules_type_check 
CHECK (type IN ('video', 'audio', 'text', 'quiz', 'scorm', 'lti', 'nps'));
