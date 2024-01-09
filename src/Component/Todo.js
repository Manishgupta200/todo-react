import React, { useEffect, useState } from 'react'
import { AiFillBug } from "react-icons/ai";
import { FaPlusSquare, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrDrag } from "react-icons/gr";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect'

import './Todo.css';

// get lists from loacl storage
const getLocalItem = () => {
    const listItem = localStorage.getItem('lists');
    console.log(listItem);
    if(listItem){
        return JSON.parse(listItem);
    }
    else{
        return [];
    }
}

const TodoItem = ({ id, name, index, isEditItem, moveItem, editItem, deleteItem }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'TODO_ITEM',
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const [, drop] = useDrop({
      accept: 'TODO_ITEM',
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    const getStyle = () => {
        return {
          backgroundColor: isDragging ? 'lightyellow' : 'lightgreen',
          transform: isDragging ? 'rotate(5deg)' : 'none',
          border: isDragging ? '2px dashed blue' : '',
          cursor: 'grab', // Use grab cursor to indicate draggable
        };
    };
  
    return (
      <div className='item-row'>
        <GrDrag className='dragDrop' />
        <div ref={(node) => drag(drop(node))} className={`each-item ${isEditItem === id ? 'edit-mode' : ''}`} style={getStyle()}>
            <h3>{name}</h3>
            <div>
                <FaEdit className='trash' onClick={() => editItem(id)} />
                <MdDelete className='trash' onClick={() => deleteItem(id)} />
            </div>
        </div>
      </div>
    );
};

const Todo = () => {
    const [inputData, setInputData] = useState('');

    const [items, setItems] = useState(getLocalItem);

    const [toggleSubmit, setToggleSubmit] = useState(true);

    const [isEditItem, setIsEditItem] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');

    const moveItem = (fromIndex, toIndex) => {
        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setItems(updatedItems);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    }
    const filterItems = items.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const editItem = (id) => {
        const newEditItem = items.find((elem) => {
            return (id === elem.id)
        })
        console.log(newEditItem);

        setToggleSubmit(false);

        setInputData(newEditItem.name)

        setIsEditItem(id);
    }

    const addItem = () => {
        if(inputData && !toggleSubmit){
            setItems(
                items.map((elem) => {
                    if(elem.id === isEditItem){
                        return {...elem, name: inputData};
                    }
                    return elem;
                })
            );

            setToggleSubmit(true);

            setInputData("");

            setIsEditItem(null);
        }
        else if(inputData){
            const allInputData = {id: new Date().getTime().toString(), name: inputData};
            setItems([...items, allInputData]);
            setInputData("");
        }
        else{
            alert("Field is empty! Please input Something");
        }
    }

    const deleteItem = (id) => {
        console.log(id);
        const updateItem = items.filter((elem) => {
            return (id !== elem.id);
        });

        setItems(updateItem);
    }

    const clearAll = () => {
        if(items.length === 0){
            alert("Nothing left to clear");
        }
        else{
            const isConfirmed = window.confirm("Are you sure want to delete all your list. [this section can't be undone]");
            if(isConfirmed){
                setItems([]);
            }
        }
    }

    // set to local storege
    useEffect(() => {
        localStorage.setItem('lists', JSON.stringify(items));
    }, [items]);

    return(
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <div className="main-div">
                    <div className="child-div">
                        <figure>
                            <AiFillBug />
                            <figcaption>Add the List</figcaption>
                        </figure>
                        <div className="add-items">
                            <input type="text" placeholder='😍 Add items...'  value={inputData} onChange={(event) => setInputData(event.target.value)} />
                            {
                                toggleSubmit ? <FaPlusSquare className='add' onClick={addItem} /> :
                                <FaEdit className='add' onClick={addItem} />
                            }
                            
                        </div>
                        <div className="show-items">
                            {
                                items.length === 0 ? (<h5>Your list is empty</h5>) : 
                                (
                                    <>
                                        <h5>...your lists...</h5>
                                        <input type="text"className='searchField' placeholder='🔍 Search your list...' value={searchQuery} onChange={handleSearch}/>
                                        <h5>You can prioritize your list self by simply drag & drop </h5>
                                        {
                                            filterItems.length === 0 ? (<h5>No matching items found</h5>) :
                                            (
                                                <>
                                                    {
                                                        filterItems.map((elem, index) => (
                                                            // <div className={`each-item ${isEditItem === elem.id ? 'edit-mode' : ''}`} key={elem.id} >
                                                            //     <h3>{elem.name}</h3>
                                                            //     <div>
                                                            //         <FaEdit className='trash' onClick={() => editItem(elem.id)}/>
                                                            //         <MdDelete className='trash' onClick={() => deleteItem(elem.id)} />
                                                            //     </div>
                                                            // </div>
                                                            <TodoItem
                                                                key={elem.id}
                                                                id={elem.id}
                                                                name={elem.name}
                                                                index={index}
                                                                isEditItem={isEditItem}
                                                                moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex)}
                                                                editItem={editItem}
                                                                deleteItem={deleteItem}
                                                            />
                                                        ))
                                                    }
                                                </>
                                            )
                                        }
                                        {/* {
                                            items.map((elem) => {
                                                return(
                                                    <div className={`each-item ${isEditItem === elem.id ? 'edit-mode' : ''}`} key={elem.id} >
                                                        <h3>{elem.name}</h3>
                                                        <div>
                                                            <FaEdit className='trash' onClick={() => editItem(elem.id)}/>
                                                            <MdDelete className='trash' onClick={() => deleteItem(elem.id)} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        } */}
                                    </>
                                )
                            }   
                        </div>
                        {/* clear all list */}
                        <div className="show-items">
                            <button className='btn' onClick={clearAll}><span>clear list</span></button>
                        </div>
                    </div>
                </div>
            </DndProvider>
    )
}
export default Todo