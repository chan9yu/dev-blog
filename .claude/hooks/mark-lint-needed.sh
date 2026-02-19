#!/bin/bash
# 파일 수정 시 플래그만 생성하고, 실제 lint는 나중에 한 번만 실행

SESSION_ID=${CLAUDE_SESSION_ID:-default}
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
FLAG_FILE="${PROJECT_DIR}/.claude/.lint-needed-${SESSION_ID}"

# 플래그 파일 생성 (lint 필요함을 표시)
touch "$FLAG_FILE"

# 조용히 종료 (사용자 경험 방해 안 함)
exit 0
