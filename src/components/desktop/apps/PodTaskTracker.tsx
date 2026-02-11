'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Phone, Plus, X, Edit3 } from 'lucide-react'

type TaskSource = 'email' | 'slack' | 'call' | 'manual'
type TaskStatus = 'pending' | 'in-progress' | 'completed'
type PodMember = 'AE' | 'CSM' | 'SE'

interface Task {
  id: string
  title: string
  description: string
  assignee: PodMember
  customer: string
  source: TaskSource
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
}

// Dummy data
const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    title: 'Follow up on integration setup',
    description: 'Customer needs help setting up React error tracking',
    assignee: 'SE',
    customer: 'Acme Corp',
    source: 'slack',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-02-12',
    createdAt: '2026-02-11T10:30:00Z'
  },
  {
    id: '2',
    title: 'Quarterly business review prep',
    description: 'Prepare QBR deck showing usage metrics and ROI',
    assignee: 'CSM',
    customer: 'TechStart Inc',
    source: 'email',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-02-15',
    createdAt: '2026-02-11T09:15:00Z'
  },
  {
    id: '3',
    title: 'Contract renewal discussion',
    description: 'Schedule call to discuss renewal terms and expansion',
    assignee: 'AE',
    customer: 'Global Systems',
    source: 'call',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-02-13',
    createdAt: '2026-02-11T08:00:00Z'
  },
  {
    id: '4',
    title: 'Performance optimization consultation',
    description: 'Help customer optimize trace sampling rates',
    assignee: 'SE',
    customer: 'FastScale Labs',
    source: 'slack',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-02-11',
    createdAt: '2026-02-10T14:20:00Z'
  },
  {
    id: '5',
    title: 'Check in on product adoption',
    description: 'Review session replay usage and provide tips',
    assignee: 'CSM',
    customer: 'Acme Corp',
    source: 'email',
    status: 'in-progress',
    priority: 'low',
    dueDate: '2026-02-14',
    createdAt: '2026-02-11T11:00:00Z'
  },
  {
    id: '6',
    title: 'Demo AI monitoring features',
    description: 'Show new AI monitoring capabilities for LLM apps',
    assignee: 'SE',
    customer: 'AI Innovations',
    source: 'call',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-02-12',
    createdAt: '2026-02-11T13:45:00Z'
  }
]

const SOURCE_ICONS = {
  email: Mail,
  slack: MessageSquare,
  call: Phone,
  manual: Edit3
}

const PRIORITY_COLORS = {
  low: 'bg-green-500/20 text-green-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  high: 'bg-red-500/20 text-red-300'
}

const STATUS_COLORS = {
  pending: 'bg-gray-500/20 text-gray-300',
  'in-progress': 'bg-blue-500/20 text-blue-300',
  completed: 'bg-green-500/20 text-green-300'
}

const ASSIGNEE_COLORS = {
  AE: 'bg-purple-500/20 text-purple-300',
  CSM: 'bg-pink-500/20 text-pink-300',
  SE: 'bg-indigo-500/20 text-indigo-300'
}

export function PodTaskTracker() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS)
  const [filterAssignee, setFilterAssignee] = useState<PodMember | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignee: 'AE',
    customer: '',
    source: 'manual',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  })

  const filteredTasks = tasks.filter(task => {
    if (filterAssignee !== 'all' && task.assignee !== filterAssignee) return false
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    return true
  })

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const statusOrder: TaskStatus[] = ['pending', 'in-progress', 'completed']
        const currentIndex = statusOrder.indexOf(task.status)
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
        return { ...task, status: nextStatus }
      }
      return task
    }))
  }

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.customer) {
      alert('Please fill in title and customer')
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || '',
      assignee: newTask.assignee!,
      customer: newTask.customer!,
      source: newTask.source!,
      status: newTask.status!,
      priority: newTask.priority!,
      dueDate: newTask.dueDate!,
      createdAt: new Date().toISOString()
    }

    setTasks([task, ...tasks])
    setShowNewTaskForm(false)
    setNewTask({
      title: '',
      description: '',
      assignee: 'AE',
      customer: '',
      source: 'manual',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div className="h-full flex flex-col bg-[#0F0C14] text-white">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            POD Task Tracker
          </h1>
          <p className="text-sm text-gray-400">Sales POD Task Management for Customer Success</p>
        </div>
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-4 gap-3 border-b border-purple-500/20">
        <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
          <div className="text-2xl font-bold text-purple-300">{taskStats.total}</div>
          <div className="text-xs text-gray-400">Total Tasks</div>
        </div>
        <div className="bg-gray-500/10 rounded-lg p-3 border border-gray-500/20">
          <div className="text-2xl font-bold text-gray-300">{taskStats.pending}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-300">{taskStats.inProgress}</div>
          <div className="text-xs text-gray-400">In Progress</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
          <div className="text-2xl font-bold text-green-300">{taskStats.completed}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 flex gap-4 border-b border-purple-500/20">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">Filter by Role:</span>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value as PodMember | 'all')}
            className="bg-[#1a1626] border border-purple-500/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Roles</option>
            <option value="AE">Account Executive</option>
            <option value="CSM">Customer Success</option>
            <option value="SE">Solutions Engineer</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">Filter by Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
            className="bg-[#1a1626] border border-purple-500/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No tasks found matching filters
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#1a1626] border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors cursor-pointer"
              onClick={() => toggleTaskStatus(task.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const Icon = SOURCE_ICONS[task.source]
                      return <Icon size={18} className="text-purple-400" />
                    })()}
                    <h3 className="font-semibold text-white">{task.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-purple-300">👤 {task.customer}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${ASSIGNEE_COLORS[task.assignee]}`}>
                  {task.assignee}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[task.status]}`}>
                  {task.status}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority} priority
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      {showNewTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1626] border border-purple-500/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Create New Task</h2>
                <button
                  onClick={() => setShowNewTaskForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-[#0F0C14] border border-purple-500/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Follow up on integration setup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full bg-[#0F0C14] border border-purple-500/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                    placeholder="Add more details about this task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Customer *
                    </label>
                    <input
                      type="text"
                      value={newTask.customer}
                      onChange={(e) => setNewTask({ ...newTask, customer: e.target.value })}
                      className="w-full bg-[#0F0C14] border border-purple-500/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full bg-[#0F0C14] border border-purple-500/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assign To
                    </label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value as PodMember })}
                      className="w-full bg-[#0F0C14] border border-purple-500/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="AE">Account Executive</option>
                      <option value="CSM">Customer Success</option>
                      <option value="SE">Solutions Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                      className="w-full bg-[#0F0C14] border border-purple-500/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['email', 'slack', 'call', 'manual'] as TaskSource[]).map((source) => {
                      const Icon = SOURCE_ICONS[source]
                      return (
                        <button
                          key={source}
                          onClick={() => setNewTask({ ...newTask, source })}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded border transition-all ${
                            newTask.source === source
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                              : 'bg-[#0F0C14] border-purple-500/20 text-gray-400 hover:border-purple-500/40'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm capitalize">{source}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateTask}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Create Task
                </button>
                <button
                  onClick={() => setShowNewTaskForm(false)}
                  className="px-4 py-2 bg-[#0F0C14] border border-purple-500/20 text-gray-300 rounded-lg hover:border-purple-500/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
