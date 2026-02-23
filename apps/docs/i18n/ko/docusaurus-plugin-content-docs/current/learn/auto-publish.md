---
sidebar_position: 5
title: Notion 자동 배포
description: Notion에서 "Public"을 체크하는 순간 사이트가 자동으로 업데이트되도록 설정하세요.
---

# Notion 자동 배포

기본적으로 Noxion은 [ISR](./configuration#revalidate)을 통해 매시간 콘텐츠를 갱신합니다. 이 가이드는 **즉시 배포** — Notion에서 `Public` 체크박스를 체크하는 순간, 몇 초 내에 사이트가 업데이트되도록 설정하는 방법을 설명합니다.

---

## 동작 원리

```
Notion (Public ✓) → 자동화 서비스 → /api/revalidate → 사이트 업데이트
```

Notion의 내장 데이터베이스 자동화는 외부 URL을 직접 호출할 수 없습니다. Notion 데이터베이스를 **감시**하고, 속성이 변경되면 Noxion의 재검증 엔드포인트를 **트리거**하는 중간 서비스가 필요합니다.

### 사전 준비

자동 배포를 설정하기 전에 다음을 확인하세요:

1. 환경 변수에 **`REVALIDATE_SECRET`** 설정 완료 ([설정 → 온디맨드 재검증](./configuration#온디맨드-재검증) 참조)
2. **사이트가 배포**되어 공개 URL로 접근 가능한 상태
3. **`/api/revalidate` 엔드포인트가 동작** — 다음으로 테스트:
   ```bash
   curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/"
   ```

---

## 방법 1: Make.com (추천)

[Make](https://www.make.com) (구 Integromat)이 추천 방법입니다. 무료 티어에 월 1,000 오퍼레이션이 포함되어 대부분의 블로그에 충분합니다.

### 1단계: Make 계정 생성

1. [make.com](https://www.make.com)에 접속하여 가입
2. 이메일 인증

### 2단계: 새 Scenario 생성

1. 대시보드에서 **Create a new scenario** 클릭
2. 비주얼 시나리오 에디터가 표시됩니다

### 3단계: Notion 트리거 추가

1. **+** 버튼을 클릭하여 첫 번째 모듈 추가
2. **Notion**을 검색하여 선택
3. **Watch Database Items** 선택
4. Notion 계정 연결:
   - Connection 옆의 **Add** 클릭
   - Make가 Notion 워크스페이스에 접근할 수 있도록 인증
   - Make가 모니터링할 데이터베이스 선택
5. 트리거 설정:
   - **Database**: 블로그 데이터베이스 선택
   - **Watch**: **Updated Items** 선택 (`Public` 체크박스 변경을 감지)

:::tip 첫 실행
첫 실행 시 Make가 시작 시점을 선택하라고 합니다. 기존 페이지를 모두 처리하지 않으려면 **From now on**을 선택하세요.
:::

### 4단계: 필터 추가 (선택사항이지만 권장)

Notion 모듈과 다음 모듈 사이의 연결선을 클릭한 후 **Add a filter**:

- **Label**: `Public이 체크된 경우만`
- **Condition**: `Public` (Notion 출력에서) → **is equal to** → `true`

이렇게 하면 모든 수정이 아닌, 실제로 페이지가 공개될 때만 웹훅이 실행됩니다.

### 5단계: HTTP 모듈 추가

1. **+** 를 클릭하여 다음 모듈 추가
2. **HTTP**를 검색하여 **Make a request** 선택
3. 설정:
   - **URL**: `https://yourdomain.com/api/revalidate`
   - **Method**: `POST`
   - **Query String**:
     | Key | Value |
     |-----|-------|
     | `secret` | `REVALIDATE_SECRET` 값 |
     | `path` | `/` |

### 6단계: (선택) 개별 페이지 재검증 HTTP 모듈 추가

특정 글 페이지도 함께 재검증하고 싶다면:

1. **HTTP → Make a request** 모듈을 하나 더 추가
2. 설정:
   - **URL**: `https://yourdomain.com/api/revalidate`
   - **Method**: `POST`
   - **Query String**:
     | Key | Value |
     |-----|-------|
     | `secret` | `REVALIDATE_SECRET` 값 |
     | `path` | `/` + Notion 모듈에서 가져온 Slug (또는 페이지 제목 사용) |

### 7단계: Scenario 활성화

1. 에디터 하단 좌측의 **스케줄링 토글** 클릭
2. 간격 설정 — **15분**이 적당한 기본값 (무료 티어에서 Make가 15분마다 변경 사항을 확인)
3. **Save** 후 **Activate** 클릭

### 전체 시나리오 다이어그램

```
┌──────────────────┐     ┌──────────┐     ┌─────────────────────┐
│ Notion            │     │ Filter   │     │ HTTP Request         │
│ Watch Database    │────▶│ Public = │────▶│ POST /api/revalidate │
│ Items (Updated)   │     │ true     │     │ ?secret=...&path=/   │
└──────────────────┘     └──────────┘     └─────────────────────┘
```

:::info Make 무료 티어
무료 티어는 **월 1,000 오퍼레이션**, **최소 15분 폴링 간격**을 제공합니다. 대부분의 블로그에 충분합니다. 더 빠른 폴링(1분까지)이 필요하면 Core 플랜($9/월)으로 업그레이드하세요.
:::

---

## 방법 2: Zapier

[Zapier](https://zapier.com)도 Notion 연동을 지원하는 인기 있는 자동화 플랫폼입니다.

### 빠른 설정

1. 새 **Zap** 생성
2. **Trigger**: Notion → **Updated Database Item**
   - Notion 계정 연결
   - 블로그 데이터베이스 선택
3. **Filter** (선택): `Public`이 `true`일 때만 계속
4. **Action**: Webhooks by Zapier → **POST**
   - URL: `https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/`
   - Method: POST
5. Zap을 **Test & Publish**

:::note Zapier 가격
Zapier 무료 티어는 월 100 작업, 15분 폴링 간격으로 제한됩니다. Starter 플랜($19.99/월)은 750 작업, 2분 폴링을 제공합니다. 대부분의 사용자에게 **Make.com이 더 경제적**입니다.
:::

---

## 방법 3: n8n (셀프 호스팅)

[n8n](https://n8n.io)은 무료로 셀프 호스팅할 수 있는 오픈소스 워크플로우 자동화 도구입니다.

### 빠른 설정

1. n8n 설치: `npm install -g n8n` 또는 Docker 사용
2. 워크플로우 생성:
   - **Trigger**: Notion → **Database Page Updated** (5분마다 폴링)
   - **IF Node**: `Public` 속성이 `true`인지 확인
   - **HTTP Request Node**: `https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/`로 POST
3. 워크플로우 활성화

:::tip 셀프 호스팅의 장점
n8n은 셀프 호스팅 시 오퍼레이션 제한 없이 무료입니다. 거의 즉각적인 업데이트가 필요하면 1분마다 폴링할 수 있습니다. 단점은 n8n 인스턴스를 직접 호스팅하고 관리해야 한다는 것입니다.
:::

---

## 방법 4: GitHub Actions (무료, 외부 서비스 불필요)

외부 서비스를 사용하고 싶지 않다면, GitHub Actions 워크플로우로 Notion 데이터베이스를 폴링하고 변경 사항이 감지되면 재검증할 수 있습니다. 완전히 무료지만 **최소 5분 간격**입니다.

### 워크플로우 생성

`.github/workflows/notion-auto-publish.yml` 파일을 생성하세요:

```yaml
name: Notion Auto-Publish

on:
  schedule:
    # 5분마다 실행
    - cron: '*/5 * * * *'
  workflow_dispatch: # 수동 트리거 허용

jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger revalidation
        run: |
          curl -s -o /dev/null -w "%{http_code}" \
            -X POST "${{ secrets.SITE_URL }}/api/revalidate?secret=${{ secrets.REVALIDATE_SECRET }}&path=/"
```

### 리포지토리 시크릿 추가

GitHub 리포지토리에서 **Settings → Secrets and variables → Actions**로 이동하여 추가:

| Secret | 값 |
|--------|-----|
| `SITE_URL` | `https://yourdomain.com` |
| `REVALIDATE_SECRET` | 재검증 시크릿 |

### 동작 방식

이 워크플로우는 콘텐츠 변경 여부와 관계없이 5분마다 재검증을 트리거합니다. 재검증 엔드포인트는 멱등적(idempotent)이고 가볍기 때문에 안전하고 효과적입니다.

:::warning GitHub Actions 제한
- **무료 티어**: 월 2,000분. 5분 간격으로 이 워크플로우는 월 ~8,640회 실행(각 ~30초 = ~4,320분). 무료 제한 내에서 유지하려면 **간격을 10~15분으로 늘리는 것**을 권장합니다.
- **무료 티어 권장 cron**: `*/15 * * * *` (15분마다, 월 ~1,440분 사용)
:::

---

## 비교

| 방법 | 비용 | 지연 시간 | 설정 난이도 | 유지보수 |
|------|------|-----------|-------------|----------|
| **Make.com** | 무료 (월 1K ops) | ~15분 (무료) / ~1분 (유료) | 중간 | 없음 |
| **Zapier** | 무료 (월 100 tasks) | ~15분 (무료) / ~2분 (유료) | 중간 | 없음 |
| **n8n** | 무료 (셀프 호스팅) | ~1분 | 높음 (서버 필요) | 서버 유지보수 |
| **GitHub Actions** | 무료 (월 2K분) | 5~15분 | 낮음 | 없음 |

**추천**: **Make.com**으로 시작하세요. 비용, 설정 편의성, 안정성의 균형이 가장 좋습니다. 이미 인프라를 셀프 호스팅하고 있다면 **n8n**이 가장 많은 제어를 제공합니다.

---

## Vercel Deploy Hooks (대안)

ISR 재검증 대신 전체 사이트 리빌드를 원한다면 [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)를 사용할 수 있습니다:

1. Vercel 프로젝트에서 **Settings → Git → Deploy Hooks**로 이동
2. 훅 생성 (예: 이름: "Notion Publish", 브랜치: `main`)
3. 훅 URL 복사
4. 위의 방법 중 하나를 사용하되, 재검증 URL 대신 Deploy Hook URL을 사용

:::caution 전체 리빌드 vs ISR
Deploy Hooks는 **전체 사이트 리빌드** (1~3분)를 트리거합니다. 온디맨드 ISR 재검증은 **개별 페이지를 몇 초 내에** 업데이트합니다. 대부분의 경우 ISR 재검증이 더 빠르고 효율적입니다.
:::

---

## 문제 해결

### 트리거 후 변경 사항이 반영되지 않음

1. `REVALIDATE_SECRET`이 올바른지 확인
2. 재검증 엔드포인트를 수동으로 테스트:
   ```bash
   curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/"
   ```
3. Notion에서 `Public` 체크박스가 실제로 체크되어 있는지 확인
4. Make/Zapier를 사용하는 경우, 실행 이력에서 오류 확인

### Make.com이 변경 사항을 감지하지 못함

- Notion 연결이 여전히 인증되어 있는지 확인
- 데이터베이스가 Make 연동과 공유되어 있는지 확인
- 트리거가 **New Items**가 아닌 **Updated Items**로 설정되어 있는지 확인

### 속도 제한 (Rate Limiting)

`/api/revalidate` 엔드포인트에는 내장 속도 제한이 없습니다. 남용이 우려된다면 인프라 레벨에서 속도 제한을 추가하세요 (예: Vercel의 [Edge Middleware](https://vercel.com/docs/functions/edge-middleware)).
