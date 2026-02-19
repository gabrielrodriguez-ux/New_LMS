#!/bin/bash

# Script para crear una nueva habilidad de Antigravity
# Uso: ./create-skill.sh <nombre-habilidad> "<descripcion>"

if [ -z "$1" ]; then
    echo "Uso: $0 <nombre-habilidad> \"<descripcion>\""
    exit 1
fi

SKILL_NAME=$1
SKILL_DESC=$2
SKILL_DIR=".agent/skills/$SKILL_NAME"

# Crear directorios
mkdir -p "$SKILL_DIR/scripts"
mkdir -p "$SKILL_DIR/examples"
mkdir -p "$SKILL_DIR/resources"

# Copiar plantilla si existe
TEMPLATE_PATH=".agent/skills/skill-creator/resources/skill-template.md"
if [ -f "$TEMPLATE_PATH" ]; then
    cp "$TEMPLATE_PATH" "$SKILL_DIR/SKILL.md"
    # Reemplazos básicos
    sed -i '' "s/{{skill-name}}/$SKILL_NAME/g" "$SKILL_DIR/SKILL.md"
    sed -i '' "s/{{skill-description}}/$SKILL_DESC/g" "$SKILL_DIR/SKILL.md"
    echo "Habilidad '$SKILL_NAME' creada exitosamente en $SKILL_DIR"
else
    touch "$SKILL_DIR/SKILL.md"
    echo "Habilidad '$SKILL_NAME' creada (sin plantilla) en $SKILL_DIR"
fi
