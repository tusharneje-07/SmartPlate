# runserver.ps1
# This script runs the Django development server

# Ensure the script stops if any command fails
$ErrorActionPreference = "Stop"

# Run the Django development server
python manage.py runserver