# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## 프로젝트 개요

**Health Diary (건강일기)** - 위암 수술 후 회복 관리를 위한 Progressive Web App (PWA)

일일 건강 상태와 활동량을 추적하고, 게이미피케이션으로 꾸준한 건강 관리를 동기부여하는 앱.

## 기술 스택

- **프레임워크**: React 19 + TypeScript
- **빌드**: Vite 7
- **차트**: Recharts
- **PWA**: Vite PWA Plugin + Workbox
- **배포**: Vercel

## 프로젝트 구조

```
src/
├── components/
│   ├── common/         # Button, Card, Toast, BottomSheet, ConfirmDialog, CollapsibleCard, ChangelogModal 등
│   ├── gamification/   # BadgeCard, StreakDisplay, LevelDisplay
│   ├── layout/         # MainLayout, Header, Navigation
│   └── report/         # ActivityChart, ConditionChart
├── data/
│   ├── badges.ts       # 12개 배지 정의
│   ├── levels.ts       # 8단계 레벨 시스템
│   ├── healthInfo.ts   # 건강 교육 콘텐츠
│   └── changelog.ts    # 버전별 업데이트 기록
├── hooks/
│   ├── useCondition.ts      # 컨디션 기록 CRUD
│   ├── useActivity.ts       # 활동 기록 CRUD
│   ├── useGamification.ts   # 포인트, 레벨, 연속기록, 배지
│   ├── useLocalStorage.ts   # 로컬 스토리지 래퍼
│   ├── useReport.ts         # 일간/주간 리포트 생성
│   └── useSettings.ts       # 사용자 설정
├── pages/
│   ├── HomePage.tsx         # 대시보드, 인사말, 빠른 액션
│   ├── ConditionPage.tsx    # 컨디션 기록 (1-5점, 증상, 기분, 식사)
│   ├── ActivityPage.tsx     # 활동 기록 (걷기/운동)
│   ├── ReportPage.tsx       # 일간/주간 통계 및 차트
│   ├── ProfilePage.tsx      # 배지, 업적, 레벨 표시
│   └── SettingsPage.tsx     # 설정 (글자 크기, 고대비, 데이터 관리)
├── types/                   # TypeScript 타입 정의
└── utils/                   # 날짜, 공유, 사운드 유틸리티
```

## 핵심 기능

### 건강 기록
- **컨디션**: 1-5점 척도, 증상 7종(덤핑증후군 포함), 기분, 식사 횟수, 메모
- **활동**: 걷기/운동 시간, 주간 활동량 추적
- **다중 기록**: 하루에 여러 번 기록 가능

### 게이미피케이션
- **포인트**: 컨디션 기록 10점, 활동 기록 15점 (+30분 이상 걷기 보너스)
- **레벨**: 8단계 (🌱 시작하는 걸음 → 👑 건강 마스터)
- **연속 기록**: 매일 기록 시 스트릭 증가
- **배지**: 12개 (연속 기록, 누적 일수, 특별 업적)

### 리포트
- 일간/주간 통계, Recharts 차트, 이미지/텍스트 공유

### PWA
- 오프라인 지원, 설치 가능, 업데이트 알림

## 데이터 저장

**LocalStorage** 사용 (클라이언트 전용):
- `conditions`: 컨디션 기록 배열
- `activities`: 활동 기록 배열
- `progress`: 포인트, 레벨, 스트릭, 배지
- `settings`: 사용자 설정

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 배포

- **플랫폼**: Vercel
- **CI/CD**: `master` 브랜치 push 시 자동 배포
- **설정**: `vercel.json`

## 버전 관리

- 현재 버전: `src/data/changelog.ts`의 `CURRENT_VERSION` 참조
- 업데이트 기록: `CHANGELOG` 배열에 버전별 변경 사항 기록
- 버전 업데이트 시 `changelog.ts`에 새 엔트리 추가 필요

## 관련 프로젝트

이 앱은 `I:\내 드라이브\KHY\Hunyong\엄마 관련\2025년 엄마 암 진단` 의료 기록 저장소와 연계됨.
