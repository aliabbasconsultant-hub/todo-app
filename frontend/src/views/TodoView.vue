<template>
  <div class="container">
    <div class="card">
      <h1>My Todo List</h1>

      <!-- Add Todo -->
      <div class="add-todo">
        <input
          v-model="newTitle"
          @keyup.enter="addTodo"
          placeholder="Add a new todo and press Enter..."
          class="input"
        />
        <button @click="addTodo" class="btn btn-add">Add</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">Loading...</div>

      <!-- Todo List -->
      <div v-else>
        <div v-if="todos.length === 0" class="empty">
          No todos yet! Add one above.
        </div>
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed }"
        >
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
            class="checkbox"
          />
          <span class="todo-title">{{ todo.title }}</span>
          <button @click="deleteTodo(todo.id)" class="btn btn-delete">Delete</button>
        </div>
      </div>

      <!-- Stats -->
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
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}
.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1a1a2e;
}
.add-todo {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: #667eea;
}
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.85; }
.btn-add {
  background: #667eea;
  color: white;
}
.btn-delete {
  background: #fee2e2;
  color: #dc2626;
  padding: 8px 14px;
  font-size: 13px;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  margin-bottom: 8px;
  background: #f8fafc;
  transition: background 0.2s;
}
.todo-item:hover { background: #f1f5f9; }
.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: #94a3b8;
}
.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}
.todo-title {
  flex: 1;
  font-size: 15px;
  color: #334155;
}
.empty {
  text-align: center;
  color: #94a3b8;
  padding: 40px 0;
  font-size: 15px;
}
.loading {
  text-align: center;
  color: #667eea;
  padding: 40px 0;
}
.stats {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}
</style>