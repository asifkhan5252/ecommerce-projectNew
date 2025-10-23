import React from 'react'
import Layouts from '../../components/Layout/Layouts'
import AdminMenu from '../../components/Layout/AdminMenu'

const Users = () => {
  return (
     <Layouts tittle={'admin-users'}>
     <div className='container-fluid m-3 p-9'>
           <div className='row'>
           <div className='col-md-3'>
            <AdminMenu/>
            </div>
           <div className='col-md-9'>
                   <h1 className='col-md-9'>Users</h1>
           </div>
               </div>
   </div>
         </Layouts>
  )
}

export default Users
