@echo off
title OSTLERTECH Komuta Merkezi
cd /d "%~dp0..\.."
echo ============================================
echo   OSTLERTECH KOMUTA MERKEZI baslatiliyor...
echo   Tarayici: http://localhost:4311
echo   Kapatmak icin bu pencereyi kapatin.
echo ============================================
node "%~dp0komuta-server.mjs"
pause
