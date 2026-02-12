#!/usr/bin/env python3
"""
Importar datos de CareLink (CSV con dos bloques) a Nightscout.

Detecta automáticamente los dos bloques buscando las líneas de encabezado
que empiezan con "Index,Date,Time,...". Bloque 1 → treatments, Bloque 2 → entries (sgv).
"""
import csv
import hashlib
import io
import re
import requests
import sys
from datetime import datetime

# --- CONFIGURACIÓN ---
NS_URL = "https://p01--diabetes-app--tvj7ypwbwtj6.code.run"
API_SECRET = "MiLaboratorioDiabetes2026"
CSV_FILE = "Francisco Castrillo de la Peña 3-02-26.csv"

# Patrón para identificar la línea de encabezado de datos CareLink (evita falsos positivos)
HEADER_PATTERN = re.compile(r"^Index,Date,Time,")

API_SECRET_HASH = hashlib.sha1(API_SECRET.encode("utf-8")).hexdigest()


def log(msg):
    print(msg, flush=True)


def encontrar_bloques(lines):
    """
    Busca las dos líneas que son encabezado de datos (Index,Date,Time,...).
    Devuelve (idx_header_1, idx_header_2) en 0-based, o None si no hay exactamente 2.
    """
    indices = []
    for i, line in enumerate(lines):
        if HEADER_PATTERN.search(line):
            indices.append(i)
    if len(indices) < 1:
        return None
    if len(indices) == 1:
        return (indices[0], None)  # Un solo bloque
    return (indices[0], indices[1])


def upload_to_nightscout(endpoint, data):
    headers = {
        "API-SECRET": API_SECRET_HASH,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    url = f"{NS_URL}/api/v1/{endpoint}"
    response = requests.post(url, headers=headers, json=data)
    return response.status_code


def parse_fecha_hora(row):
    try:
        dt_str = f"{row['Date']} {row['Time']}"
        return datetime.strptime(dt_str, "%Y/%m/%d %H:%M:%S")
    except (KeyError, ValueError):
        return None


def _es_fila_de_datos(line):
    """True si la línea parece una fila de datos (Index numérico); excluye vacías y separadores (-------)."""
    s = line.strip()
    if not s:
        return False
    primera = s.split(",", 1)[0].strip()
    return bool(primera) and primera[0].isdigit()


def procesar_bloque_treatments(lines, header_idx, data_end_idx):
    """Bloque 1: solo treatments (carbos). Solo se incluyen filas que parecen datos (excluye vacías y separadores)."""
    header = lines[header_idx]
    raw = lines[header_idx + 1 : data_end_idx]
    data_lines = [ln for ln in raw if _es_fila_de_datos(ln)]
    text = "\n".join([header] + data_lines)
    reader = csv.DictReader(io.StringIO(text))
    treatments = []
    for row in reader:
        dt = parse_fecha_hora(row)
        if not dt:
            continue
        timestamp = dt.isoformat() + ".000Z"
        carbs = row.get("BWZ Carb Input (grams)", "").strip()
        if carbs and float(carbs) > 0:
            treatments.append({
                "eventType": "Meal Bolus",
                "carbs": float(carbs),
                "created_at": timestamp,
                "enteredBy": "CSV Import",
                "notes": "Importado de CareLink (bloque 1)",
            })
    return treatments


def procesar_bloque_entries(lines, header_idx):
    """Bloque 2: solo entries (Sensor Glucose). Solo filas que parecen datos; ignorar excepciones de sensor."""
    header = lines[header_idx]
    raw = lines[header_idx + 1 :]
    data_lines = [ln for ln in raw if _es_fila_de_datos(ln)]
    text = "\n".join([header] + data_lines)
    reader = csv.DictReader(io.StringIO(text))
    entries = []
    for row in reader:
        dt = parse_fecha_hora(row)
        if not dt:
            continue
        sg = row.get("Sensor Glucose (mg/dL)", "").strip()
        if not sg:
            continue
        try:
            sgv = int(float(sg))
        except ValueError:
            continue
        if sgv <= 0 or sgv > 500:
            continue
        timestamp = dt.isoformat() + ".000Z"
        entries.append({
            "type": "sgv",
            "sgv": sgv,
            "date": int(dt.timestamp() * 1000),
            "dateString": timestamp,
            "device": "Medtronic 640G",
        })
    return entries


def main():
    log("Leyendo archivo CSV...")
    with open(CSV_FILE, mode="r", encoding="utf-8-sig") as f:
        lines = f.readlines()

    lines = [ln.rstrip("\n\r") for ln in lines]
    total_lines = len(lines)
    log(f"  Total líneas leídas: {total_lines}")

    bloques = encontrar_bloques(lines)
    if bloques is None:
        log("ERROR: No se encontró ninguna línea de encabezado 'Index,Date,Time,...'")
        sys.exit(1)
    idx1, idx2 = bloques
    if idx2 is not None:
        log(f"  2 bloques detectados: encabezados en líneas {idx1 + 1} y {idx2 + 1}")
    else:
        log("  Un solo bloque detectado (solo treatments; no hay bloque de sensor).")
        log(f"  Encabezado en línea {idx1 + 1}")

    # Bloque 1: treatments
    data_end_1 = idx2 if idx2 is not None else total_lines
    log("Procesando bloque 1 (eventos bomba → treatments)...")
    log(f"  Encabezado línea {idx1 + 1}, datos hasta línea {data_end_1}")
    treatments = procesar_bloque_treatments(lines, idx1, data_end_1)
    log(f"  → Treatments extraídos: {len(treatments)}")

    # Bloque 2: entries (solo si hay segundo bloque)
    entries = []
    if idx2 is not None:
        log("Procesando bloque 2 (sensor → entries)...")
        log(f"  Encabezado línea {idx2 + 1}, datos hasta fin de archivo")
        entries = procesar_bloque_entries(lines, idx2)
        log(f"  → Entries extraídos: {len(entries)}")
    if entries:
        fechas = [e["dateString"][:10] for e in [entries[0], entries[-1]]]
        log(f"  → Rango de fechas: {fechas[0]} … {fechas[1]} (por defecto la API solo devuelve últimos 2 días)")

    # Enviar entries primero (glucosa)
    total_blocks_entries = (len(entries) + 99) // 100
    log(f"Enviando {len(entries)} lecturas de glucosa en {total_blocks_entries} bloque(s)...")
    for i in range(0, len(entries), 100):
        block_num = i // 100 + 1
        status = upload_to_nightscout("entries", entries[i : i + 100])
        log(f"  → Entries bloque {block_num}/{total_blocks_entries} (HTTP {status})")

    total_blocks_treatments = (len(treatments) + 99) // 100 if treatments else 0
    log(f"Enviando {len(treatments)} registros de carbohidratos en {total_blocks_treatments} bloque(s)...")
    for i in range(0, len(treatments), 100):
        block_num = i // 100 + 1
        status = upload_to_nightscout("treatments", treatments[i : i + 100])
        log(f"  → Treatments bloque {block_num}/{total_blocks_treatments} (HTTP {status})")

    log("¡Proceso completado!")


if __name__ == "__main__":
    main()
