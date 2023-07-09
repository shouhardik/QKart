import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack,TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

//import styled from 'styled-components';
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
const Header = ({ children, hasHiddenAuthButtons }) => {
  
  const history=useHistory()
  
  const savedLocal=()=>{
    let token=window.localStorage.getItem("token")
    //console.log(token)
    if(token!==null){
      return true;
    }
    return false
  }
    return (
      
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children }
        <Stack direction="row" spacing={1} alignItems="center">
        
        {hasHiddenAuthButtons ?(
          // if saved in localStorage
          
          savedLocal()?
            (
            
            < //</Stack>style={{display:"flex"}}
            >
              
               
              <Avatar src="avatar.png" alt={window.localStorage.getItem("username")}></Avatar>
              <h6>{window.localStorage.getItem("username")}</h6>
      
              <Button 
              variant="contained" 
              onClick={()=>{
                window.localStorage.removeItem("username")
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("balance")
                history.push("/");
                window.location.reload();
                console.log("hiiii ")
              }}> LOGOUT</Button>
            </>
           
          ):(
            <div style={{display:"flex",justifyContent:"space-between"}}>
        <Button onClick={()=>history.push("/login")}>Login</Button>

      <Button 
      variant="contained" 
      onClick={()=>history.push("/register")}>Register</Button>
      </div>
          )
          
          
      )
      :(
        <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={() => history.push("/")}
      >
        Back to explore
      </Button>
      )}
       </Stack>
       {children&& children.mobbar}
       </Box>
      
    );
};

export default Header;
