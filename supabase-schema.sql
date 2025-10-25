-- Create the database schema for the Brain application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the brains table
CREATE TABLE IF NOT EXISTS brains (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    voice TEXT,
    style TEXT,
    duration INTEGER DEFAULT 30,
    author TEXT NOT NULL, -- This will store the Clerk user ID
    bookmarked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the session_history table
CREATE TABLE IF NOT EXISTS session_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brain_id UUID REFERENCES brains(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- This will store the Clerk user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_brains_subject ON brains(subject);
CREATE INDEX IF NOT EXISTS idx_brains_topic ON brains(topic);
CREATE INDEX IF NOT EXISTS idx_brains_author ON brains(author);
CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_brain_id ON session_history(brain_id);
CREATE INDEX IF NOT EXISTS idx_session_history_created_at ON session_history(created_at);

-- Create RLS (Row Level Security) policies
ALTER TABLE brains ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Policy for brains table (users can read all brains, but only create/update their own)
CREATE POLICY "Users can view all brains" ON brains FOR SELECT USING (true);
CREATE POLICY "Users can create their own brains" ON brains FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = author);
CREATE POLICY "Users can update their own brains" ON brains FOR UPDATE USING (auth.jwt() ->> 'sub' = author);
CREATE POLICY "Users can delete their own brains" ON brains FOR DELETE USING (auth.jwt() ->> 'sub' = author);

-- Policy for session_history table (users can only access their own sessions)
CREATE POLICY "Users can view their own sessions" ON session_history FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "Users can create their own sessions" ON session_history FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Insert some sample data
INSERT INTO brains (name, subject, topic, voice, style, duration, author) VALUES
('Math Tutor', 'maths', 'Algebra', 'female', 'friendly', 30, 'sample-user-id'),
('Science Explorer', 'science', 'Physics', 'male', 'professional', 45, 'sample-user-id'),
('History Guide', 'history', 'World War II', 'female', 'narrative', 60, 'sample-user-id'),
('Code Mentor', 'coding', 'JavaScript', 'male', 'technical', 40, 'sample-user-id');