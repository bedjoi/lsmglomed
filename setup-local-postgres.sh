#!/bin/bash

echo "🐘 Installation et configuration de PostgreSQL local..."

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "📦 Installation de PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
else
    echo "✅ PostgreSQL déjà installé"
fi

# Démarrer le service PostgreSQL
echo "🚀 Démarrage du service PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer un utilisateur et une base de données
echo "👤 Configuration de l'utilisateur et de la base de données..."

# Créer l'utilisateur bedjo avec mot de passe
sudo -u postgres psql -c "CREATE USER bedjo WITH PASSWORD 'gda123';" 2>/dev/null || echo "Utilisateur bedjo existe déjà"

# Donner les privilèges de création de base de données
sudo -u postgres psql -c "ALTER USER bedjo CREATEDB;"

# Créer la base de données glomed
sudo -u postgres psql -c "CREATE DATABASE glomed OWNER bedjo;" 2>/dev/null || echo "Base de données glomed existe déjà"

# Donner tous les privilèges sur la base
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE glomed TO bedjo;"

echo "✅ Configuration PostgreSQL terminée !"
echo ""
echo "📋 Informations de connexion :"
echo "Host: localhost"
echo "Port: 5432"
echo "Database: glomed"
echo "Username: bedjo"
echo "Password: gda123"
echo ""
echo "🔗 URL de connexion :"
echo "postgresql://bedjo:gda123@localhost:5432/glomed"