"use client";
import { signOut } from "next-auth/react";

const Dashboard = () => {
    return (
        <button onClick={()=>{signOut()}}>sign out</button>
    )
};

export default Dashboard;