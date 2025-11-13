# Script PowerShell para descargar imágenes de chimeneasluque.com
# Ejecutar desde el directorio raíz del proyecto

$baseUrl = "https://www.chimeneasluque.com"
$outputDir = "public\images"

# Crear directorios si no existen
$categories = @("hornos", "chimeneas", "fogatas")
foreach ($category in $categories) {
    $dir = Join-Path $outputDir $category
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# Función para descargar una imagen
function Download-Image {
    param(
        [string]$Url,
        [string]$OutputPath
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            [System.IO.File]::WriteAllBytes($OutputPath, $response.Content)
            Write-Host "✓ Downloaded: $(Split-Path $OutputPath -Leaf)" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "✗ Failed: $Url - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Intentar descargar imágenes por categoría
Write-Host "`n🔍 Attempting to download images from $baseUrl`n" -ForegroundColor Cyan

# Patrones de URLs a intentar
$patterns = @(
    @{name="hornos"; count=14; pattern="images/hornos/horno{0}.jpg"},
    @{name="chimeneas"; count=32; pattern="images/chimeneas/chimenea{0}.jpg"},
    @{name="fogatas"; count=14; pattern="images/fogatas/fogata{0}.jpg"}
)

foreach ($pattern in $patterns) {
    Write-Host "`n📥 Processing $($pattern.name)..." -ForegroundColor Yellow
    
    $downloaded = 0
    for ($i = 1; $i -le $pattern.count; $i++) {
        $imageUrl = "$baseUrl/$($pattern.pattern -f $i)"
        $outputPath = Join-Path $outputDir "$($pattern.name)\$($pattern.name)$i.jpg"
        
        # Saltar si ya existe
        if (Test-Path $outputPath) {
            Write-Host "⊘ Skipped (exists): $(Split-Path $outputPath -Leaf)" -ForegroundColor Gray
            $downloaded++
            continue
        }
        
        if (Download-Image -Url $imageUrl -OutputPath $outputPath) {
            $downloaded++
        }
        
        # Esperar un poco entre descargas
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host "✓ $downloaded/$($pattern.count) images downloaded for $($pattern.name)" -ForegroundColor Green
}

Write-Host "`n✅ Download process completed!`n" -ForegroundColor Cyan

# Resumen
Write-Host "📊 Summary:" -ForegroundColor Cyan
foreach ($category in $categories) {
    $dir = Join-Path $outputDir $category
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Filter "*.jpg","*.jpeg","*.png","*.webp" -ErrorAction SilentlyContinue
        Write-Host "  $category : $($files.Count) images" -ForegroundColor White
    }
}

Write-Host "`n💡 Tip: If images were not downloaded, you may need to:" -ForegroundColor Yellow
Write-Host "  1. Inspect the website to find the actual image URLs" -ForegroundColor Yellow
Write-Host "  2. Update this script with the correct URLs" -ForegroundColor Yellow
Write-Host "  3. Or download images manually (see scripts/manual-download.md)" -ForegroundColor Yellow

