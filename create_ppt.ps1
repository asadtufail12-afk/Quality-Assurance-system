# Annual QA Analysis 2025 - PowerPoint Script

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = 1
$pres = $ppt.Presentations.Add()

# Slide 1: Title
$slide1 = $pres.Slides.Add(1, 1)
$slide1.Shapes.Title.TextFrame.TextRange.Text = "Diagnostic Center"
$slide1.Shapes[2].TextFrame.TextRange.Text = "Annual QA Analysis 2025"

# Slide 2: Executive Summary
$slide2 = $pres.Slides.Add(2, 2)
$slide2.Shapes.Title.TextFrame.TextRange.Text = "Executive Summary"
$summaryText = @"
OVERALL STATISTICS:
• Total Specimens: 324,119
• Total Rejected: 118 (0.036%)
• Average QC Acceptance: 93.1%

CRITICAL ISSUES:
1. Hematology - April data corruption
2. Routine Chemistry - QC dropped to 82.3% (Dec)
3. Special Chemistry - Below 95% target
4. Molecular Pathology & Histopathology - No QC performed

TOTAL PANIC NOT INFORMED: 16 cases
"@
$slide2.Shapes[2].TextFrame.TextRange.Text = $summaryText

# Slide 3: Critical Alerts
$slide3 = $pres.Slides.Add(3, 2)
$slide3.Shapes.Title.TextFrame.TextRange.Text = "🚨 CRITICAL ALERTS"
$alertsText = @"
IMMEDIATE ACTION REQUIRED:

1. HEMATOLOGY - APRIL DATA CORRUPTION
   • 190 failed QC out of 0 tests run (Impossible)
   • Shows 0% QC acceptance - Data entry error
   • 1500% panic notification rate (Impossible)

2. ROUTINE CHEMISTRY - CRITICAL DECLINE
   • December QC dropped to 82.3%
   • 5 consecutive months below 90%
   • Equipment calibration needed

3. MISSED PANIC NOTIFICATIONS
   • 16 critical results not informed
   • Patient safety risk

4. NO QC IN MOLECULAR & HISTOPATHOLOGY
"@
$slide3.Shapes[2].TextFrame.TextRange.Text = $alertsText

# Slide 4: Hematology
$slide4 = $pres.Slides.Add(4, 2)
$slide4.Shapes.Title.TextFrame.TextRange.Text = "Hematology Analysis"
$hemaText = @"
STATISTICS:
• Total Specimens: 111,307
• Rejected Samples: 80
• QC Acceptance: 90.9%
• Panic Notification: 98.3%

MONTHLY HIGHLIGHTS:
• Peak Month: October (12,936 specimens)
• Low QC: December (96.7%)
• April: DATA ERROR - Results unreliable

ISSUES:
⚠ April data corrupted - investigate
⚠ 16 panic results not informed
⚠ QC below 95% target
"@
$slide4.Shapes[2].TextFrame.TextRange.Text = $hemaText

# Slide 5: Routine Chemistry
$slide5 = $pres.Slides.Add(5, 2)
$slide5.Shapes.Title.TextFrame.TextRange.Text = "Routine Chemistry - CONCERN"
$routineText = @"
STATISTICS:
• Total Specimens: 106,357
• QC Acceptance: 88.8% (AVG)
• Panic Notification: 100%
• December QC: 82.3% (LOWEST)

QC TREND:
• January: 92% → February: 84%
• March: 95% → April: 87%
• Continues declining...
• December: 82.3% ⚠️

CONCERNS:
🚨 NEVER reached 95% target
🚨 Equipment calibration needed
🚨 Declining trend continues
"@
$slide5.Shapes[2].TextFrame.TextRange.Text = $routineText

# Slide 6: Special Chemistry
$slide6 = $pres.Slides.Add(6, 2)
$slide6.Shapes.Title.TextFrame.TextRange.Text = "Special Chemistry"
$specialText = @"
STATISTICS:
• Total Specimens: 60,944
• QC Acceptance: 90.5% (AVG)
• Panic Notification: 100%
• Lowest: February (81%)

MONTHLY QC:
• Jan: 89% | Feb: 81% | Mar: 93%
• Apr: 83% | May: 85% | Jun: 89.5%
• Jul: 95.5% | Aug: 94.5% | Sep: 96.3%
• Oct: 95% | Nov: 96.3% | Dec: 93.5%

STATUS:
✓ Improving in recent months
⚠ Below 95% for most of year
⚠ External QA documentation needed
"@
$slide6.Shapes[2].TextFrame.TextRange.Text = $specialText

# Slide 7: Microbiology
$slide7 = $pres.Slides.Add(7, 2)
$slide7.Shapes.Title.TextFrame.TextRange.Text = "Microbiology"
$microText = @"
STATISTICS:
• Total Specimens: 42,882
• QC Acceptance: 99.7% (BEST)
• Rejected Samples: 5

ISSUES:
⚠ October: 0% QC acceptance
⚠ No External QA documented
⚠ Only 1 month with QC failure

RECOMMENDATIONS:
• Maintain good QC performance
• Document External QA
• Investigate October anomaly
"@
$slide7.Shapes[2].TextFrame.TextRange.Text = $microText

# Slide 8: Molecular & Histopathology
$slide8 = $pres.Slides.Add(8, 2)
$slide8.Shapes.Title.TextFrame.TextRange.Text = "Molecular & Histopathology"
$otherText = @"
⚠️ NO QC PERFORMED IN BOTH SECTIONS

MOLECULAR PATHOLOGY:
• Specimens: 620
• QC: 0%
• External QA: 0%

HISTOPATHOLOGY:
• Specimens: 2,009
• QC: 0%
• External QA: 0%

ACTION REQUIRED:
🚨 Implement QC program
🚨 Start External QA
🚨 Monitor outsourcing quality
"@
$slide8.Shapes[2].TextFrame.TextRange.Text = $otherText

# Slide 9: Recommendations
$slide9 = $pres.Slides.Add(9, 2)
$slide9.Shapes.Title.TextFrame.TextRange.Text = "Recommendations"
$recText = @"
IMMEDIATE (This Week):
1. Fix April Hematology data
2. Investigate Routine Chemistry equipment
3. Increase QC frequency

HIGH PRIORITY (This Month):
1. Implement automated panic alerts
2. Resume External QA for all sections
3. Start QC in Molecular/Histopathology
4. Equipment maintenance schedule

ONGOING MONITORING:
1. Track monthly QC (target: 95%+)
2. Data integrity audits
3. Staffing for high-volume periods
"@
$slide9.Shapes[2].TextFrame.TextRange.Text = $recText

# Save
$pres.SaveAs("D:\coding\Annual_QA_Analysis_2025.pptx")
$ppt.Quit()

Write-Host "PowerPoint saved: D:\coding\Annual_QA_Analysis_2025.pptx"
