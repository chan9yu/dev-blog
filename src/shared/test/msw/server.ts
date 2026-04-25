/**
 * MSW Node 서버 — Vitest 테스트 전용.
 *
 * 브라우저(MSW worker)는 현재 프로젝트에서 사용하지 않음.
 */

import { setupServer } from "msw/node";

import { handlers } from "./handlers";

export const server = setupServer(...handlers);
