"use client"
import React, { useCallback } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'API Gateway' }, style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'Authentication' }, style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' } },
  { id: '3', position: { x: 400, y: 100 }, data: { label: 'Payments' }, style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' } },
  { id: '4', position: { x: 400, y: 200 }, data: { label: 'RabbitMQ (MQ)' }, style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' } },
  { id: '5', position: { x: 400, y: 300 }, data: { label: 'Settlement' }, style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' } },
  { id: '6', position: { x: 100, y: 200 }, data: { label: 'Certificate Manager' }, style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' } },
  { id: '7', position: { x: 250, y: 400 }, data: { label: 'Core Banking' }, style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' } },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ffffff50' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#ffffff50' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e2-6', source: '2', target: '6', style: { stroke: '#ffffff50' } },
  { id: 'e5-7', source: '5', target: '7', style: { stroke: '#ffffff50' } },
]

import { useSentinelStore } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchIncidentDetails = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents/${id}`)
  return response.data
}

export default function SystemMap() {
  const { selectedIncidentId } = useSentinelStore()
  
  const { data: incident } = useQuery({
    queryKey: ['incident', selectedIncidentId],
    queryFn: () => fetchIncidentDetails(selectedIncidentId!),
    enabled: !!selectedIncidentId,
  })

  // Dynamic nodes calculation
  const getNodes = () => {
    return initialNodes.map(node => {
      const isAffected = incident && (node.data.label.includes(incident.component) || node.data.label.includes(incident.application))
      if (isAffected) {
        return {
          ...node,
          style: { background: '#ef444420', color: '#f87171', border: '1px solid #ef4444', borderRadius: '8px', boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' }
        }
      }
      return {
        ...node,
        style: { background: '#1e1e2d', color: '#fff', border: '1px solid #ffffff1a', borderRadius: '8px' }
      }
    })
  }

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when incident changes
  React.useEffect(() => {
    setNodes(getNodes())
  }, [incident])

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls style={{ backgroundColor: '#1e1e2d', color: '#fff' }} />
        <MiniMap nodeColor="#4f46e5" maskColor="rgba(0,0,0,0.5)" style={{ backgroundColor: '#1e1e2d' }} />
        <Background gap={12} size={1} color="#ffffff10" />
      </ReactFlow>
    </div>
  )
}
