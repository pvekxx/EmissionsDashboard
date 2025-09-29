import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrUpdatePost } from '../../lib/api';
import type { Post } from '../../lib/api';

export interface PostListProps {
    // 페이지에서 useQuery로 가져온 값을 전달하는 전체 게시물 배열
    posts: Post[];
    // 현재 선택된 회사의 ID
    companyId: string;
}

const PostList: React.FC<PostListProps> = ({ posts, companyId }) => {
    const getDefaultMonth = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
    };

    // 새 게시물 입력 상태
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState(getDefaultMonth());
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createOrUpdatePost,
        onSuccess: () => {
            // 성공 시 입력값 초기화 후 포스트 목록 새로 고침
            setTitle('');
            setDateTime(getDefaultMonth());
            setContent('');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setEditingId(null);
        },
        onError: (error: any) => {
            setErrorMessage(error?.message || '게시물 저장 중 오류가 발생했습니다.');
        },
    });

    // 선택된 회사와 연관된 게시물만 필터링
    const filteredPosts = posts.filter((p) => p.resourceUid === companyId);

    const enterEdit = (post: Post) => {
        setEditingId(post.id);
        setTitle(post.title || '');
        setDateTime(post.dateTime || getDefaultMonth());
        setContent(post.content || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTitle('');
        setDateTime(getDefaultMonth());
        setContent('');
    };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 필수 입력 확인
        if (!title.trim() || !dateTime) {
            setErrorMessage('제목과 날짜를 모두 입력해 주세요.');
            return;
        }
        setErrorMessage('');
        mutation.mutate({
            title,
            resourceUid: companyId,
            dateTime,
            content,
            ...(editingId ? { id: editingId } : {}),
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 왼쪽: 게시물 목록 카드 */}
            <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10 space-y-4 min-h-[300px]">
                <h3 className="text-lg font-semibold text-neutral-200">관련 게시물</h3>
                {filteredPosts.length === 0 ? (
                    <p className="text-neutral-400">게시물이 없습니다.</p>
                ) : (
                    <ul className="divide-y divide-neutral-700/60 max-h-[420px] overflow-y-auto pr-1">
                        {filteredPosts.map((post) => (
                            <li
                                key={post.id}
                                className={`relative group py-3 px-3 cursor-pointer rounded-xl transition-all duration-200 ${editingId === post.id ? 'bg-neutral-700 translate-x-[4px]' : 'hover:bg-neutral-700  hover:translate-x-[4px]'}`}
                                onClick={() => enterEdit(post)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enterEdit(post); } }}
                                tabIndex={0}
                                role="button"
                                aria-label="게시물 수정"
                            >
                                {/* 왼쪽 포커스 바 */}
                                <span
                                    className={`pointer-events-none absolute left-0 top-2 bottom-2 w-1 rounded-full transition-opacity ${editingId === post.id ? 'bg-neutral-100 opacity-100' : 'bg-neutral-100 opacity-0 group-hover:opacity-100'}`}
                                    aria-hidden="true"
                                />

                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-neutral-100 truncate">{post.title}</span>
                                        </div>
                                        {post.content && (
                                            <p className="mt-1 text-sm text-neutral-300 line-clamp-2">
                                                {post.content}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm text-neutral-400">{post.dateTime}</span>
                                        {/* 우측 > hover 시 나타남 */}
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

            {/* 오른쪽: 새 게시물 작성 카드 */}
            <div className="bg-neutral-800 p-4 rounded-4xl border border-white/10">
                <form onSubmit={handleSubmit} className="">
                    <h4 className="text-md font-semibold mb-2 text-neutral-200">
                        {editingId ? '게시물 수정' : '새 게시물 작성'}
                    </h4>
                    {errorMessage && (
                        <p className="mb-2 text-sm text-red-400">{errorMessage}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label htmlFor="post-title" className="text-sm text-neutral-300">
                                제목
                            </label>
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
                            <label htmlFor="post-date" className="text-sm text-neutral-300">
                                날짜(월)
                            </label>
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
                    </div>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="post-content" className="text-sm text-neutral-300">
                            내용
                        </label>
                        <textarea
                            id="post-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 p-1.5 border-b-1 text-neutral-100 border-neutral-600 text-sm"
                            rows={6}
                            placeholder="내용을 입력하세요 (선택)"
                        />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        {editingId ? (
                            <button
                                type="button"
                                onClick={cancelEdit}
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
                            {mutation.isPending ? '저장 중…' : (editingId ? '게시물 업데이트' : '게시물 저장')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostList;