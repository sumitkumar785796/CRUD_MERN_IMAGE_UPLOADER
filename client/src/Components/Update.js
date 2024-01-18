import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "./Nav";

const Update = () => {
  const navigate = useNavigate();
  const [getUserData, setUserData] = useState({
    profile: null,
    fname: "",
    email: "",
  });
  const setUser = (e) => {
    const { name, value } = e.target;
    setUserData((prevValue) => ({
      ...prevValue,
      [name]: value || "", // Set to an empty string if value is undefined
    }));
  };
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setUserData((prevValue) => ({
      ...prevValue,
      profile: file,
    }));
  };
  const { id } = useParams("");
  // console.log(id);
  // console.log(getUserData);
  const getData = useCallback(async () => {
    try {
      const res = await fetch(`/update/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        // Check for HTTP error status (not 2xx)
        alert("Error fetching data");
        console.error("Error fetching data:", res.statusText);
        return;
      }

      const data = await res.json();

      if (!data.message) {
        // get the data validity
        console.error("Invalid data received");
      } else {
        setUserData(data.message);
        console.log("getdata", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [id]);
  useEffect(() => {
    getData();
  }, [getData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("profile", getUserData.profile);
      formData.append("fname", getUserData.fname);
      formData.append("email", getUserData.email);
      const res = await fetch(`/edit/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        alert("Error updating record");
        console.error("Error updating record:", res.statusText);
        return;
      }

      alert("Record updated successfully");
      navigate("/view"); // Redirect to the home page or wherever you want after a successful update
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <Nav />
      <h1 className="text-center">Update Record</h1>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <label htmlFor="profile">Profile</label>
            <input
              type="file"
              name="profile"
              id="profile"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
          <input
          type="text"
          name="oldImage"
          className="form-control"   
          value={getUserData.profile ?? ""}
          onChange={setUser}
          />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="fname">Full Name</label>
            <input
              type="text"
              name="fname"
              id="fname"
              className="form-control"
              value={getUserData.fname}
              onChange={setUser}
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              value={getUserData.email}
              onChange={setUser}
            />
          </div>
        </div>
        <br />
        <button onClick={handleSubmit} className="btn btn-primary">
          Update
        </button>
      </div>
    </>
  );
};

export default Update;
