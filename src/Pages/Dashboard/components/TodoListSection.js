import { useEffect, useMemo, useState } from "react";
import { FiCheck } from "react-icons/fi";
import DashboardSection from "./DashboardSection";

const COMPLETION_RETENTION_MS = 24 * 60 * 60 * 1000;
const TODO_STORAGE_KEY = "dashboard.todo.completion.v1";

const getTodoKey = (item, index) => {
  if (item?.id) return String(item.id);

  const route = item?.action?.route || "todo";
  const label = item?.label || "task";
  return `${route}::${label}::${index}`;
};

const TodoListSection = ({ section, loading, error, t }) => {
  const items = section?.items || [];
  const [completionMap, setCompletionMap] = useState({});
  const [now, setNow] = useState(Date.now());
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TODO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setCompletionMap(parsed);
        }
      }
    } catch {
      setCompletionMap({});
    } finally {
      setIsStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(completionMap));
  }, [completionMap, isStorageReady]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const normalizedItems = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      _todoKey: getTodoKey(item, index),
    }));
  }, [items]);

  const visibleItems = useMemo(() => {
    return normalizedItems.filter((item) => {
      const completedAt = completionMap[item._todoKey];
      if (!completedAt) return true;
      return now - completedAt < COMPLETION_RETENTION_MS;
    });
  }, [normalizedItems, completionMap, now]);

  const isDone = (todoKey) => {
    const completedAt = completionMap[todoKey];
    if (!completedAt) return false;
    return now - completedAt < COMPLETION_RETENTION_MS;
  };

  const toggleTodoStatus = (todoKey) => {
    setCompletionMap((prev) => {
      if (prev[todoKey]) {
        const updated = { ...prev };
        delete updated[todoKey];
        return updated;
      }

      return {
        ...prev,
        [todoKey]: Date.now(),
      };
    });
  };

  return (
    <DashboardSection
      title={section?.title || t("dashboard.todo.title", "To do list")}
      subtitle={section?.subtitle || t("dashboard.todo.subtitle", "Actions to drive your real-estate project")}
      loading={loading}
      error={error}
      alwaysVisible
    >
      {visibleItems.length === 0 ? (
        <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>
          {t(
            "dashboard.todo.emptyMessage",
            "Here will be displayed actions you need to take to drive your real estate project to success"
          )}
        </p>
      ) : (
        <div className="todo-grid">
          {visibleItems.map((item) => {
            const done = isDone(item._todoKey);

            return (
            <a
              key={item._todoKey}
              href={item?.action?.route || "#"}
              className={`todo-card ${done ? "todo-card-done" : ""}`}
            >
              <div className="todo-card-head">
                <button
                  type="button"
                  className={`todo-status-btn ${done ? "done" : "pending"}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleTodoStatus(item._todoKey);
                  }}
                  aria-label={
                    done
                      ? t("dashboard.todo.markAsPending", "Marquer la tache comme en attente")
                      : t("dashboard.todo.markAsCompleted", "Marquer la tache comme terminee")
                  }
                >
                  <FiCheck className="todo-status-check-icon" />
                </button>
              </div>
              <p className="todo-card-title">{item.label}</p>
              <div className="todo-card-divider" />
              <div className="todo-card-info-zone">
                <div className="todo-card-meta">
                  <img
                    src={item?.property?.coverUrl || "/assets/img/placeholder.png"}
                    alt="property"
                    className="todo-card-property-image"
                  />
                  <div className="todo-card-property-meta">
                    <p>
                      {
                        `${item?.property?.type || t("dashboard.todo.propertyFallbackType", "Bien")}, ` +
                        `${item?.property?.surface || 0}${t("dashboard.units.sqm", "m2")} ` +
                        `${t("dashboard.todo.propertyInCity", "a")} ${item?.property?.city || "-"}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </a>
          );
          })}
        </div>
      )}
    </DashboardSection>
  );
};

export default TodoListSection;
