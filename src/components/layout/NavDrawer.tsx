import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

export interface NavDrawerProps {
    // 드로어가 열려 있는지
    open: boolean;
    // 드로어를 닫을때
    onClose: () => void;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ open, onClose }) => {
    return (
        <>
            {/* 배경(Backdrop) */}
            <div
                className={clsx(
                    'fixed inset-0 z-40 bg-neutral-800/80 bg-opacity-25 transition-opacity',
                    {
                        'opacity-0 pointer-events-none': !open,
                        'opacity-100': open,
                    },
                )}
                onClick={onClose}
                aria-hidden={!open}
            />
            {/* 드로어 패널 */}
            <div
                className={clsx(
                    'fixed top-0 left-0 z-50 h-full w-64 max-w-full bg-neutral-900 shadow-lg transition-transform',
                    {
                        '-translate-x-full': !open,
                        'translate-x-0': open,
                    },
                )}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 left-5 text-neutral-400 hover:text-neutral-200"
                    aria-label="닫기"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <nav className="h-full overflow-y-auto pl-6 pt-20 flex flex-col space-y-6">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="text-neutral-100 hover:text-neutral-500"
                    >
                        대시보드 홈
                    </Link>
                    <Link
                        href="/companies"
                        onClick={onClose}
                        className="text-neutral-100 hover:text-neutral-500"
                    >
                        회사별 분석
                    </Link>
                    <Link
                        href="/countries"
                        onClick={onClose}
                        className="text-neutral-100 hover:text-neutral-500"
                    >
                        국가별 분석
                    </Link>
                    <Link
                        href="/reports"
                        onClick={onClose}
                        className="text-neutral-100 hover:text-neutral-500"
                    >
                        게시글
                    </Link>
                </nav>
            </div>
        </>
    );
};

export default NavDrawer;