param(
    [string]$File = "c:\New projects\TDM\src\views\POAPSlideBuilder.tsx",
    [string]$NewBlockFile = "c:\New projects\TDM\scripts\slide3_block.txt"
)

$lines = [System.IO.File]::ReadAllLines($File, [System.Text.Encoding]::UTF8)
Write-Host "Total lines: $($lines.Count)"

# Find start line (0-indexed): line containing '// Slide 3: Delivery Plan Timeline'
$startIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '// Slide 3: Delivery Plan Timeline') {
        $startIdx = $i
        break
    }
}

# Find end line (0-indexed): the lone '  }' that closes the if(activeSlide === 3) block
# We look for '  }' after startIdx, tracking brace depth
$braceDepth = 0
$endIdx = -1
$entered = $false
for ($i = $startIdx; $i -lt $lines.Count; $i++) {
    foreach ($ch in $lines[$i].ToCharArray()) {
        if ($ch -eq '{') { $braceDepth++; $entered = $true }
        if ($ch -eq '}') { $braceDepth-- }
    }
    if ($entered -and $braceDepth -eq 0) {
        $endIdx = $i
        break
    }
}

Write-Host "Replacing lines $($startIdx+1) to $($endIdx+1)"

# Read the new block content
$newBlock = [System.IO.File]::ReadAllText($NewBlockFile, [System.Text.Encoding]::UTF8)
$newLines = $newBlock -split "`r?`n"

# Build new file: lines before + new block + lines after
$before = $lines[0..($startIdx-1)]
$after  = if ($endIdx + 1 -lt $lines.Count) { $lines[($endIdx+1)..($lines.Count-1)] } else { @() }

$combined = $before + $newLines + $after
[System.IO.File]::WriteAllLines($File, $combined, [System.Text.Encoding]::UTF8)
Write-Host "Done. New total lines: $($combined.Count)"
