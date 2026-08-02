$ErrorActionPreference = "Stop"

# 1. Academic Calendar and Korlas Features
git add app/Http/Controllers/*Academic*.php app/Http/Controllers/Admin/ app/Http/Controllers/Korlas/ app/Models/Academic*.php app/Models/Classroom.php app/Models/ClassCollection.php app/Models/CollectionDetail.php app/Models/Student.php database/migrations/*academic*.php database/migrations/*classrooms*.php database/migrations/*class_collections*.php database/migrations/*collection_details*.php database/migrations/*make_korlas_id_nullable*.php database/seeders/AcademicCalendarSeeder.php database/seeders/ClassroomSeeder.php docs/kalender-pendidikan-2026-2027.md resources/js/pages/academic-calendars/ resources/js/pages/admin/ resources/js/pages/korlas/ resources/js/components/dashboard/KorlasDashboard.tsx resources/js/pages/public/AcademicCalendar.tsx routes/web.php app/Http/Controllers/DashboardController.php resources/js/pages/Dashboard.tsx
git commit -m "feat: add academic calendar and korlas classroom features"

# 2. Global Alert Manager and Flash Messages
git add app/Helpers/Alert.php resources/js/components/GlobalAlertModal.tsx resources/js/utils/alertManager.ts resources/js/components/FlashMessage.tsx app/Http/Middleware/HandleInertiaRequests.php
git rm --cached resources/js/utils/confirmToast.tsx 2>$null
git commit -m "feat: implement global alert manager and flash messages"

# 3. Settings & Google Sheets Export
git add app/Http/Controllers/SettingController.php config/services.php app/Http/Controllers/TransactionController.php
git commit -m "feat: add application settings and google sheets export integration"

# 4. WhatsApp Share & Meeting UI
git add app/Http/Controllers/MeetingController.php resources/js/pages/meetings/Index.tsx
git commit -m "feat: add whatsapp share feature and update meeting UI"

# 5. Transactions UI Revert
git add resources/js/pages/transactions/Index.tsx
git commit -m "refactor: revert transactions UI to table layout"

# 6. Home Page Redesign
git add app/Http/Controllers/HomeController.php resources/js/pages/public/Home.tsx app/Models/ProgramActivity.php
git commit -m "feat: redesign home hero section with upcoming sessions"

# 7. Organization Page Updates
git add resources/js/pages/public/Organization.tsx database/seeders/RolePermissionSeeder.php resources/images/komite/*.jpeg resources/images/komite/*.jpg docs/Organization.md
git commit -m "feat: update organization members and UI"

# 8. Remaining generic updates
git add .
git commit -m "chore: update dependencies and system configurations"

Write-Host "All commits created successfully!"
