param(
  [Parameter(Mandatory = $true)]
  [string]$BucketName,

  [string]$Region,

  [string]$Profile,

  [switch]$IncludeDashboard,

  [switch]$DeleteRemoved,

  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

try {
  Get-Command aws -ErrorAction Stop | Out-Null
} catch {
  throw "AWS CLI was not found in PATH. Install AWS CLI first, then run 'aws configure'."
}

$arguments = @("s3", "sync", $repoRoot, "s3://$BucketName")

$excludePatterns = @(
  ".git/*",
  ".git",
  "README.md",
  "implementation_plan.md",
  "scripts/*",
  "aws/*"
)

if (-not $IncludeDashboard) {
  $excludePatterns += "dashboard/*"
}

foreach ($pattern in $excludePatterns) {
  $arguments += @("--exclude", $pattern)
}

if ($DeleteRemoved) {
  $arguments += "--delete"
}

if ($Region) {
  $arguments += @("--region", $Region)
}

if ($Profile) {
  $arguments += @("--profile", $Profile)
}

if ($DryRun) {
  $arguments += "--dryrun"
}

Write-Host ""
Write-Host "Deploying static site to s3://$BucketName" -ForegroundColor Cyan
Write-Host "Repo root: $repoRoot" -ForegroundColor DarkGray
Write-Host "Include dashboard: $IncludeDashboard" -ForegroundColor DarkGray
Write-Host "Delete removed files: $DeleteRemoved" -ForegroundColor DarkGray
Write-Host "Dry run: $DryRun" -ForegroundColor DarkGray
Write-Host ""

& aws @arguments

if ($LASTEXITCODE -ne 0) {
  throw "AWS CLI sync failed."
}

Write-Host ""
Write-Host "Upload complete." -ForegroundColor Green

if (-not $IncludeDashboard) {
  Write-Host "Note: 'dashboard/' was intentionally excluded from this deploy." -ForegroundColor Yellow
}
