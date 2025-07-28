import React from 'react'
import { Link } from 'react-router-dom'

function Pnf() {
  return (
    <div style={{ width:'100%',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center' }}>

<div className='row'>
    <div className='col-md-1'></div>
    <div className='col-md-10 d-flex justify-content-center align-items-center flex-column'>
        <img src="https://consultation.co.jp/img/404-page-animation-example.gif"width={"60%"}height={"300px"}/>
        <h1 className='mt-3'>Look Like You Are Lost</h1> 
        
        <h3 className='mt-2'>The page you are looking is unavailable</h3>
       <Link to={"/"}> <button className='btn btn-success mt-5 rounded-0'>Back Home</button></Link>
    </div>
    <div className='col-md-1'></div>
    </div>
    </div>
  )
}

export default Pnf