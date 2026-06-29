# Suppression de tâches côté frontend (temporaire)

- Lorsqu'une tâche est supprimée (croix), son ID est stocké dans `localStorage` (`dashboard.todo.hidden.v1`).
- Les tâches supprimées ne sont plus affichées, même après refresh.
- Cette logique est temporaire : dès que le backend gère la suppression, il faudra supprimer ce code et utiliser l'API.
- Point d'intégration prévu : fonction `deleteTodoOnBackend(id)` à appeler lors de la suppression.
- En mode Mock, la suppression est désactivée (un toast s'affiche).
