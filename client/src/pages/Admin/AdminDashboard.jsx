import React from 'react'
import Layouts from '../../components/Layout/Layouts'
import AdminMenu from '../../components/Layout/AdminMenu'
import { useAuth } from '../../Context/Auth'

const AdminDashboard = () => {
    const [auth]=useAuth()
    // console.log("AUTH CONTEXT:", auth);
    // console.log("PHONE:", auth?.user?.phone);
  return (
    
      <Layouts>
      <div className='container-fluid m-3 p-9'>
      <div className='row'>
        <div className='col-md-3'> <AdminMenu/></div>
        <div className='col-md-9'>
        <div className='card w-70 p-3'>
<h4>Admin Name: {auth?.user?.name}</h4>
<h4> Admin Email: {auth?.user?.email}</h4>
<h4>Admin Number: {auth?.user?.phone}</h4>
        </div>
            
        </div>
        <div className='col-md-9'> Content</div>
      </div>
        
      </div>
       
       
      </Layouts>

  )
}

export default AdminDashboard
