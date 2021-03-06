import React, { useState, createContext, } from 'react';
export const TodoListContext = createContext()

export const INITIAL_TODO_LIST = [{ id: 1, name: "GUY", isActive: true, category: "Friends", sortIndex: 3 },
{ id: 66777, name: "GUY2", isActive: true, category: "Sport", sortIndex: 4 },
{ id: 2, name: "GUY3", isActive: false, category: "Study", sortIndex: 15 }]

const TODOS_INITIAL_VALUES = {
  INITIAL_TODO_LIST,
}
export const ToDoListProvider = (props) => {
  const [todoList, setTodoList] = useState(TODOS_INITIAL_VALUES.INITIAL_TODO_LIST)

  return (
    <TodoListContext.Provider value={[todoList, setTodoList]}>
      {props.children}
    </TodoListContext.Provider>
  )
}