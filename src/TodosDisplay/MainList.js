import React, { useState, useEffect, useContext, useCallback } from 'react';
import AddItem from './AddItem';
import Filters from '../Filters/Filters';
import { INITIAL_TODO_LIST } from '../StateManagment/TodoListState'
import { updateLocalStorageByState } from '../LocalStorage/localStorageManagment'
import { TodoListContext } from '../StateManagment/TodoListState'
import { postNewTodo, deleteTodoMethod, putUpdatedTodo } from '../ServerRequests/Requests'
//import { FilteredTodosContext } from '../StateManagment/FilteredArrayState'
import { createUseStyles } from 'react-jss'
//import { allFilter } from '../Filters/FilterConstants'
import { Link } from 'react-router-dom'
import SortableTodoContainer from './SortableTodoContainer';

const useStyles = createUseStyles({
  "headerStyle": {
    "textAlign": "center",
    "height": "100px"
  },
  editCategories: {
    width: '10%',
    fontSize: '20px',
    backgroundColor: 'dodgerblue'
  }
})

const MAIN_LIST_STATE_INITIAL_VALUES = {
  todoList: INITIAL_TODO_LIST,
  searchedName: '',
  searchedCategory: '',
}

const MainList = () => {
  const [searchedName, setSearchedName] = useState(MAIN_LIST_STATE_INITIAL_VALUES.searchedName)
  const [todoList, setTodoList] = useContext(TodoListContext)
  const [searchedCategory, setSearchedCategory] = useState(MAIN_LIST_STATE_INITIAL_VALUES.searchedCategory)
  //const [filteredTodos, setFilteredTodos] = useContext(FilteredTodosContext)

  const updateTodo = (id, newTodo) => {
    const newList = todoList.map((currentTodo) => {
      if (currentTodo.id === id) {
        return {
          ...currentTodo,
          ...newTodo,
        }
      }
      return currentTodo
    })
    setTodoList(newList)

    // changeData?
    putUpdatedTodo(`http://localhost:5000/api/todos/${id}`, { ...newTodo, id: id, sort: id, active: newTodo.isActive, category: newTodo.category })
      .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
      }).catch(err => {
        throw err
      });
  }

  const updateSearchedName = (putSearchedName) => {
    setSearchedName(putSearchedName)
  }

  const handleDelete = (id) => {
    console.log(id)
    setTodoList(todoList.filter((currentTodo) => currentTodo.id !== id));
    // deleteData?
    deleteTodoMethod(`http://localhost:5000/api/todos/${id}`, { id: id })
      .then(data => {
        console.log(id)
        console.log(data); // JSON data parsed by `data.json()` call
      }).catch(err => {
        throw err
      });
  }

  const handleChangeCategory = (putsearchedCategory) => {
    setSearchedCategory(putsearchedCategory)
  }

  const addNewToDo = (nameToAdd) => {
    const newToDo = {
      id: todoList[todoList.length - 1].id + 1,
      name: nameToAdd,
      isActive: false,
      category: '',
      sortIndex: todoList[todoList.length - 1].sortIndex + 1
    }
    setTodoList([...todoList, newToDo])


    // postData??
    postNewTodo('http://localhost:5000/api/todos', { ...newToDo, sort: newToDo.id, active: false, category: 'sports' })
      .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
      }).catch(err => {
        throw err
      });
  }

  const sortTodosByIndex = useCallback(() => {
    function compare(a, b) {
      const todoA = a.sortIndex;
      const todoB = b.sortIndex;
      let comparison = 0;
      if (todoA > todoB) {
        comparison = 1;
      } else if (todoA < todoB) {
        comparison = -1;
      }
      return comparison;
    }
    setTodoList(todoList.sort(compare));
  }, [setTodoList, todoList])


  const getTodos = useCallback(async () => {
    await fetch('http://localhost:5000/api/todos').then(r => r.json())
      .then(res => { setTodoList(res) }).catch(err => {
        throw err
      })
  }, [setTodoList])



  useEffect(() => {
    // fetchData??
    getTodos()
  }, [setTodoList, getTodos]);

  useEffect(() => {
    const mainListState = { searchedCategory, searchedName }
    updateLocalStorageByState(mainListState)
  }, [todoList, searchedName, searchedCategory, setTodoList, sortTodosByIndex]);

  // const filteredTodosByName = useMemo(() => todoList.filter(
  //   (currentTodo) => currentTodo.name.toLowerCase().includes(searchedName.toLowerCase()),
  // ),
  //   [todoList, searchedName]);

  //  setFilteredTodos (useMemo(() => filteredTodosByName.filter((currentTodo) => {
  //     // move 'all' into const in Filters folder in FilterConstants file and use it everywhere you use 'all'
  //     if (currentTodo.category.toLowerCase() === searchedCategory || searchedCategory === allFilter) {
  //       return true
  //     }
  //     return false
  //   }),
  // [searchedCategory, filteredTodosByName]))
  const classes = useStyles()

  return (
    <div>
      <h1 className={classes.headerStyle}>ToDoList</h1>
      <Link to="/Categories" className={classes.editCategories}>Edit Categories</Link>
      <Filters
        handleChangeCategory={handleChangeCategory}
        searchedName={searchedName}
        searchedCategory={searchedCategory}
        updateSearchedName={updateSearchedName}
      />
      <AddItem
        addNewItem={addNewToDo}
      />
      <SortableTodoContainer
        sortTodosByIndex={sortTodosByIndex}
        handleDelete={handleDelete}
        updateTodo={updateTodo}
      />
    </div>
  )
}
export default MainList