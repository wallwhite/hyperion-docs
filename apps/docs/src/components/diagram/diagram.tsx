'use client';

import React, { forwardRef, useId } from 'react';
import { ExpandIcon, LoaderIcon } from 'lucide-react';
import { LANG_NAME_MAP, SupportedLanguages } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { GraphvizIcon, MermaidIcon, PlantumlIcon } from '../icons';
import { useModal } from '../modal-launcher';
import { PreviewModal } from '../preview-modal';
import { ExportMenu } from './export-menu';
import { useSvgDiagramMarkup } from './hooks';
import { type DiagramParams } from './types';

type DiagramProps = DiagramParams & {
  className?: string;
};

const IconMap = {
  [SupportedLanguages.puml]: PlantumlIcon,
  [SupportedLanguages.mermaid]: MermaidIcon,
  [SupportedLanguages.graphviz]: GraphvizIcon,
};

export const Diagram = forwardRef<HTMLDivElement, DiagramProps>(({ lang, path, className, chart }, ref) => {
  const diagramId = useId();
  const { svg, isLoading } = useSvgDiagramMarkup({ lang, path, chart });

  const modal = useModal(PreviewModal);

  const handleOpenWhiteboardModal = () => {
    modal.open({ svg }).catch(() => {
      console.error('Error while opening modal');
    });
  };

  const Icon = IconMap[lang as keyof typeof IconMap] || PlantumlIcon;

  return (
    <div
      ref={ref}
      className={cn(
        'flex relative flex-col bg-white p-2 border rounded-lg w-full min-h-[320px] overflow-hidden',
        className,
      )}
    >
      {!isLoading && (
        <div className="flex justify-between items-center bg-zinc-100 px-3 py-2 border border-zinc-300 rounded-md">
          <div className="flex items-center gap-2 font-semibold text-md text-zinc-700">
            <Icon className="size-4" />
            {LANG_NAME_MAP[lang as keyof typeof LANG_NAME_MAP]} Diagram Preview
          </div>
          <div className="flex items-center gap-2">
            <ExportMenu svg={svg} diagramId={diagramId} />
            <button
              type="button"
              className="group flex items-center gap-2 bg-zinc-300 hover:bg-zinc-400/50 p-2 rounded-md text-zinc-700 text-xs transition-colors duration-200 cursor-pointer"
              onClick={handleOpenWhiteboardModal}
            >
              <ExpandIcon className="size-3 group-hover:scale-120 transition-transform duration-200" />
              Open Whiteboard
            </button>
          </div>
        </div>
      )}
      {!!isLoading && (
        <div className="top-0 left-0 absolute flex justify-center items-center gap-2 w-full h-full text-zinc-900">
          <LoaderIcon role="status" aria-label="Loading" className={cn('size-6 animate-spin', className)} /> Loading...
        </div>
      )}
      <div
        data-diagram-id={diagramId}
        className="flex justify-center items-center w-full [&>svg]:!w-full h-full [&>svg]:!h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
});

Diagram.displayName = 'Diagram';
