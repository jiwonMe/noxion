---
sidebar_position: 5
title: Notion 자동 배포
description: Notion에서 "Public"을 체크하는 순간 사이트가 자동으로 업데이트되도록 설정하세요.
---

# Notion 자동 배포

기본적으로 Noxion은 [ISR](./configuration#revalidate)을 통해 매시간 콘텐츠를 갱신합니다. 이 가이드는 **즉시 배포** — Notion에서 `Public` 체크박스를 체크하는 순간, 몇 초 내에 사이트가 업데이트되도록 설정하는 방법을 설명합니다.

---

## 내장 기능: Notion Integration Webhooks (추천)

Noxion에는 Notion에서 직접 이벤트를 수신하는 **내장 웹훅 엔드포인트**가 포함되어 있습니다. 외부 서비스 없이 — Notion 통합만 설정하면 바로 사용할 수 있습니다.

```
Notion (Public ✓) ──webhook──▶ /api/notion-webhook (Noxion 내장) ──▶ 사이트 업데이트
```

### 동작 원리

1. Notion에서 페이지를 변경하면 (콘텐츠 수정, `Public` 체크 등) Notion이 웹훅 이벤트를 Noxion 사이트로 전송
2. Noxion이 요청 서명을 검증 (HMAC-SHA256)
3. Noxion이 홈페이지와 태그 페이지의 ISR 재검증을 트리거
4. 몇 초 내에 사이트 업데이트 완료

### 지원 이벤트

| 이벤트 | 트리거 |
|--------|--------|
| `page.properties_updated` | 속성 변경 (예: `Public` 체크박스 토글) |
| `page.content_updated` | 페이지 콘텐츠 수정 |
| `page.created` | 새 페이지 생성 |
| `page.deleted` | 페이지 휴지통 이동 |
| `page.undeleted` | 휴지통에서 페이지 복원 |

---

### 1단계: Notion Integration 생성

이미 통합이 있다면 (예: 비공개 페이지용) 2단계로 건너뛰세요.

1. [notion.so/profile/integrations](https://www.notion.so/profile/integrations) 접속
2. **New integration** 클릭
3. 이름 입력 (예: "Noxion Auto-Publish")
4. **Associated workspace**를 워크스페이스로 설정
5. **Capabilities**에서 활성화:
   - ✅ Read content
   - ❌ Insert content (불필요)
   - ❌ Update content (불필요)
6. **Submit** 클릭

### 2단계: 데이터베이스에 통합 연결

1. Notion 데이터베이스 열기
2. 우측 상단 **`...`** 메뉴 클릭
3. **Add connections** 클릭
4. 통합을 검색하여 선택

### 3단계: 웹훅 구독 생성

1. [notion.so/profile/integrations](https://www.notion.so/profile/integrations)로 돌아가기
2. 통합 선택
3. **Webhooks** 탭으로 이동
4. **+ Create a subscription** 클릭
5. 웹훅 URL 입력:
   ```
   https://yourdomain.com/api/notion-webhook
   ```
   :::warning HTTPS 필수
   Notion은 공개적으로 접근 가능한 HTTPS 엔드포인트를 요구합니다. `localhost`에서는 작동하지 않습니다 — 먼저 사이트를 배포해야 합니다.
   :::
6. 구독할 이벤트 유형 선택:
   - ✅ `page.properties_updated`
   - ✅ `page.content_updated`
   - ✅ `page.created`
   - ✅ `page.deleted`
   - ✅ `page.undeleted`
7. **Create subscription** 클릭

### 4단계: 구독 검증

구독을 생성하면 Notion이 일회성 검증 요청을 엔드포인트로 보냅니다. Noxion이 자동으로 이를 처리하고 검증 토큰을 로그에 기록합니다.

1. 배포 로그에서 다음을 확인:
   ```
   [noxion] Notion webhook verification token received: secret_tMrlL1q...
   ```
2. 토큰 복사
3. Notion Webhooks 탭에서 **Verify** 클릭
4. 검증 토큰을 붙여넣고 **Verify subscription** 클릭

웹훅이 활성화되었습니다.

### 5단계: 서명 검증 설정 (권장)

보안을 위해 HMAC-SHA256 서명 검증을 설정하세요:

1. 4단계에서 받은 검증 토큰이 **서명 시크릿**이기도 합니다
2. 환경 변수에 추가:
   ```bash
   NOTION_WEBHOOK_SECRET=secret_tMrlL1q...
   ```
3. 사이트 재배포

이 설정 후 Noxion은 유효한 `X-Notion-Signature` 헤더가 없는 요청을 거부합니다.

### 6단계: 테스트

1. Notion 데이터베이스 열기
2. 페이지의 `Public` 체크박스 체크
3. 1~5분 내에 사이트가 업데이트됩니다 (Notion의 이벤트 전달 시간)

:::info 이벤트 전달 시간
Notion은 대부분의 웹훅 이벤트를 1분 이내에 전달하며, 모든 이벤트를 5분 이내에 전달합니다. `page.content_updated` 같은 일부 이벤트는 집계됩니다 — 빠르게 연속 수정하면 하나의 웹훅 이벤트로 묶여 전달됩니다.
:::

---

## 환경 변수

| 변수 | 설명 |
|------|------|
| `NOTION_WEBHOOK_SECRET` | HMAC-SHA256 서명 검증을 위한 Notion 검증 토큰. 설정하지 않으면 서명 검증을 건너뜁니다. |

기존 환경 변수와 함께 배포 플랫폼(Vercel, Docker 등)에 추가하세요.

---

## 대안적 접근 방법

Notion 웹훅을 사용할 수 없는 경우 (예: Notion 플랜이 통합을 지원하지 않거나, 더 간단한 설정이 필요한 경우) 다른 옵션이 있습니다:

### Make.com

[Make](https://www.make.com) (구 Integromat)이 Notion 데이터베이스를 감시하고 변경이 감지되면 Noxion의 재검증 엔드포인트를 호출합니다.

1. **Notion → Watch Database Items** 트리거로 Make 시나리오 생성
2. 필터 추가: `Public` = `true`일 때만
3. **HTTP → Make a request** 추가: `https://yourdomain.com/api/revalidate`로 POST, 쿼리 파라미터 `secret=YOUR_REVALIDATE_SECRET&path=/`
4. 폴링 간격 설정 (무료 티어 15분)

무료 티어: 월 1,000 오퍼레이션, 15분 폴링 간격.

### GitHub Actions

재검증 엔드포인트를 호출하는 예약 워크플로우. 무료이지만 최소 5분 간격.

```yaml
# .github/workflows/notion-auto-publish.yml
name: Notion Auto-Publish
on:
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:
jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -s -X POST "${{ secrets.SITE_URL }}/api/revalidate?secret=${{ secrets.REVALIDATE_SECRET }}&path=/"
```

### Vercel Deploy Hooks

ISR 재검증 대신 전체 사이트 리빌드를 트리거:

1. Vercel에서: **Settings → Git → Deploy Hooks**
2. 훅을 생성하고 Make, Zapier, 또는 GitHub Actions에서 해당 URL 사용

:::caution
Deploy Hooks는 **전체 리빌드** (1~3분)를 트리거합니다. Notion 웹훅 + ISR 재검증은 **개별 페이지를 몇 초 내에** 업데이트합니다.
:::

---

## 비교

| 방법 | 비용 | 지연 시간 | 외부 서비스? |
|------|------|-----------|-------------|
| **Notion Webhooks** (내장) | 무료 | 1~5분 | 없음 |
| Make.com | 무료 (월 1K ops) | ~15분 (무료) | 있음 |
| GitHub Actions | 무료 (월 2K분) | 5~15분 | 없음 |
| Vercel Deploy Hooks | 무료 | 1~3분 (전체 리빌드) | 트리거에 따라 다름 |

---

## 문제 해결

### 웹훅 이벤트가 도착하지 않음

- 통합이 데이터베이스에 연결되어 있는지 확인 (2단계)
- 올바른 이벤트 유형을 구독했는지 확인 (3단계)
- Webhooks 탭에서 구독이 활성 상태인지 (일시정지 아닌지) 확인
- 배포 로그에서 수신 요청 확인

### 서명 검증 실패

- `NOTION_WEBHOOK_SECRET`이 검증 토큰과 정확히 일치하는지 확인
- 토큰은 `secret_`으로 시작합니다 — 전체 문자열을 포함하세요
- 환경 변수를 추가/변경한 후 재배포

### 웹훅 이후 변경 사항이 반영되지 않음

1. 배포 로그에서 `[noxion] Webhook: page.properties_updated for page ...` 확인
2. 로그는 있지만 사이트가 업데이트되지 않으면 CDN 캐시 초기화 시도
3. 로그가 없으면 웹훅이 엔드포인트에 도달하지 못하는 것 — Notion의 웹훅 구독 상태 확인

### 이벤트 집계

Notion은 빠른 변경을 묶어서 처리합니다. 여러 번 빠르게 수정하면 하나의 웹훅 이벤트만 받게 됩니다 (수정마다 하나씩이 아님). 이는 정상 동작이며 최종 결과에 영향을 주지 않습니다 — 사이트는 최신 상태를 반영합니다.
