#!/bin/bash
echo "=========================================="
echo "Starting Faculty Portal System"
echo "=========================================="

# Start MongoDB
echo "1. Starting MongoDB service..."
sudo systemctl start mongod
sleep 2

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "Warning: MongoDB might not be running properly"
    echo "Starting MongoDB manually..."
    sudo mongod --fork --logpath /var/log/mongodb.log --dbpath /var/lib/mongodb
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "2. Installing dependencies..."
    npm install
fi

# Seed database if not already seeded
echo "3. Checking database..."
if ! mongo faculty_portal --eval "db.faculty.count()" | grep -q "[0-9]"; then
    echo "Seeding database with sample data..."
    npm run seed
else
    echo "Database already contains data, skipping seed."
fi

echo "4. Starting the application..."
echo "Server will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo "=========================================="
npm start
