import React, { useState } from 'react'
import Nav from './Nav'
import { useNavigate } from 'react-router-dom';

const Insert = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        profile: null,
        fname: "",
        email: "",
    });

    const setUser = (e) => {
        const { name, value } = e.target;
        setState((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setState((prevValue) => ({
            ...prevValue,
            profile: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fname , email , profile } = state;

        try {
            const formData = new FormData();
            formData.append("fname", fname);
            formData.append("email", email);
            formData.append("profile", profile);

            const res = await fetch("/add", {
                method:"POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("Error adding data:", res.status, res.statusText);
                return;
            }

            const data = await res.json();

            if (!data) {
                console.error("Invalid data received");
            } else {
                console.log("Data is added", data);
                navigate("/view");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };    
  return (
    <>
    <Nav/>
    <h1 className="text-center">Insert Record</h1>
    <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <label htmlFor="profile">Profile</label>
            <input type="file" name="profile" id="profile" className="form-control" onChange={handleImageChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="fname">Full Name</label>
            <input type="text" name="fname" id="fname" className="form-control" onChange={setUser} />
          </div>
          <div className="col-sm-6">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className="form-control" onChange={setUser} />
          </div>
        </div>
        <br />
        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
    </div>
    </>
  )
}

export default Insert