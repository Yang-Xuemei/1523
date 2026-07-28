import { useEffect, useMemo, useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.css'

type TodoStatus = 'active' | 'done'
type Filter = 'all' | 'active' | 'done'

interface Todo {
  id: string
  text: string
  status: TodoStatus
  createdAt: number
}

const STORAGE_KEY = 'todo_list_v1'

function loadTodos(): Todo[] {
  try {
    const raw = Taro.getStorageSync<string>(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Todo[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t) => t && typeof t.id === 'string' && typeof t.text === 'string' && (t.status === 'active' || t.status === 'done')
    )
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]): void {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // 写入失败不影响当前会话使用
  }
}

function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '进行中' },
  { key: 'done', label: '已完成' },
]

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const counts = useMemo(() => {
    const done = todos.filter((t) => t.status === 'done').length
    const active = todos.length - done
    return { all: todos.length, active, done }
  }, [todos])

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => t.status === 'active')
    if (filter === 'done') return todos.filter((t) => t.status === 'done')
    return todos
  }, [todos, filter])

  const addTodo = () => {
    const text = draft.trim()
    if (!text) {
      Taro.showToast({ title: '请输入任务内容', icon: 'none', duration: 1200 })
      return
    }
    const todo: Todo = { id: genId(), text, status: 'active', createdAt: Date.now() }
    setTodos((prev) => [todo, ...prev])
    setDraft('')
  }

  const onInputConfirm = () => {
    addTodo()
  }

  const toggleStatus = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'active' ? 'done' : 'active' } : t))
    )
  }

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <View className='todo'>
      <View className='todo__header'>
        <Text className='todo__title'>今日待办</Text>
        <Text className='todo__subtitle'>{counts.active > 0 ? `还有 ${counts.active} 件未完成` : '一切已就绪'}</Text>
      </View>

      <View className='todo__composer'>
        <Input
          className='todo__input'
          type='text'
          value={draft}
          placeholder='输入任务，按 Enter 或点击 + 添加'
          maxlength={60}
          onInput={(e) => setDraft(e.detail.value)}
          onConfirm={onInputConfirm}
          confirmType='done'
        />
        <View className='todo__add' onClick={addTodo}>
          <Text className='todo__add-text'>＋</Text>
        </View>
      </View>

      <View className='todo__stats'>
        <View className='todo__stat'>
          <Text className='todo__stat-num'>{counts.all}</Text>
          <Text className='todo__stat-label'>全部</Text>
        </View>
        <View className='todo__stat todo__stat--active'>
          <Text className='todo__stat-num'>{counts.active}</Text>
          <Text className='todo__stat-label'>进行中</Text>
        </View>
        <View className='todo__stat todo__stat--done'>
          <Text className='todo__stat-num'>{counts.done}</Text>
          <Text className='todo__stat-label'>已完成</Text>
        </View>
      </View>

      <View className='todo__filters'>
        {FILTERS.map((f) => (
          <View
            key={f.key}
            className={`todo__filter ${filter === f.key ? 'todo__filter--on' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            <Text className='todo__filter-text'>{f.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView className='todo__list-scroll' scrollY enableFlex>
        {visibleTodos.length === 0 ? (
          <View className='todo__empty'>
            <Text className='todo__empty-emoji'>🗒️</Text>
            <Text className='todo__empty-text'>
              {filter === 'all' ? '还没有任务，先添加一条吧' : filter === 'active' ? '没有进行中的任务' : '还没有已完成的任务'}
            </Text>
          </View>
        ) : (
          <View className='todo__list'>
            {visibleTodos.map((t) => (
              <View key={t.id} className={`todo__item ${t.status === 'done' ? 'todo__item--done' : ''}`}>
                <View className='todo__check' onClick={() => toggleStatus(t.id)}>
                  <Text className='todo__check-mark'>{t.status === 'done' ? '✓' : ''}</Text>
                </View>
                <Text className='todo__item-text'>{t.text}</Text>
                <View className='todo__del' onClick={() => removeTodo(t.id)}>
                  <Text className='todo__del-text'>删除</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
