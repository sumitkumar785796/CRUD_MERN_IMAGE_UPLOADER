import React from "react";
import { NavLink } from "react-router-dom";

const StoreData = ({id,index,profile,fname,email,deleteUser}) => {
  return (
    <>
      <tr>
        <th scope="row">{index + 1}</th>
        <td>
            <img src={`upload/${profile}`} alt="img" style={{height:'100px',width:'100px'}}/>
        </td>
        <td>{fname}</td>
        <td>{email}</td>
        <td>
        <NavLink className="btn btn-primary" to={`/update/${id}`}>Update</NavLink>
        <button type="button" className='btn btn-danger' style={{ margin: '10px' }} onClick={deleteUser}>
          Delete
        </button>
        </td>
      </tr>
    </>
  );
};

export default StoreData;
