@echo off
REM Simple static file server using Python's http.server module
REM Make sure Python is installed and added to PATH

python -m http.server 3000 --directory public
