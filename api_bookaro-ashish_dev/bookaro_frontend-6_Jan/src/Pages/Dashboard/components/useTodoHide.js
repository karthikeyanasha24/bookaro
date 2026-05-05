// Gestion de la persistance des tâches supprimées côté frontend
// Cette logique doit être supprimée dès que le backend gère la suppression

const HIDDEN_TODOS_KEY = "dashboard.todo.hidden.v1";

export function getHiddenTodos() {
  try {
    const raw = localStorage.getItem(HIDDEN_TODOS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addHiddenTodo(id) {
  const current = getHiddenTodos();
  if (!current.includes(id)) {
    localStorage.setItem(HIDDEN_TODOS_KEY, JSON.stringify([...current, id]));
  }
}

export function removeHiddenTodo(id) {
  const current = getHiddenTodos();
  localStorage.setItem(HIDDEN_TODOS_KEY, JSON.stringify(current.filter((x) => x !== id)));
}
