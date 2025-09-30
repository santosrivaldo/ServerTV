#!/bin/bash

# Script para transcodificação de vídeos usando FFmpeg
# Uso: ./transcode.sh <input_file> <output_dir> <base_name>

INPUT_FILE="$1"
OUTPUT_DIR="$2"
BASE_NAME="$3"

if [ -z "$INPUT_FILE" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$BASE_NAME" ]; then
    echo "Uso: $0 <input_file> <output_dir> <base_name>"
    exit 1
fi

# Criar diretório de saída se não existir
mkdir -p "$OUTPUT_DIR"

# Configurações de qualidade
QUALITIES=(
    "480p:854x480:1000k"
    "720p:1280x720:2500k"
    "1080p:1920x1080:5000k"
)

echo "Iniciando transcodificação de $INPUT_FILE..."

for quality_config in "${QUALITIES[@]}"; do
    IFS=':' read -r quality resolution bitrate <<< "$quality_config"
    
    echo "Transcodificando para $quality ($resolution, $bitrate)..."
    
    OUTPUT_FILE="$OUTPUT_DIR/${quality}.m3u8"
    SEGMENT_PATTERN="$OUTPUT_DIR/${quality}_%03d.ts"
    
    ffmpeg -i "$INPUT_FILE" \
        -c:v libx264 \
        -c:a aac \
        -b:v "$bitrate" \
        -s "$resolution" \
        -f hls \
        -hls_time 10 \
        -hls_list_size 0 \
        -hls_segment_filename "$SEGMENT_PATTERN" \
        "$OUTPUT_FILE" \
        -y
    
    if [ $? -eq 0 ]; then
        echo "✅ $quality concluído com sucesso"
    else
        echo "❌ Erro na transcodificação para $quality"
    fi
done

echo "Transcodificação concluída!"

# Gerar thumbnail
echo "Gerando thumbnail..."
THUMBNAIL_FILE="$OUTPUT_DIR/thumbnail.jpg"
ffmpeg -i "$INPUT_FILE" \
    -ss 00:00:01 \
    -vframes 1 \
    -q:v 2 \
    "$THUMBNAIL_FILE" \
    -y

if [ $? -eq 0 ]; then
    echo "✅ Thumbnail gerado com sucesso"
else
    echo "❌ Erro ao gerar thumbnail"
fi

echo "Processo concluído!"
