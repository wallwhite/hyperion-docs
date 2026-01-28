'use client';

import { type FC } from 'react';
import { XIcon } from 'lucide-react';
import { ExportMenu } from './diagram/export-menu';
import { useModalContext } from './modal-launcher';
import { Whiteboard } from './whiteboard/whiteboard';

interface PreviewModalProps {
  svg: string;
}

export const PreviewModal: FC<PreviewModalProps> = ({ svg }) => {
  const { close } = useModalContext();

  return (
    <div
      role="button"
      tabIndex={0}
      className="top-0 left-0 z-50 fixed flex justify-center items-center bg-zinc-800/20 backdrop-blur-xs outline-none w-full h-full"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          close();
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <div
        role="button"
        tabIndex={0}
        className="bg-white border rounded-lg w-full max-w-6xl h-full max-h-[85vh] overflow-hidden"
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center p-4 border-zinc-300 border-b h-[52px]">
          <span className="font-bold text-zinc-700 text-lg">Diagram Preview</span>
          <div className="flex items-center gap-2">
            <ExportMenu svg={svg} />
            <button
              type="button"
              className="group flex justify-center items-center hover:bg-zinc-100 border border-zinc-300 rounded-lg size-8 text-zinc-700 text-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 justify-center items-stretch h-[calc(100%-52px)] overflow-hidden">
          <Whiteboard svg={svg} />
        </div>
      </div>
    </div>
  );
};
