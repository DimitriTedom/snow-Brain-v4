-- =====================================================
-- Snow Brain v3 - Complete Supabase Schema
-- =====================================================
--
-- ⚠️  WARNING: This script will DELETE ALL existing data!
-- 
-- This script completely resets the database by:
-- 1. Dropping all existing tables and their data
-- 2. Dropping all existing policies and functions
-- 3. Recreating everything from scratch with sample data
--
-- Only run this on development databases or when you 
-- want to completely reset your production database.
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLEANUP - Drop existing tables and policies
-- =====================================================

-- Drop existing functions first
DROP FUNCTION IF EXISTS get_bookmark_count(UUID);
DROP FUNCTION IF EXISTS is_bookmarked(UUID, TEXT);

-- Drop existing tables (CASCADE will automatically drop all policies, indexes, and constraints)
-- Order matters due to foreign key dependencies
DROP TABLE IF EXISTS session_history CASCADE;
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS brains CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- TABLES
-- =====================================================

-- Users table to track all app users
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- Clerk user ID
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brains table for all learning sessions
CREATE TABLE brains (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    voice TEXT,
    style TEXT,
    duration INTEGER DEFAULT 30,
    author TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User bookmarks - many-to-many relationship between users and brains
CREATE TABLE user_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brain_id UUID NOT NULL REFERENCES brains(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, brain_id) -- Prevent duplicate bookmarks
);

-- Session history to track user interactions with brains
CREATE TABLE session_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brain_id UUID NOT NULL REFERENCES brains(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Brains indexes
CREATE INDEX idx_brains_subject ON brains(subject);
CREATE INDEX idx_brains_topic ON brains(topic);
CREATE INDEX idx_brains_author ON brains(author);
CREATE INDEX idx_brains_created_at ON brains(created_at);

-- User bookmarks indexes
CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_brain_id ON user_bookmarks(brain_id);
CREATE INDEX idx_user_bookmarks_created_at ON user_bookmarks(created_at);

-- Session history indexes
CREATE INDEX idx_session_history_user_id ON session_history(user_id);
CREATE INDEX idx_session_history_brain_id ON session_history(brain_id);
CREATE INDEX idx_session_history_created_at ON session_history(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brains ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can only view their own user record (for profile management)
CREATE POLICY "Users can view their own record" ON users FOR SELECT USING (auth.jwt() ->> 'sub' = id);

-- Users can only insert/update their own record
CREATE POLICY "Users can insert their own record" ON users FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = id);
CREATE POLICY "Users can update their own record" ON users FOR UPDATE USING (auth.jwt() ->> 'sub' = id);

-- Users can delete their own record
CREATE POLICY "Users can delete their own record" ON users FOR DELETE USING (auth.jwt() ->> 'sub' = id);

-- =====================================================
-- BRAINS TABLE POLICIES
-- =====================================================

-- Anyone can view all brains (public content)
CREATE POLICY "Anyone can view all brains" ON brains FOR SELECT USING (true);

-- Users can only create brains as themselves
CREATE POLICY "Users can create their own brains" ON brains FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = author);

-- Brains cannot be updated or deleted once created (immutable content)

-- =====================================================
-- USER BOOKMARKS TABLE POLICIES
-- =====================================================

-- Users can view all bookmarks (for public bookmark counts, etc.)
CREATE POLICY "Users can view all bookmarks" ON user_bookmarks FOR SELECT USING (true);

-- Users can only create their own bookmarks
CREATE POLICY "Users can create their own bookmarks" ON user_bookmarks FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" ON user_bookmarks FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- =====================================================
-- SESSION HISTORY TABLE POLICIES
-- =====================================================

-- Users can only view their own session history
CREATE POLICY "Users can view their own sessions" ON session_history FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

-- Users can only create their own session history
CREATE POLICY "Users can create their own sessions" ON session_history FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);
