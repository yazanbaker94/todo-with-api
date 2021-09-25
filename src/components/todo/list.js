import React,{useContext,useState,useEffect} from "react";
import { Button, Card, Elevation } from '@blueprintjs/core';
import ReactPaginate from "react-paginate";
import {SettingsContext} from "../../context/settingsContext"
import superagent , { saveCookies } from 'superagent';
import cookie from "react-cookies";
import './list.css'
function List(props) {
const settings = useContext(SettingsContext)
  const [pageNumber, setPageNumber] = useState(0);
  
  const usersPerPage = settings.numOfItems;
  const pagesVisited = pageNumber * usersPerPage;
  const API = 'https://ibrahem-todo-server.herokuapp.com'

  async function deleteItem(id) {
    const token = cookie.load("token");
    await superagent.delete(`${API}/todo?index=${id}`).set('authorization', `Bearer ${token}`)
   
  }
 async function toggleComplete(id) {
  
   const token = cookie.load("token");
    let items=await props.list.map((item,index)=>{
        if(id===index){
          if(item.complete==='complete'){
            item.complete='pending'
          }else{
            item.complete='complete'
          }
          return item
        }
        
    })
    let obj={
      toDo: items[id].toDo,
      assignee: items[id].assignee,
      difficulty: items[id].difficulty,
      complete:items[id].complete
    }
   
    let respone = await superagent.put(`${API}/todo?index=${id}`,obj).set('authorization', `Bearer ${token}`)
    
    props.setList(respone.body.todo)

  
  }
  useEffect(async () => {
    const token = cookie.load("token");
    let respone = await superagent.get(`${API}/todo`).set('authorization', `Bearer ${token}`)
    
    props.setList(respone.body.todo)
    

  },[props.list])
 

  
  const displayUsers = props.list
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((item,index) => {
      // console.log(item);
      return (
        
        <div key={item.id} style={{width:"650px" ,margin:"15px",position:"relative"} }>
           <Card interactive={true} elevation={Elevation.TWO}>
          <p style={{color:"blak",    fontSize:"15px"}}>
          <Button 
          className='bp3-intent-success'
          onClick={() => toggleComplete(index)}
          >
          {item.complete}</Button>
          <small > {item.assignee}</small>
          
          <Button onClick={() => deleteItem(index)}
            className='bp3-intent-danger'
            style={{position:"absolute", 
            right:"15px"}}>
          delete </Button>
          </p>
          <p style={{fontSize:"28px"}}>{item.toDo}</p>
          <p>
            <small>Difficulty: {item.difficulty}</small>
          </p>
         
         

          </Card>
        </div>
      );
    });
    const pageCount = Math.ceil(props.list.length / usersPerPage);
    const changePage = ({ selected }) => {
      setPageNumber(selected);
    };
  return (
    <>
  
    
        {displayUsers}
        <ReactPaginate
        
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </>
  );
}

export default List;
