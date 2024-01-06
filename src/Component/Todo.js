import React, { useEffect, useState } from 'react'
import { AiFillBug } from "react-icons/ai";
import { FaPlusSquare } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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

const Todo = () => {
    const [inputData, setInputData] = useState('');

    const [items, setItems] = useState(getLocalItem);

    const addItem = () => {
        if(inputData){
            setItems([...items, inputData]);
            setInputData("");
        } 
        else{
            alert("Field is empty! Please input Something");
        }
    }

    const deleteItem = (id) => {
        console.log(id);
        const updateItem = items.filter((elem, ind) => {
            return (id !== ind);
        });

        setItems(updateItem);
    }

    const clearAll = () => {
        setItems([]);
    }

    // set to local storege
    useEffect(() => {
        localStorage.setItem('lists', JSON.stringify(items));
    }, [items]);

    return(
        <>
            <div className="main-div">
                <div className="child-div">
                    <figure>
                        <AiFillBug />
                        <figcaption>Add the List</figcaption>
                    </figure>
                    <div className="add-items">
                        <input type="text" placeholder='😍 Add items...'  value={inputData} onChange={(event) => setInputData(event.target.value)} />
                        <FaPlusSquare className='add' onClick={addItem} />
                    </div>
                    <div className="show-items">
                        {
                            items.length === 0 ? (<h5>Your list is empty</h5>) : 
                            (
                                <>
                                    <h5>...your lists...</h5>
                                    {
                                        items.map((elem, ind) => {
                                            return(
                                                <div className="each-item" key={ind}>
                                                    <h3>{elem}</h3>
                                                    <MdDelete className='trash' onClick={() => deleteItem(ind)} />
                                                </div>
                                            )
                                        })
                                    }
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
        </>
    )
}
export default Todo