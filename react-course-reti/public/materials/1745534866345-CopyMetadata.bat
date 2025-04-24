@echo off
:: Prompt the user for the source file path
set /p sourceFilePath=Please enter the source file path: 

:: Remove quotes from the source file path if present
set sourceFilePath=%sourceFilePath:"=%

:: Prompt the user for the target file path
set /p targetFilePath=Please enter the target file path: 

:: Remove quotes from the target file path if present
set targetFilePath=%targetFilePath:"=%

:: Check if both paths are provided
if "%sourceFilePath%"=="" (
    echo Error: Source file path is required!
    pause
    exit /b
)
if "%targetFilePath%"=="" (
    echo Error: Target file path is required!
    pause
    exit /b
)

:: Debugging: Show the paths after quote removal
echo Source file: %sourceFilePath%
echo Target file: %targetFilePath%

:: Run the ExifTool command
echo Running the ExifTool command...
exiftool -config comfyui.config -TagsFromFile "%sourceFilePath%" "%targetFilePath%"
if %errorlevel% neq 0 (
    echo Error: ExifTool command failed.
    pause
    exit /b
)

:: Notify the user of success
echo Metadata copy process completed successfully!
