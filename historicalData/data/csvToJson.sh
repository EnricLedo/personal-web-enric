#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Uso: $0 nombre_del_archivo.csv"
  exit 1
fi

input_file="$1"

if [ ! -f "$input_file" ]; then
  echo "Error: El archivo '$input_file' no existe."
  exit 1
fi

echo -n "Con qué nombre quieres guardar el archivo JSON? "
read output_file_name

# Carpeta donde guardar el JSON
output_dir="./formatedToJson"

# Comprobar que la carpeta existe (por si acaso)
if [ ! -d "$output_dir" ]; then
  echo "La carpeta $output_dir no existe. Creándola..."
  mkdir -p "$output_dir"
fi

# Concatenar ruta y nombre
output_file="$output_dir/$output_file_name"

json_content=$(tail -n +4 "$input_file" | awk -F, '
  BEGIN {
    print "{"
    print "  \"stock\": {"
  }
  {
    split($1, d, "-")
    fecha = sprintf("%02d/%02d/%04d", d[2], d[3], d[1])
    close_val = $3
    gsub(/^ +| +$/, "", close_val)
    lines[NR] = "    \"" fecha "\": \"" close_val "\""
  }
  END {
    for (i=1; i<=NR; i++) {
      sep = (i < NR) ? "," : ""
      print lines[i] sep
    }
    print "  }"
    print "}"
  }
')

echo "$json_content" > "$output_file"

if [ $? -eq 0 ]; then
  echo "Archivo guardado como '$output_file'"
else
  echo "Error al guardar el archivo."
fi
