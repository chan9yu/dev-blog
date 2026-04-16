#!/usr/bin/env bash
# scripts/vercel-submodule-workaround.sh
#
# Vercel 빌드 환경에서 private submodule을 GITHUB_REPO_CLONE_TOKEN으로 clone하는 워크어라운드.
# .gitmodules의 SSH / HTTPS URL → HTTPS + token URL로 변환 후 submodule update 실행.
#
# 사용법 (Vercel Build Command):
#   bash scripts/vercel-submodule-workaround.sh && pnpm build
#
# 필요 환경 변수:
#   GITHUB_REPO_CLONE_TOKEN  — fine-grained PAT (Contents: Read 권한만)

set -euo pipefail

# ── 1. 토큰 확인 ────────────────────────────────────────────────────────────
TOKEN="${GITHUB_REPO_CLONE_TOKEN:-}"
if [[ -z "$TOKEN" ]]; then
  echo "[error] GITHUB_REPO_CLONE_TOKEN 환경 변수가 설정되지 않았습니다." >&2
  exit 1
fi

# ── 2. .gitmodules 파싱 → git config로 토큰 주입 ───────────────────────────
# git config submodule.<name>.url 로 .git/config를 오버라이드한 뒤
# git submodule sync 가 이를 전파함 — .gitmodules 파일 자체를 수정하지 않음
current_name=""
while IFS= read -r line; do
  # [submodule "name"] 섹션 감지
  if [[ "$line" =~ ^\[submodule[[:space:]]+\"([^\"]+)\"\] ]]; then
    current_name="${BASH_REMATCH[1]}"
  fi

  # url = <value> 감지
  if [[ -n "$current_name" && "$line" =~ ^[[:space:]]*url[[:space:]]*=[[:space:]]*(.+)$ ]]; then
    raw_url="${BASH_REMATCH[1]}"

    # SSH → HTTPS 변환: git@github.com:owner/repo.git
    if [[ "$raw_url" =~ ^git@github\.com:(.+)$ ]]; then
      token_url="https://${TOKEN}@github.com/${BASH_REMATCH[1]}"
    # HTTPS → 토큰 주입: https://github.com/owner/repo.git
    elif [[ "$raw_url" =~ ^https://github\.com/(.+)$ ]]; then
      token_url="https://${TOKEN}@github.com/${BASH_REMATCH[1]}"
    else
      echo "[warn] 알 수 없는 URL 형식: ${raw_url} — 변환 생략" >&2
      continue
    fi

    echo "[info] submodule '${current_name}': 토큰 URL 주입 완료"
    git config "submodule.${current_name}.url" "${token_url}"
  fi
done < .gitmodules

# ── 3. sync → clone ─────────────────────────────────────────────────────────
git submodule sync
git submodule update --init --recursive

echo "[success] Submodule clone 완료"
