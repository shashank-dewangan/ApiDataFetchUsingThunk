import { createStore, applyMiddleware } from "redux";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";

const initialstate = {
  apifetching: false,
  error: "",
  users: []
};
const reducer = (state = initialstate, action) => {
  switch (action.type) {
    case "FETCH_API":
      return { ...state, apifetching: action.payload };
    case "SETUSERS":
      return { ...state, users: action.payload };
    case "SETERROR":
      return { ...state, error: action.payload };
    default:
      return { ...state };
  }
};
const middleware = applyMiddleware(thunk, logger);
const store = createStore(reducer, middleware);

const rootElement = document.getElementById("root");
const App = ({ state, onSelection }) => {
  console.log("state", state);
  return (
    <div>
      {state.users.map(user => (
        <div
          style={{ paddingBottom: "10px" }}
          onClick={() => {
            console.log("user", user.first_name);
          }}
        >
          <div
            style={{
              border: "1px solid gray",
              boxShadow: "10px 10px 5px grey",
              padding: "10px",
              backgroundColor: "lightyellow"
            }}
          >
            <div>
              <b>Name :</b> {user.first_name} {user.last_name}
            </div>
            <br />
            <div>
              <img alt="" src={user.avatar} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
const render = () =>
  ReactDOM.render(<App state={store.getState()} />, rootElement);

store.subscribe(render);
store.dispatch(dispatch => {
  dispatch({ type: "FETCH_API", payload: true });
  axios
    .get("https://reqres.in/api/users?page=1")
    .then(response => {
      dispatch({ type: "SETUSERS", payload: response.data.data });
      dispatch({ type: "FETCH_API", payload: false });
    })
    .catch(err => {
      dispatch({ type: "SETERROR", payload: err });
      dispatch({ type: "FETCH_API", payload: false });
    });
});

render();
