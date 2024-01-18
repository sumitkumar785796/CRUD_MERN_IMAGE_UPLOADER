import React, { useEffect, useState } from "react";
import StoreData from "./StoreData";
import Nav from "./Nav";

const View = () => {
    const [view, setView] = useState([]);
    const getData = async () => {
        try {
          const res = await fetch("/view", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) {
            alert("Error fetching data");
            console.error("Error fetching data", res.statusText);
            return;
          }
          const data = await res.json();
          if (!data.message) {
            console.log("Invalid data");
          } else {
            setView(data.message);
            console.log(data.message)
          }
        } catch (error) {
          console.error("Error", error);
        }
      };
    
      useEffect(() => {
        getData();
      }, []);   
      const deleteUser = async (id) => {
        try {
          // Display a confirmation alert before deleting the user
          const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    
          if (!isConfirmed) {
            return;
          }
    
          const res2 = await fetch(`/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!res2.ok) {
            // Check for HTTP error status (not 2xx)
            alert('Error deleting user');
            console.error('Error deleting user:', res2.statusText);
            return;
          }
    
          const deleteData = await res2.json();
    
          if (!deleteData.message) {
            // Handle invalid data received
            console.error('Invalid data received');
          } else {
            // Update the state to reflect the deletion
            setView((prevData) => prevData.filter((user) => user._id !== id));
            console.log('User deleted');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
     
  return (
    <>
    <Nav/>
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Profile</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
          {
            view.map((ele,index)=>(
                <StoreData
                    key={ele._id}
                    index={index}
                    id={ele._id}
                    profile={ele.profile}
                    fname={ele.fname}
                    email={ele.email}
                    deleteUser={() => deleteUser(ele._id)} // Pass the id to deleteUser
                />
            ))
          }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default View;
