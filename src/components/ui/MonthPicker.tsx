import React from 'react';

export interface MonthPickerProps {
    value: string; // YYYY-MM
    onChange: (val: string) => void;
    className?: string;
}

function pad2(n: number) { return String(n).padStart(2, '0'); }
function parseYear(value: string): number {
    const [y] = value.split('-');
    const yr = parseInt(y, 10);
    return Number.isFinite(yr) ? yr : new Date().getFullYear();
}

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange, className }) => {
    const [open, setOpen] = React.useState(false);
    const [year, setYear] = React.useState(parseYear(value));
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    React.useEffect(() => {
        setYear(parseYear(value));
    }, [value]);

    const handlePick = (m: number) => {
        onChange(`${year}-${pad2(m)}`);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className={cx('relative inline-block', className)}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="px-3 py-1 rounded-full border border-neutral-600 bg-neutral-700 text-neutral-100 text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-40 "
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                {value || `${year}-${pad2(new Date().getMonth() + 1)}`}
            </button>
            {open && (
                <div className="absolute z-50 mt-2 w-56 rounded-4xl border border-neutral-700 bg-neutral-900 text-gray-100 shadow-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            type="button"
                            onClick={() => setYear((y) => y - 1)}
                            className="px-2 py-1 rounded hover:bg-neutral-700"
                            aria-label="이전 연도"
                        >
                            ◀
                        </button>
                        <span className="font-semibold text-gray-50">{year}</span>
                        <button
                            type="button"
                            onClick={() => setYear((y) => y + 1)}
                            className="px-2 py-1 rounded hover:bg-neutral-700"
                            aria-label="다음 연도"
                        >
                            ▶
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                            const mm = pad2(m);
                            const isActive = value === `${year}-${mm}`;
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handlePick(m)}
                                    className={cx(
                                        'px-2 py-1 rounded-full text-sm border',
                                        isActive
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-neutral-800 text-gray-100 border-neutral-700 hover:bg-neutral-700'
                                    )}
                                >
                                    {mm}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthPicker;