//////////////////// 데이터 모델 타입
export type Company = {
    id: string;
    name: string;
    country: string; // 국가코드
    emissions: GhgEmission[];
};
export type GhgEmission = {
    yearMonth: string; // "2025-01"
    source: string;
    emissions: number;  // CO2환산 톤수
};
export type Post = {
    id: string;
    title: string;
    resourceUid: string; // Company.id
    dateTime: string;    // "2025-02"
    content: string;
};

////////////////////////// 국가코드
const countries = [
    { code: 'US', name: 'United States' },
    { code: 'DE', name: 'Germany' },
    { code: 'KR', name: 'South Korea' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'JP', name: 'Japan' },
    { code: 'FR', name: 'France' },
];
let _countries = [...countries];

////////////////////////// 국가별 리포트
const companies = [
    {
        id: 'c1',
        name: 'Acme Corp',
        country: 'US',
        emissions: [
            { yearMonth: '2024-03', source: 'gasoline', emissions: 120 },
            { yearMonth: '2024-06', source: 'electricity', emissions: 40 },
            { yearMonth: '2024-08', source: 'lpg', emissions: 70 },
            { yearMonth: '2025-02', source: 'gasoline', emissions: 20 },
            { yearMonth: '2025-03', source: 'gasoline', emissions: 95 },
            { yearMonth: '2025-05', source: 'electricity', emissions: 45 },
        ],
    },
    {
        id: 'c2',
        name: 'Globex',
        country: 'DE',
        emissions: [
            { yearMonth: '2024-01', source: 'diesel', emissions: 80 },
            { yearMonth: '2024-04', source: 'electricity', emissions: 90 },
            { yearMonth: '2024-10', source: 'electricity', emissions: 120 },
            { yearMonth: '2025-02', source: 'diesel', emissions: 105 },
            { yearMonth: '2025-03', source: 'diesel', emissions: 120 },
            { yearMonth: '2025-05', source: 'electricity', emissions: 35 },
        ],
    },
    {
        id: 'c3',
        name: 'SK',
        country: 'KR',
        emissions: [
            { yearMonth: '2024-03', source: 'lpg', emissions: 40 },
            { yearMonth: '2024-08', source: 'diesel', emissions: 70 },
            { yearMonth: '2024-12', source: 'diesel', emissions: 20 },
            { yearMonth: '2025-03', source: 'lpg', emissions: 65 },
            { yearMonth: '2025-05', source: 'lpg', emissions: 70 },
            { yearMonth: '2025-07', source: 'electricity', emissions: 40 },
        ],
    },
    {
        id: 'c4',
        name: 'AstraZeneca',
        country: 'GB',
        emissions: [
            { yearMonth: '2024-02', source: 'diesel', emissions: 45 },
            { yearMonth: '2024-04', source: 'gasoline', emissions: 35 },
            { yearMonth: '2024-11', source: 'gasoline', emissions: 40 },
            { yearMonth: '2025-03', source: 'diesel', emissions: 50 },
            { yearMonth: '2025-05', source: 'electricity', emissions: 60 },
        ],
    },
    {
        id: 'c5',
        name: 'Toyota',
        country: 'JP',
        emissions: [
            { yearMonth: '2024-6', source: 'electricity', emissions: 90 },
            { yearMonth: '2024-10', source: 'diesel', emissions: 110 },
            { yearMonth: '2024-12', source: 'electricity', emissions: 100 },
            { yearMonth: '2025-04', source: 'gasoline', emissions: 70 },
            { yearMonth: '2025-06', source: 'diesel', emissions: 50 },
        ],
    },
    {
        id: 'c6',
        name: 'LVMH',
        country: 'FR',
        emissions: [
            { yearMonth: '2024-01', source: 'diesel', emissions: 55 },
            { yearMonth: '2024-04', source: 'lpg', emissions: 60 },
            { yearMonth: '2024-06', source: 'diesel', emissions: 30 },
            { yearMonth: '2025-06', source: 'electricity', emissions: 75 },
            { yearMonth: '2025-08', source: 'lpg', emissions: 65 },
        ],
    },
]
let _companies = [...companies];

////////////////////////// 게시글
const posts = [
    {
        id: 'p1',
        title: '지속가능성 보고서',
        resourceUid: 'c1',
        dateTime: '2025-02',
        content: 'Acme Corp 분기별 CO2 업데이트',
    },
    {
        id: 'p2',
        title: 'Globex 2025 1분기 배출 요약',
        resourceUid: 'c2',
        dateTime: '2025-03',
        content: '3월 디젤 배출량이 증가했습니다.',
    },
    {
        id: 'p3',
        title: 'SK LPG 사용 현황',
        resourceUid: 'c3',
        dateTime: '2025-03',
        content: 'SK은 난방에 LPG 의존도가 높습니다.',
    },
    {
        id: 'p4',
        title: 'AstraZeneca 보고서',
        resourceUid: 'c4',
        dateTime: '2025-03',
        content: '3월에 에너지원 변화를 진행했습니다.',
    },
    {
        id: 'p5',
        title: 'Toyota 3월 보고서',
        resourceUid: 'c5',
        dateTime: '2025-03',
        content: '디젤 배출량이 감소했습니다.',
    },
    {
        id: 'p6',
        title: 'LVMH 배출 개요',
        resourceUid: 'c6',
        dateTime: '2025-03',
        content: '2월 전력 사용량이 증가했습니다.',
    },
]
let _posts = [...posts]

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

/* API 함수 */
//////////////////// 모든 국가
export async function fetchCountries() {
    await delay(jitter());
    return _countries;
}

//////////////////// 모든 회사
export async function fetchCompanies() {
    await delay(jitter());
    return _companies;
}

//////////////////// 모든 게시물을
export async function fetchPosts() {
    await delay(jitter());
    return _posts;
}


//////////////////// 새 게시물을 생성하거나 기존 게시물을 업데이트
export async function createOrUpdatePost(p: Omit<Post, 'id'> & { id?: string }) {
    await delay(jitter());
    // 쓰기 작업 실패를 시뮬레이션
    if (maybeFail()) throw new Error('Save failed');
    if (p.id) {
        // 기존 게시물 업데이트
        _posts = _posts.map(x => x.id === p.id ? (p as Post) : x);
        return p as Post
        // 찾지 못하면 새 게시물로 처리
    }

    // 새 게시물 생성
    const created = { ...p, id: crypto.randomUUID() };
    _posts = [..._posts, created];
    return created;
}