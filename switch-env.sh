#!/bin/bash

# Supabase Environment Switcher
# Usage: ./switch-env.sh [local|remote]

if [ "$1" = "local" ]; then
    echo "🔧 Switching to LOCAL Supabase..."
    
    # Comment out remote Supabase and uncomment local
    sed -i 's|^NEXT_PUBLIC_SUPABASE_URL=https://|#NEXT_PUBLIC_SUPABASE_URL=https://|' .env
    sed -i 's|^NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs|#NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs|' .env
    sed -i 's|^#NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321|NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321|' .env
    sed -i 's|^#NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_|NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_|' .env
    sed -i 's|^#SUPABASE_SERVICE_ROLE_KEY=sb_secret_|SUPABASE_SERVICE_ROLE_KEY=sb_secret_|' .env
    
    echo "✅ Switched to LOCAL Supabase (localhost:54321)"
    
elif [ "$1" = "remote" ]; then
    echo "🌐 Switching to REMOTE Supabase..."
    
    # Comment out local Supabase and uncomment remote
    sed -i 's|^#NEXT_PUBLIC_SUPABASE_URL=https://|NEXT_PUBLIC_SUPABASE_URL=https://|' .env
    sed -i 's|^#NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs|NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs|' .env
    sed -i 's|^NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321|#NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321|' .env
    sed -i 's|^NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_|#NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_|' .env
    sed -i 's|^SUPABASE_SERVICE_ROLE_KEY=sb_secret_|#SUPABASE_SERVICE_ROLE_KEY=sb_secret_|' .env
    
    echo "✅ Switched to REMOTE Supabase (rgwhcytkwxvpzpleylmb.supabase.co)"
    
else
    echo "Usage: $0 [local|remote]"
    echo ""
    echo "local  - Switch to local Supabase instance (localhost:54321)"
    echo "remote - Switch to remote Supabase instance (rgwhcytkwxvpzpleylmb.supabase.co)"
    exit 1
fi

echo ""
echo "� Environment switched successfully!"
echo "📝 Remember to restart your Next.js dev server"