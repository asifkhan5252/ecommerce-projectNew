import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'

const Sppiner = ({path="login"}) => {
    const [count, setcount] = useState(3)
 const navigate=useNavigate()
//  const location=useLocation()
 useEffect(() => {
  const interval=  setInterval(()=>{
    setcount((preValue)=>--preValue)

    },1000)
    count===0 && navigate(`/${path}`)
  return() =>clearInterval(interval)
 }, [count,navigate,path])
 
  return (
    <>
   <div className="text-center  d-flex flex-column justify-content-center align-items-center" style={{height:"100vh"}}>
   <h1 className='text-center'>Redirect to you in {count} sec</h1>
  <div className="spinner-border" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>

    </>
  )
}

export default Sppiner
