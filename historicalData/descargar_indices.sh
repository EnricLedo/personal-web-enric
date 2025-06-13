#!/bin/bash

read -p "Introduce el ticker para yfinance (ejemplo ^GSPC, ^DJI, ^IXIC): " ticker
read -p "Introduce el nombre del archivo CSV para guardar (ejemplo sp500_daily.csv): " filename

SCRIPT="descargar_indice.py"

cat <<EOF > $SCRIPT
import yfinance as yf

print("Descargando datos del ticker: $ticker ...")
datos = yf.download('$ticker', start='1750-01-01', interval='1d')
datos.to_csv('$filename')
print("Descarga completada. Archivo: $filename")
EOF

python3 $SCRIPT
rm $SCRIPT

