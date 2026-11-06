#!/usr/bin/env bash
# Prepara a VM para receber o Digital Linu pelo GitHub Actions. Rodar uma vez, como administrador:
#   sudo bash instalar-uma-vez.sh "<chave pública do GitHub Actions>"
# Cria o usuário digitallinu (sem sudo), dono de /opt/digital-linu, e prende a chave ao receber.sh.
# Pode rodar de novo sem estragar nada.
set -euo pipefail
CHAVE="${1:?passe a chave pública}"
BASE=/opt/digital-linu
AQUI="$(cd "$(dirname "$0")" && pwd)"

id digitallinu >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash digitallinu
mkdir -p "$BASE/app"
install -m 755 -o root -g root "$AQUI/receber.sh" "$BASE/receber.sh"
chown digitallinu: "$BASE" && chown -R digitallinu: "$BASE/app"
chmod 755 "$BASE"

install -d -m 700 -o digitallinu -g digitallinu /home/digitallinu/.ssh
echo "restrict,command=\"$BASE/receber.sh\" $CHAVE" > /home/digitallinu/.ssh/authorized_keys
chown digitallinu: /home/digitallinu/.ssh/authorized_keys && chmod 600 /home/digitallinu/.ssh/authorized_keys
echo "Pronto: digitallinu recebe versões novas em $BASE/app."
