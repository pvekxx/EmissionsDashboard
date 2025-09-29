'use client';

import React, { useState } from 'react';
import NavDrawer from '../../components/layout/NavDrawer';
import Header from '../../components/layout/Header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCompanies, fetchPosts, createOrUpdatePost } from '../../lib/api';
import type { Post } from '../../lib/api';

export default function ReportsPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const getDefaultMonth = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
    };

    // 편집 중인 게시물 ID 및 폼 상태
    const [editId, setEditId] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [resourceUid, setResourceUid] = useState('');
    const [dateTime, setDateTime] = useState(getDefaultMonth());
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // 데이터 로딩
    const {
        data: companies,
        isPending: companiesPending,
        isError: companiesError,
    } = useQuery({ queryKey: ['companies'], queryFn: fetchCompanies });
    const {
        data: posts,
        isPending: postsPending,
        isError: postsError,
    } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

    // React Query 캐시를 위한 클라이언트
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createOrUpdatePost,
        onSuccess: () => {
            setEditId(undefined);
            setTitle('');
            setResourceUid('');
            setDateTime(getDefaultMonth());
            setContent('');
            setErrorMessage('');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error) => {
            setErrorMessage(error?.message || '게시물 저장 중 오류가 발생했습니다.');
        },
    });

    // 게시물 클릭 > 편집 모드 진입
    const handlePostClick = (post: Post) => {
        setEditId(post.id);
        setTitle(post.title);
        setResourceUid(post.resourceUid);
        setDateTime(post.dateTime);
        setContent(post.content || '');
    };

    // 저장/업데이트 처리
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim() || !resourceUid || !dateTime) {
            setErrorMessage('제목, 회사, 날짜를 모두 입력하세요.');
            return;
        }
        setErrorMessage('');
        mutation.mutate({
            id: editId,
            title,
            resourceUid,
            dateTime,
            content,
        });
    };

    // 취소 버튼 > 편집 모드 종료
    const handleCancel = () => {
        setEditId(undefined);
        setTitle('');
        setResourceUid('');
        setDateTime(getDefaultMonth());
        setContent('');
        setErrorMessage('');
    };

    // 회사명/게시물 목록 연결
    const postsWithCompany = posts?.map((post) => {
        const company = companies?.find((c) => c.id === post.resourceUid);
        return {
            ...post,
            companyName: company ? company.name : post.resourceUid,
        };
    });

    // 게시물 날짜별 내림차순 정렬
    postsWithCompany?.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

    return (
        <>
            <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <div className="min-h-screen bg-neutral-900">
                <Header
                    onToggleDrawer={() => setDrawerOpen((v) => !v)}
                    title="게시글"
                />
                <main className="p-4 space-y-6">
                    {/* 로딩/에러 표시 */}
                    {(companiesPending || postsPending) && (
                        <p className="text-neutral-300">데이터를 불러오는 중입니다…</p>
                    )}
                    {companiesError && (
                        <p className="text-red-400">회사 데이터를 불러오지 못했습니다.</p>
                    )}
                    {postsError && (
                        <p className="text-red-400">게시물 데이터를 불러오지 못했습니다.</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 왼쪽: 게시물 목록 카드 */}
                        <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 space-y-4 min-h-[300px]">
                            <h3 className="text-lg font-semibold text-neutral-200">전체 게시물 목록</h3>
                            {(!postsWithCompany || postsWithCompany.length === 0) ? (
                                <p className="text-neutral-400">게시물이 없습니다.</p>
                            ) : (
                                <ul className="divide-y divide-neutral-700/60 max-h-[480px] overflow-y-auto pr-1">
                                    {postsWithCompany.map((post) => (
                                        <li
                                            key={post.id}
                                            className={`relative group py-3 px-3 cursor-pointer rounded-xl transition-all duration-200 hover:bg-neutral-700 hover:translate-x-[4px]`}
                                            onClick={() => handlePostClick(post)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePostClick(post); } }}
                                            tabIndex={0}
                                            role="button"
                                            aria-label="게시물 선택"
                                        >
                                            {/* 왼쪽 포커스 바 */}
                                            <span
                                                className={`pointer-events-none absolute left-0 top-2 bottom-2 w-1 rounded-full bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity`}
                                                aria-hidden="true"
                                            />
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-neutral-100 truncate">{post.title}</span>
                                                    </div>
                                                    {post.content && (
                                                        <p className="mt-1 text-sm text-neutral-300 line-clamp-2">{post.content}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-sm text-neutral-400">{post.dateTime} ({post.companyName})</span>
                                                    <svg
                                                        className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* 오른쪽: 새 게시물 / 편집 폼 카드 */}
                        <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10">
                            <h3 className="text-lg font-semibold mb-2 text-neutral-200">{editId ? '게시물 수정' : '새 게시물 작성'}</h3>
                            {errorMessage && (
                                <p className="mb-2 text-sm text-red-400">{errorMessage}</p>
                            )}
                            <form onSubmit={handleSubmit} className="">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex flex-col">
                                        <label htmlFor="post-title" className="text-sm text-neutral-300">제목</label>
                                        <input
                                            id="post-title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="mt-1 p-1.5 text-neutral-100 border-b-1 border-neutral-600 text-sm"
                                            placeholder="제목을 입력하세요"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="post-company" className="text-sm text-neutral-300">회사</label>
                                        <select
                                            id="post-company"
                                            value={resourceUid}
                                            onChange={(e) => setResourceUid(e.target.value)}
                                            className="mt-1 p-1.5 text-neutral-100 border-b-1 border-neutral-600 text-sm bg-transparent"
                                        >
                                            <option value="">회사를 선택하세요</option>
                                            {companies?.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="post-date" className="text-sm text-neutral-300">날짜(월)</label>
                                    <input
                                        id="post-date"
                                        type="month"
                                        value={dateTime}
                                        onChange={(e) => setDateTime(e.target.value)}
                                        disabled
                                        title="오늘 월로 고정됨"
                                        className="mt-1 p-1.5 border-b-1 text-neutral-100 border-neutral-600 text-sm opacity-50 cursor-not-allowed"
                                    />
                                </div>

                                <div className="flex flex-col mt-3">
                                    <label htmlFor="post-content" className="text-sm text-neutral-300">내용(선택)</label>
                                    <textarea
                                        id="post-content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="mt-1 p-1.5 border-b-1 text-neutral-100 border-neutral-600 text-sm"
                                        rows={6}
                                        placeholder="내용을 입력하세요"
                                    />
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    {editId ? (
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="text-sm text-neutral-300 hover:text-neutral-100 underline underline-offset-4"
                                        >
                                            수정 취소
                                        </button>
                                    ) : <span />}

                                    <button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 text-neutral-500 text-sm font-medium hover:bg-neutral-500 hover:text-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                    >
                                        {mutation.isPending && (
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                        )}
                                        {mutation.isPending ? '저장 중…' : (editId ? '게시물 업데이트' : '게시물 저장')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}