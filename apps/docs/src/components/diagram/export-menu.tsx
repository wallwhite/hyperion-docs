'use client';

import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { DownloadIcon, FileImageIcon, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportAsPng, exportAsSvg } from './export-utils';

interface ExportMenuProps {
  svg: string;
  diagramId?: string;
  className?: string;
}

const EXPORT_OPTIONS = [
  { label: 'PNG', icon: FileImageIcon, action: exportAsPng },
  { label: 'SVG', icon: ImageIcon, action: exportAsSvg },
] as const;

export const ExportMenu: FC<ExportMenuProps> = ({ svg, diagramId, className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(
    async (action: (svg: string, filename?: string, diagramId?: string) => void | Promise<void>) => {
      setOpen(false);
      await action(svg, undefined, diagramId);
    },
    [svg, diagramId],
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        className="group flex items-center gap-2 bg-zinc-300 hover:bg-zinc-400/50 p-2 rounded-md text-zinc-700 text-xs transition-colors duration-200 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <DownloadIcon className="size-3 group-hover:scale-120 transition-transform duration-200" />
        Export
      </button>
      {open && (
        <div className="right-0 z-50 absolute border-zinc-300 bg-white shadow-lg mt-1 border rounded-md min-w-[120px] overflow-hidden">
          {EXPORT_OPTIONS.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-2 hover:bg-zinc-100 px-3 py-2 w-full text-left text-sm text-zinc-700 transition-colors duration-150 cursor-pointer"
              onClick={() => {
                handleExport(action).catch(() => {
                  console.error(`Export as ${label} failed`);
                });
              }}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
