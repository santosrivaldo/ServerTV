-- Migration: Initial Schema
-- Description: Create initial database schema for ServerTV
-- Version: 1.0.0
-- Date: 2024-01-01

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE playlist_level AS ENUM ('general', 'region', 'sector', 'store');

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_is_processed ON videos(is_processed);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_playlists_level_value ON playlists(level_value);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_access_tokens_expires_at ON access_tokens(expires_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_access_logs_accessed_at ON access_logs(accessed_at);

-- Create views for reporting
CREATE OR REPLACE VIEW video_stats_summary AS
SELECT 
    v.id,
    v.title,
    v.created_at,
    vs.views_count,
    vs.last_viewed,
    u.username as creator_username
FROM videos v
LEFT JOIN video_stats vs ON v.id = vs.video_id
LEFT JOIN users u ON v.created_by = u.id;

CREATE OR REPLACE VIEW playlist_summary AS
SELECT 
    p.id,
    p.name,
    p.level,
    p.level_value,
    p.is_active,
    COUNT(pv.video_id) as video_count,
    u.username as creator_username
FROM playlists p
LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
LEFT JOIN users u ON p.created_by = u.id
GROUP BY p.id, p.name, p.level, p.level_value, p.is_active, u.username;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_video_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO video_stats (video_id, views_count, last_viewed)
    VALUES (NEW.video_id, 1, NOW())
    ON CONFLICT (video_id) 
    DO UPDATE SET 
        views_count = video_stats.views_count + 1,
        last_viewed = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stats update
CREATE TRIGGER trigger_update_video_stats
    AFTER INSERT ON access_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_video_stats();

-- Create function to clean expired tokens
CREATE OR REPLACE FUNCTION clean_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM access_tokens 
    WHERE expires_at < NOW() AND is_used = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_id INTEGER)
RETURNS TABLE (
    can_view_general BOOLEAN,
    can_view_region BOOLEAN,
    can_view_sector BOOLEAN,
    can_view_store BOOLEAN,
    can_manage_content BOOLEAN,
    can_manage_users BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE WHEN u.role = 'admin' OR u.role = 'manager' THEN true ELSE false END,
        CASE WHEN u.role = 'admin' OR u.role = 'manager' OR u.region IS NOT NULL THEN true ELSE false END,
        CASE WHEN u.role = 'admin' OR u.role = 'manager' OR u.sector IS NOT NULL THEN true ELSE false END,
        CASE WHEN u.role = 'admin' OR u.role = 'manager' OR u.store IS NOT NULL THEN true ELSE false END,
        CASE WHEN u.role = 'admin' OR u.role = 'manager' THEN true ELSE false END,
        CASE WHEN u.role = 'admin' THEN true ELSE false END
    FROM users u
    WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;
