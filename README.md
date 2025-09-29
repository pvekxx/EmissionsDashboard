# Emissions Dashboard

[배포 주소 (Vercel)](https://)

기업 및 국가별 가스 배출량을 분석하고, 기간/단가 설정 및 게시물 관리 기능을 제공하는 대시보드 웹 애플리케이션입니다.  
과제의 요구사항을 기반으로 Next.js, React, TypeScript로 구현했습니다.

---

## 실행 방법

[배포된 링크로 확인 (Vercel)](https://) 또는 로컬 실행
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