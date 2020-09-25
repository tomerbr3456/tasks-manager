import React, { useState, useEffect } from 'react';
import './AddItem.css';
import { syncStateAndLocalStorage, updateLocalStorageByState } from '../LocalStorage/localStorageManagment'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
	"AddItemContainer": {
		"display": "flex",
		"height": "100px",
		"textAlign": "center",
		"fontSize": "50px",
		"justifyContent": "center",
		"alignItems": "center",
		"width": "100%"
	},
	"newItem": {
		"width": "35%",
		"height": "100%",
		"backgroundColor": "whitesmoke"
	},
	"addInput": {
		"fontSize": "40px",
		"width": "100%",
		"height": "100%",
		"display": "inline-block",
		"border": "1px solid #ccc",
		"borderRadius": "4px",
		"boxSizing": "border-box"
	},
	"addItemContainer": {
		"display": "flex",
		"justifyContent": "center",
		"textAlign": "center",
		"alignItems": "center",
		"width": "14%",
		"height": "100%",
		"border": "1px solid #ccc",
		"borderRadius": "4px",
		"backgroundColor": "blue"
	},
	"addItem": {
		"textAlign": "center",
		"fontSize": "40px",
		"backgroundColor": "blue",
		"width": "100%",
		"display": "inline-block",
		"boxSizing": "border-box"
	}
})

// תמצא דרך להשתמש באותה קומפוננטה בהוספת קטגוריה והוספת טודו	
const AddItem = (props) => {
	const { addNewItem } = props
	// אותה בעיה כמו בTodo
	// AddItem לא צריכה להכיר את הקונטקסט
	const initialNameToAdd = ''
	let [nameToAdd, setNameToAdd] = useState(initialNameToAdd);

	const handleAddItem = (event) => {
		setNameToAdd(event.target.value)
		updateLocalStorageByState({ nameToAdd: event.target.value })
	}

	const addNewName = () => {
		if (nameToAdd !== '') {
			addNewItem(nameToAdd)
			// lo tov
			// setNameToAdd
			setNameToAdd('')
		}
	}

	useEffect(() => {
		const localStorageValues = syncStateAndLocalStorage({ nameToAdd: initialNameToAdd })
		setNameToAdd(localStorageValues.nameToAdd)
	}, [initialNameToAdd])

	const classes = useStyles()
	return (
		// כל מה שקשור ספציפית לTODO לא צריך להיות פה
		// או שהשם שלו צריך להשתנות
		<div className={classes.AddItemContainer}>
			<div className={classes.newItem}>
				<input className={classes.addInput} type="text" value={nameToAdd} onChange={handleAddItem} />
			</div>
			<div className={classes.addItemContainer}>
				<div className={classes.addItem} onClick={addNewName}>Add</div>
			</div>
		</div>

	)
}
export default AddItem