#!/usr/bin/env fish

# Script para encontrar valores hardcodeados en los estilos
# Uso: ./find-hardcoded-styles.fish

echo "🔍 Buscando valores hardcodeados en SCSS..."
echo ""

# Colores
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 COLORES HARDCODEADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎨 Color primario (#20b2aa):"
grep -rn "#20b2aa" src/app --include="*.scss" | grep -v "styles.scss" | head -10
echo ""
echo "🔴 Color error (#f44336):"
grep -rn "#f44336" src/app --include="*.scss" | grep -v "styles.scss" | head -10
echo ""
echo "🔵 Color texto primario (#2d3436):"
grep -rn "#2d3436" src/app --include="*.scss" | grep -v "styles.scss" | head -10
echo ""
echo "⚫ Color texto secundario (#636e72):"
grep -rn "#636e72" src/app --include="*.scss" | grep -v "styles.scss" | head -10
echo ""
echo "⚪ Color fondo (#f8f9fa):"
grep -rn "#f8f9fa" src/app --include="*.scss" | grep -v "styles.scss" | head -10
echo ""

# Espaciados
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📏 ESPACIADOS HARDCODEADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Padding con px:"
grep -rn "padding: [0-9].*px" src/app --include="*.scss" | grep -v "styles.scss" | wc -l
echo " ocurrencias encontradas"
echo ""
echo "📐 Margin con px:"
grep -rn "margin: [0-9].*px" src/app --include="*.scss" | grep -v "styles.scss" | wc -l
echo " ocurrencias encontradas"
echo ""

# Border radius
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 BORDER RADIUS HARDCODEADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
grep -rn "border-radius: [0-9].*px" src/app --include="*.scss" | grep -v "styles.scss" | head -10
echo ""

# Shadows
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💫 BOX-SHADOW HARDCODEADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
grep -rn "box-shadow: 0" src/app --include="*.scss" | grep -v "styles.scss" | wc -l
echo " ocurrencias encontradas"
echo ""

# Font sizes
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔤 FONT-SIZE HARDCODEADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
grep -rn "font-size: [0-9].*px" src/app --include="*.scss" | grep -v "styles.scss" | wc -l
echo " ocurrencias encontradas"
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

set total_colors (grep -r "#[0-9a-fA-F]\{6\}" src/app --include="*.scss" | grep -v "styles.scss" | wc -l)
set total_px (grep -r "[0-9]px" src/app --include="*.scss" | grep -v "styles.scss" | wc -l)

echo "Total colores hex: $total_colors"
echo "Total valores en px: $total_px"
echo ""
echo "💡 Revisa estos archivos para refactorizar"
echo ""

# Archivos con más hardcoded values
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 TOP 10 ARCHIVOS CON MÁS VALORES HARDCODEADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
grep -r "#[0-9a-fA-F]\{6\}\|[0-9]px" src/app --include="*.scss" | grep -v "styles.scss" | cut -d: -f1 | sort | uniq -c | sort -rn | head -10
echo ""

echo "✅ Análisis completado"
