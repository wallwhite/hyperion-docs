'use client';

import React, { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
  type ReactFlowInstance,
} from '@xyflow/react';
import { ImageNode } from './nodes/image-node';
import '@xyflow/react/dist/style.css';

interface WhiteboardProps {
  svg: string;
  messages?: string[];
}

export const Whiteboard: FC<WhiteboardProps> = ({ svg, messages }) => {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const initialNodes: Node[] = useMemo(
    () => [
      {
        id: 'diagram',
        type: 'image',
        position: { x: 0, y: 0 },
        data: { svg, messages },
        style: {
          width: 'auto',
          height: 'auto',
          background: 'transparent',
          border: 'none',
        },
      },
    ],
    [svg, messages],
  );

  const nodeTypes = {
    image: ImageNode,
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const onLoad = useCallback((ref: ReactFlowInstance) => {
    setReactFlowInstance(ref);
  }, []);

  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      reactFlowInstance.fitView().catch(() => {
        console.error('Failed to fit view');
      });
    }
  }, [reactFlowInstance, nodes]);

  useEffect(() => {
    setNodes(initialNodes);
  }, [svg, messages]);

  return (
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      attributionPosition="bottom-left"
      elementsSelectable={false}
      nodesDraggable={false}
      maxZoom={20}
      minZoom={0.1}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onLoad}
    >
      <Background gap={10} size={1} />
      <Controls orientation="vertical" position="top-left" showInteractive={false} />
      <MiniMap className="right-0 bottom-0 absolute opacity-50 scale-50 origin-bottom-right" />
    </ReactFlow>
  );
};
