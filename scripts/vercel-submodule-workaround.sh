#!/usr/bin/env bash
# scripts/vercel-submodule-workaround.sh
#
# Vercel 빌드 환경에서 private submodule을 GITHUB_REPO_CLONE_TOKEN으로 clone하는 워크어라운드.
# `.gitmodules`의 SSH/HTTPS URL → `https://oauth2:TOKEN@github.com/...` 로 sed 치환 후
# `git submodule sync && git submodule update`. `trap cleanup EXIT`로 빌드 종료 시
# `.gitmodules` 원본 복원 (dirty 상태 방지).
#
# 사용법 (Vercel Install Command):
#   bash scripts/vercel-submodule-workaround.sh && pnpm install
#
# 필요 환경 변수:
#   GITHUB_REPO_CLONE_TOKEN  — fine-grained PAT (Contents: Read 권한)

set -Eeuo pipefail

# ── 0. 로컬 .env 자동 로드 (Vercel 환경에는 .env가 없으므로 가드로 skip) ────
# Vercel은 dashboard 환경 변수를 process env에 자동 주입하지만 로컬 bash 스크립트는
# 자동 로드되지 않는다. .env가 존재하면 KEY=VALUE 라인을 export해 로컬 검증 가능하게.
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
  echo "[info] .env 로드 완료 (로컬 환경)"
fi

GITMODULES=".gitmodules"
FEXT=".bak"
GITMODULES_BACKUP="${GITMODULES}${FEXT}"

function cleanup {
  echo "Cleaning the runner..."
  rm -f "$GITMODULES" "$GITMODULES_BACKUP"
  git restore "$GITMODULES" 2>/dev/null || true
  echo "Done!"
}

trap cleanup EXIT

function submodule_workaround {
  if [ -z "${GITHUB_REPO_CLONE_TOKEN:-}" ]; then
    echo "[error] GITHUB_REPO_CLONE_TOKEN 환경 변수가 설정되지 않았습니다." >&2
    exit 1
  fi

  echo "Monkey patching .gitmodules..."
  # SSH URL: git@github.com: → https://oauth2:TOKEN@github.com/
  sed -i"$FEXT" "s/git@github.com:/https:\/\/oauth2:${GITHUB_REPO_CLONE_TOKEN}@github.com\//" "$GITMODULES"
  # HTTPS URL: https://github.com/ → https://oauth2:TOKEN@github.com/
  sed -i"$FEXT" "s/https:\/\/github.com\//https:\/\/oauth2:${GITHUB_REPO_CLONE_TOKEN}@github.com\//" "$GITMODULES"
  echo "Done!"

  echo "Synchronising submodules' remote URL configuration..."
  git submodule sync
  echo "Done!"

  echo "Updating the registered submodules..."
  git submodule update --init --recursive --jobs "$(getconf _NPROCESSORS_ONLN)"
  echo "Done!"
}

submodule_workaround
echo "[success] Submodule clone 완료"
