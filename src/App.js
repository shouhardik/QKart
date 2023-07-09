import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Login from "./components/Login"
import Products from "./components/Products"
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"
import { BrowserRouter as Router,RouteProps,Route,Switch } from "react-router-dom";
export const config = {
  endpoint: `https://qkart-frontend-upbo.onrender.com/api/v1`,
};
//console.log(ipConfig.workspaceIp)
function App() {
  return (
    <div className="App">
      <Switch>
        
        
        <Route  path="/register">
        {  <Register />}
        </Route>
        <Route path="/login">
          {<Login/>}
        </Route>
        <Route path="/checkout">
          {<Checkout/>}
        </Route>
        <Route path="/thanks">
          {<Thanks/>}
        </Route>
        <Route path="/">
          {<Products/>}
          </Route>
         
        
          {/* <Route path="/example">
          {<Login/>}
          </Route>   */}
        
        </Switch> 
    </div>
  );
}

export default App;
