import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "../components/CardComponent";
import exp from "constants";

interface User {
  id: number;
  name: string;
  email: string;
}


export default function Home() {
  const apiUri = process.env.PUBLIC_API_URI || "http://localhost:4000";
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [updateUser, setUpdateUser] = useState({ id: "", name: "", email: "" });

  // fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUri}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUri]);


  // create user
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUri}/users`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  // update user
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUri}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email });
      setUpdateUser({ id: '', name: '', email: '' });
      setUsers(
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        })
      )
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }


  // delete user
  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUri}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-300">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          User Management App
        </h1>


        {/* Create User */}
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Add User
          </button>
        </form>




        {/* Update User */}
        <form onSubmit={handleUpdateUser} className="p-4 bg-green-100 rounded shadow">
          <input
            placeholder="User ID"
            value={updateUser.id}
            onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Name"
            value={updateUser.name}
            onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Email"
            value={updateUser.email}
            onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
            Update User
          </button>
        </form>



        {/* Display Users */}
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <CardComponent card={user} />
              <button onClick={() => deleteUser(user.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Delete User
              </button> </div>
          ))}
        </div>


      </div>


    </main>
  )
}