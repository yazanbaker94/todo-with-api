import React, { useEffect, useState } from "react";
import { FormGroup, Card, Elevation, Button } from "@blueprintjs/core";
import superagent, { saveCookies } from "superagent";
import cookie from "react-cookies";
import List from "./list.js";
import "./todo.css";
const ToDo = () => {
  const [list, setList] = useState([]);
  const [toDo, setToDo] = useState("");
  const [assignee, setAssignee] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [complete,setComplete]=useState('pending')
  const [incomplete, setIncomplete] = useState([]);
  const API = "https://ibrahem-todo-server.herokuapp.com";

  const handleChangeAssigne = (e) => {
    setAssignee(e.target.value);
  };
  const handleChangeITem = (e) => {
    setToDo(e.target.value);
  };
  const handleChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let obj = {
      toDo: toDo,
      assignee: assignee,
      difficulty: difficulty,
      complete:complete
    };
    addItem(obj);
    e.target.reset();
  };

  async function addItem(item) {
    const token = cookie.load("token");
    let respone = await superagent
      .post(`${API}/todo`, item)
      .set("authorization", `Bearer ${token}`);
    console.log(respone);
  }
  useEffect(() => {
    let incompleteCount = list.filter(item => item.complete!=='complete').length;
    setIncomplete(incompleteCount);
    document.title = `To Do List: ${incomplete}`;
  }, [list]);

  return (
    <>
      <header style={{ width: "1000px", margin: "0 auto" }}>
        <nav
          className="bp3-navbar .modifier "
          style={{ color: "white", backgroundColor: "#8F398F" }}
        >
          <h1 style={{ color: "white" }}>To Do List Manger: ({incomplete})</h1>
        </nav>
      </header>
      <div className="div-flex">
        <div className="toDo">
          <Card interactive={true} elevation={Elevation.TWO}>
            <form onSubmit={handleSubmit}>
              <h2>Add To Do Item</h2>
              <FormGroup label="To Do Item" labelFor="ToDo">
                <input
                  className="bp3-input .modifier"
                  onChange={handleChangeITem}
                  name="ToDo"
                  type="text"
                  placeholder="Item Details"
                  dir="auto"
                />
              </FormGroup>

              <FormGroup label="Assigned To" labelFor="assignee">
                <input
                  className="bp3-input .modifier"
                  onChange={handleChangeAssigne}
                  name="assignee"
                  type="text"
                  placeholder="Assignee Name"
                  dir="auto"
                />
              </FormGroup>
              <br />
              <FormGroup label="Difficulty" labelFor="assignee">
                <input
                  className=".modifier"
                  onChange={handleChange}
                  defaultValue={3}
                  type="range"
                  min={1}
                  max={5}
                  name="difficulty"
                  dir="auto"
                  style={{ width: "175px", backgroundColor: "#9c27b0" }}
                />
              </FormGroup>

              <br />

              <label>
                <Button
                  type="submit"
                  className="bp3-intent-primary"
                  style={{ width: "175px", backgroundColor: "#9c27b0" }}
                >
                  Add Item
                </Button>
              </label>
            </form>
          </Card>
        </div>
        <div>
          <List list={list}  setList={setList}  setComplete={setComplete}
          complete={complete} />
        </div>
      </div>
    </>
  );
};

export default ToDo;
