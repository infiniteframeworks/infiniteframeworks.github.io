$srcDir = "$PSScriptRoot/src"
$includesDir = "$srcDir/includes"
$srcPagesDir = "$srcDir/pages"
$outputRoot = "."
$outputPagesDir = "pages"

# Load all includes into a hashtable
$includes = @{}
Get-ChildItem -Path $includesDir -Filter *.html | ForEach-Object {
    $key = $_.BaseName  # 'head.html' -> 'head'
    $includes[$key] = Get-Content $_.FullName -Raw
}

# Helper function to inject includes and write file
function Build-Page($inputPath, $outputPath) {
    if (!(Test-Path $inputPath)) {
        Write-Warning "Input file not found: $inputPath"
        return
    }

    $html = Get-Content $inputPath -Raw
    if ($null -eq $html -or $html.Trim().Length -eq 0) {
        Write-Warning "Input file is empty or could not be read: $inputPath"
        return
    }

    foreach ($key in $includes.Keys) {
        $pattern = "<!--\s*\{\{\s*$key\s*\}\}\s*-->"
        $replacement = $includes[$key]

        if ($html -notmatch $pattern) {
            Write-Warning "No {{$key}} token found in $inputPath"
            continue
        }

        if ($null -eq $replacement) {
            Write-Warning "Include '$key' is null. Skipping replacement."
            continue
        }

        $html = [System.Text.RegularExpressions.Regex]::Replace(
            $html,
            $pattern,
            { param($m) $replacement },
            [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        )
    }

    $outputFolder = Split-Path $outputPath -Parent
    if (!(Test-Path $outputFolder)) {
        New-Item -ItemType Directory -Path $outputFolder -Force | Out-Null
    }

    $html | Set-Content $outputPath
    Write-Host "Built: $outputPath"
}


# Process root index.html
Build-Page "$srcDir/index.html" "$outputRoot/index.html"

# Recursively process src/pages/**/index.html into pages/**/index.html
Get-ChildItem -Path $srcPagesDir -Recurse -Filter "index.html" | ForEach-Object {
    $relativePath = $_.FullName.Substring($srcPagesDir.Length + 1)
    $outputPath = Join-Path $outputPagesDir $relativePath
    Build-Page $_.FullName $outputPath
}
