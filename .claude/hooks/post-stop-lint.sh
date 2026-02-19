#!/bin/bash
# 대화 종료 시 실행: 누적된 lint 작업을 한 번에 실행
# 성능 최적화: 여러 파일 수정 시에도 lint는 단 1회만 실행

SESSION_ID=${CLAUDE_SESSION_ID:-default}
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
FLAG_FILE="${PROJECT_DIR}/.claude/.lint-needed-${SESSION_ID}"

# 플래그 파일 확인
if [ -f "$FLAG_FILE" ]; then
  echo "🔍 [Deferred Linting] 파일 수정이 감지되었습니다. Lint & Format 실행 중..."

  # 프로젝트 루트에서 실행
  cd "$PROJECT_DIR" || exit 1

  # Lint 자동 수정
  pnpm lint:fix 2>/dev/null || echo "⚠️ lint:fix 스킵됨"

  # Prettier 포맷팅
  pnpm format 2>/dev/null || echo "⚠️ format 스킵됨"

  # 플래그 파일 제거
  rm "$FLAG_FILE"

  echo "✅ Lint & Format 완료!"
else
  echo "✨ [Deferred Linting] 변경사항 없음. 스킵."
fi

exit 0
