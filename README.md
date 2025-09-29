# Emissions Dashboard

[배포 주소 (Vercel)](https://emissions-dashboard-eta.vercel.app)

기업 및 국가별 가스 배출량을 분석하고, 기간/단가 설정 및 게시물 관리 기능을 제공하는 대시보드 웹 애플리케이션입니다.  
과제의 요구사항을 기반으로 Next.js, React, TypeScript로 구현했습니다.

---

## 실행 방법

[배포된 링크로 확인 (Vercel)](https://emissions-dashboard-eta.vercel.app) 또는 로컬 실행
```bash
# 패키지 설치
npm i

# 개발 서버 실행
npm run dev
```
http://localhost:3000 접속

## 기술 스택
- Framework: Next.js (React + TypeScript)
- Styling: Tailwind CSS
- State Management: Jotai
- Data Visualization: Recharts
- Data : Fake Backend API

## 주요 기능
- 헤더
    - 네비게이션 드로어
    - 기간 선택
    - 탄소세 단가 입력
    - 회사/국가 선택 드롭다운
- 대시보드
    - 데이터 카드
    - 시각화 차트
        - Bar (회사별 배출량)
        - Line (기간별 추세)
        - Donut (에너지원별 비중)
    - 다크톤 UI, 로딩/에러 상태 처리
- 게시물 관리
    - 회사별 게시물 리스트 / 작성 / 수정
    - 날짜는 자동으로 현재 월 고정

## 추가 메모

### 가정
- 국가(또는 회사) 선택 값이 비어 있을 경우, 첫 번째 항목을 기본 선택으로 처리했습니다.
- 날짜는 월 단위만 입력 가능하도록 했습니다.
- 가짜 백엔드는 메모리 기반으로, 새로고침 시 데이터가 초기화됩니다.

### 아키텍처 개요
- 전역 상태: Jotai (기간, 단가, 회사/국가 선택 관리)
- 서버 상태: React Query (회사/게시물 데이터 패칭 및 캐싱)
- 컴포넌트 구조: Header, 데이터 카드, 차트(Line/Bar/Donut), 게시물List
- 데이터 흐름
  1) Header에서 기간등 옵션 변경  
  2) 전역 상태 업데이트(Jotai)  
  3) 페이지에서 useDashboardData((집계/가공)hook)로 라인/도넛/YoY 계산
  4) 각 차트/데이터카드가 렌더

### 트레이드오프
- 일부 차트 애니메이션은 성능 문제로 비활성화했습니다.
- 반응형 레이아웃은 주요 레이아웃까지만 구현했으며, 모바일 최적화는 단순화했습니다.

### 디자인 근거
- 전체 테마는 다크톤으로 설정하여 차트와 수치 데이터에 시각적 집중도를 높였습니다.
- 주요 툴팁 및 포인트는 흰색을 사용해 데이터 가독성을 높였습니다.