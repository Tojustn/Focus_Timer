import {react, useState} from "react"
import {BrowserRouter, Routes,Route,Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import InSession from "./pages/InSession";
import Test from "./pages/Test"
import api from "./api"

function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}


function App() {
  
  const handleSessionLeave = (id) => {

    updateSession(id, {is_finished: false})
  }
  const updateSession = async (id,updates) => {
    await api.put(`../api/sessions/${id}`, updates).catch((err) => {alert(err)})
  }
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path = "/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }/>
            <Route path="/sessions/:id"
                    element={
                        <ProtectedRoute>
                            <InSession/>
                        </ProtectedRoute>
                    } 
                    onEnter = {() => handleSessionEnter(':id')}
                    onLeave={() => handleSessionLeave(`:id`)}
                    ></Route>
           <Route path="/logout" element={<Logout />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<RegisterAndLogout />}></Route>
          <Route path="*" element={<NotFound />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
