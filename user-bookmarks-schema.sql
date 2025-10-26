-- Create user_bookmarks table for proper bookmark functionality
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    brain_id UUID REFERENCES brains(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, brain_id) -- Prevent duplicate bookmarks
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_brain_id ON user_bookmarks(brain_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_created_at ON user_bookmarks(created_at);

-- Enable RLS for user_bookmarks table
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_bookmarks (users can only access their own bookmarks)
CREATE POLICY "Users can view their own bookmarks" ON user_bookmarks FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "Users can create their own bookmarks" ON user_bookmarks FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON user_bookmarks FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);