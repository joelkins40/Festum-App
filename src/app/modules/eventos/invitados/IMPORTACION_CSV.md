# 📥 Importación de Invitados desde CSV

## 📋 Formato del Archivo CSV

El archivo CSV debe tener **exactamente** las siguientes columnas en este orden:

1. **Nombre Completo** (obligatorio)
2. **Teléfono Principal** (obligatorio)
3. **Teléfono Secundario** (opcional - puede estar vacío)
4. **Email** (opcional - puede estar vacío)
5. **Acompañantes** (obligatorio - número entero ≥ 0)
6. **Confirmado** (obligatorio - "S" para Sí o "N" para No)

### Encabezados Exactos Requeridos

```csv
Nombre Completo,Teléfono Principal,Teléfono Secundario,Email,Acompañantes,Confirmado
```

## ✅ Ejemplo de Archivo Válido

```csv
Nombre Completo,Teléfono Principal,Teléfono Secundario,Email,Acompañantes,Confirmado
"Juan Pérez García","+52 55 1234 5678","+52 55 8765 4321","juan.perez@email.com",2,S
"María López Hernández","+52 33 2345 6789","","maria.lopez@email.com",1,S
"Carlos Rodríguez","+52 81 3456 7890","+52 81 9876 5432","",3,N
"Ana Martínez","+52 55 4567 8901","","ana.martinez@email.com",0,S
```

## 📝 Reglas de Validación

### Campos Obligatorios

- ✅ **Nombre Completo**: No puede estar vacío
- ✅ **Teléfono Principal**: No puede estar vacío
- ✅ **Acompañantes**: Debe ser un número entero mayor o igual a 0
- ✅ **Confirmado**: Solo acepta "S" (Sí) o "N" (No) - no distingue mayúsculas/minúsculas

### Campos Opcionales

- **Teléfono Secundario**: Puede dejarse vacío (`""`)
- **Email**: Puede dejarse vacío (`""`)

## ⚠️ Errores Comunes

### ❌ Error: "Los encabezados del CSV no coinciden"

**Causa**: Los nombres de las columnas no son exactamente los esperados.

**Solución**: Copiar exactamente los encabezados:

```
Nombre Completo,Teléfono Principal,Teléfono Secundario,Email,Acompañantes,Confirmado
```

### ❌ Error: "Acompañantes debe ser un número válido"

**Causa**: La columna "Acompañantes" contiene texto o está vacía.

**Ejemplos válidos**: `0`, `1`, `2`, `5`
**Ejemplos inválidos**: `uno`, ``, `1.5`, `-1`

### ❌ Error: "Confirmado debe ser 'S' o 'N'"

**Causa**: La columna "Confirmado" tiene un valor diferente a S/N.

**Valores válidos**: `S`, `s`, `N`, `n`
**Valores inválidos**: `Sí`, `Si`, `No`, `1`, `0`, vacío

### ❌ Error: "número incorrecto de columnas"

**Causa**: Una fila tiene más o menos columnas de las esperadas (6).

**Solución**: Verificar que todas las filas tengan exactamente 6 valores, incluso si algunos están vacíos.

## 🎯 Casos de Uso

### Invitado con todos los datos

```csv
"Juan Pérez García","+52 55 1234 5678","+52 55 8765 4321","juan.perez@email.com",2,S
```

### Invitado sin teléfono secundario

```csv
"María López","+52 33 2345 6789","","maria.lopez@email.com",1,S
```

### Invitado sin email

```csv
"Carlos Rodríguez","+52 81 3456 7890","+52 81 9876 5432","",3,N
```

### Invitado solo con datos obligatorios

```csv
"Ana Martínez","+52 55 4567 8901","","",0,S
```

### Invitado sin acompañantes, no confirmado

```csv
"Luis González","+52 33 5678 9012","","",0,N
```

## 🔧 Características Técnicas

### Codificación

- ✅ UTF-8 con BOM (para compatibilidad con Excel y caracteres especiales)
- ✅ Soporta acentos, ñ y caracteres especiales en español

### Formato

- ✅ Los campos pueden estar entre comillas dobles (`"`)
- ✅ Las comillas protegen comas dentro de los nombres
- ✅ Los espacios extra se eliminan automáticamente

### Procesamiento

- ✅ Se valida cada fila antes de importar
- ✅ Si hay errores, NO se importa nada (todo o nada)
- ✅ Los IDs se asignan automáticamente
- ✅ Los invitados se agregan a la lista actual (no la reemplazan)

## 💡 Consejos

1. **Excel/Google Sheets**: Puedes crear el archivo en Excel o Google Sheets y exportar como CSV
2. **Codificación**: Al guardar desde Excel, usar "CSV UTF-8 (delimitado por comas)"
3. **Pruebas**: Usa el archivo de ejemplo incluido (`ejemplo-importacion-invitados.csv`)
4. **Backup**: Antes de importar, considera exportar primero tu lista actual

## 🚀 Flujo de Importación

1. Selecciona un evento de la tabla superior
2. Haz clic en el botón **"Importar CSV"**
3. Selecciona tu archivo `.csv` desde tu computadora
4. El sistema validará automáticamente el formato
5. Si hay errores, se mostrarán mensajes específicos
6. Si todo es correcto, los invitados se agregarán a la lista
7. Las estadísticas se actualizarán automáticamente

## 📊 Después de Importar

- ✅ Los invitados importados se combinan con la lista actual
- ✅ Se asignan IDs únicos automáticamente
- ✅ Las estadísticas se recalculan
- ✅ Puedes editar o eliminar los invitados importados
- ✅ Puedes exportar la lista completa nuevamente

## 🔮 Futuro (Integración Backend)

Cuando exista el backend, los datos se enviarán al servidor automáticamente:

```typescript
// Código preparado en el componente (actualmente comentado)
this.http.post("/api/eventos/" + this.selectedEvento.id + "/invitados/import", invitadosImportados).subscribe({
  next: (response) => {
    this.showMessage("Invitados guardados en el servidor", "success");
    this.cargarInvitados();
  },
  error: (error) => {
    this.showMessage("Error al guardar en el servidor", "error");
  },
});
```

---

**Nota**: Por ahora, los datos solo se almacenan en memoria. Al recargar la página, las importaciones se perderán hasta que se implemente el backend.
