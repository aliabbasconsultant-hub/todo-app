<template>
  <div class="container">
    <div class="card">
      <h1>My Todo List</h1>

      <div class="add-todo">
        <input
          v-model="newTitle"
          @keyup.enter="addTodo"
          placeholder="Add a new todo and press Enter..."
          class="input"
        />
        <button @click="addTodo" class="btn btn-add">Add</button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>

      <div v-else>
        <div v-if="todos.length === 0" class="empty">No todos yet! Add one above.</div>

        <div class="todo-list">
          <div
            v-for="todo in todos"
            :key="todo.id"
            class="todo-item"
            :class="{ completed: todo.completed && editingId !== todo.id }"
          >
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo)"
              class="checkbox"
            />

            <input
              v-if="editingId === todo.id"
              v-model="editingTitle"
              @keyup.enter="saveEdit(todo)"
              @keyup.escape="cancelEdit"
              class="edit-input"
              autofocus
            />
            <span v-else class="todo-title">{{ todo.title }}</span>

            <div class="btn-group">
              <template v-if="editingId === todo.id">
                <button @click="saveEdit(todo)" class="btn btn-save">Save</button>
                <button @click="cancelEdit" class="btn btn-cancel">Cancel</button>
              </template>
              <template v-else>
                <button @click="startEdit(todo)" class="btn btn-edit">Edit</button>
                <button @click="deleteTodo(todo.id)" class="btn btn-delete">Delete</button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="stats" v-if="todos.length > 0">
        {{ completedCount }} of {{ todos.length }} completed
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API = 'http://34.234.70.255:3000/api/todos'

interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

const todos = ref<Todo[]>([])
const newTitle = ref('')
const loading = ref(false)
const editingId = ref<number | null>(null)
const editingTitle = ref('')

const completedCount = computed(() => todos.value.filter(t => t.completed).length)

async function fetchTodos() {
  loading.value = true
  try {
    const res = await axios.get(API)
    todos.value = res.data
  } catch (e) {
    console.error('Error fetching todos:', e)
  } finally {
    loading.value = false
  }
}

async function addTodo() {
  if (!newTitle.value.trim()) return
  try {
    const res = await axios.post(API, { title: newTitle.value, completed: false })
    todos.value.push(res.data)
    newTitle.value = ''
  } catch (e) {
    console.error('Error adding todo:', e)
  }
}

async function toggleTodo(todo: Todo) {
  try {
    const res = await axios.put(`${API}/${todo.id}`, { completed: !todo.completed })
    const index = todos.value.findIndex(t => t.id === todo.id)
    todos.value[index] = res.data
  } catch (e) {
    console.error('Error updating todo:', e)
  }
}

function startEdit(todo: Todo) {
  editingId.value = todo.id
  editingTitle.value = todo.title
}

function cancelEdit() {
  editingId.value = null
  editingTitle.value = ''
}

async function saveEdit(todo: Todo) {
  if (!editingTitle.value.trim()) return
  try {
    const res = await axios.put(`${API}/${todo.id}`, { title: editingTitle.value })
    const index = todos.value.findIndex(t => t.id === todo.id)
    todos.value[index] = res.data
    cancelEdit()
  } catch (e) {
    console.error('Error saving edit:', e)
  }
}

async function deleteTodo(id: number) {
  try {
    await axios.delete(`${API}/${id}`)
    todos.value = todos.value.filter(t => t.id !== id)
  } catch (e) {
    console.error('Error deleting todo:', e)
  }
}

onMounted(fetchTodos)
</script>

<style scoped>
.container {
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
}
.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 520px;
  min-width: 520px;
  max-width: 520px;
}
h1 { font-size: 28px; font-weight: 700; margin-bottom: 24px; color: #1a1a2e; }
.add-todo { display: flex; gap: 12px; margin-bottom: 24px; }
.input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  min-width: 0;
}
.input:focus { border-color: #667eea; }
.todo-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}
.todo-list::-webkit-scrollbar { width: 4px; }
.todo-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
.todo-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.todo-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.btn {
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}
.btn:hover { opacity: 0.85; }
.btn-add { background: #667eea; color: white; padding: 12px 20px; font-size: 15px; }
.btn-edit { background: #EBF4FF; color: #185FA5; padding: 6px 14px; }
.btn-delete { background: #fee2e2; color: #dc2626; padding: 6px 14px; }
.btn-save { background: #E1F5EE; color: #0F6E56; padding: 6px 14px; }
.btn-cancel { background: #f1f5f9; color: #64748b; padding: 6px 14px; }
.btn-group {
  display: flex;
  gap: 6px;
  width: 150px;
  min-width: 150px;
  max-width: 150px;
  justify-content: flex-end;
  flex-shrink: 0;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-radius: 10px;
  margin-bottom: 8px;
  background: #f8fafc;
  height: 52px;
  min-height: 52px;
  max-height: 52px;
  width: 100%;
  box-sizing: border-box;
}
.todo-item:hover { background: #f1f5f9; }
.todo-item.completed .todo-title { text-decoration: line-through; color: #94a3b8; }
.checkbox { width: 18px; height: 18px; cursor: pointer; accent-color: #667eea; flex-shrink: 0; }
.todo-title {
  flex: 1;
  font-size: 15px;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.edit-input {
  flex: 1;
  min-width: 0;
  width: 0;
  padding: 6px 10px;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}
.empty { text-align: center; color: #94a3b8; padding: 40px 0; font-size: 15px; }
.loading { text-align: center; color: #667eea; padding: 40px 0; }
.stats { margin-top: 20px; text-align: center; font-size: 13px; color: #94a3b8; }
</style>