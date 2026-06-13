@echo off
echo ========================================================
echo       Starting ResearchHub AI Project...
echo ========================================================
echo.

echo [1/2] Starting Backend Server (Spring Boot)...
start "ResearchHub Backend" cmd /k "cd backend && set JAVA_HOME=%CD%\jdk-21.0.2+13 && .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

echo [2/2] Starting Frontend Server (Next.js)...
start "ResearchHub Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo Please wait about 15-20 seconds for them to fully load.
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:8080
echo.
echo Press any key to close this launcher window...
pause >nul
