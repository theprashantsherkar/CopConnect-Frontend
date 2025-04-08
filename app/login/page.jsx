"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "../HelpingComponents/Footer";
import Navbar from "../HelpingComponents/Navbar";
import { backendURL } from "../layout";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [isSignup, setIsSignup] = useState(false);
  const [credentials, setCredentials] = useState({
    badgeNumber: "",
    name: "",
    email: "",
    mobile: "",
    adminId: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role || !["police", "citizen", "admin", "anonymous"].includes(role)) {
      router.push("/");
    }
    if (role === "anonymous") {
      sessionStorage.setItem("loggedIn", "anonymous");
      router.push("/dashboard/anonymousDashboard");
    }
  }, [role, router]);

  const handleAuth = async(e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || { police: {}, citizen: {}, admin: {} };

    if (isSignup) {
      if (role === "police" && credentials.badgeNumber && credentials.name) {
        users.police[credentials.badgeNumber] = { name: credentials.name };
      } else if (role === "citizen" && credentials.email && credentials.mobile) {
        users.citizen[credentials.email] = { mobile: credentials.mobile };
      } else if (role === "admin" && credentials.adminId && credentials.password) {
        users.admin[credentials.adminId] = { password: credentials.password };
      } else {
        setError("❌ Please fill all fields.");
        return;
      }

      const { data } = await axios.post(`${backendURL}/admin/auth/login`, {
        role,
        badgeNumber: credentials.badgeNumber,
        name: credentials.name,
        email: credentials.email,
        mobile: credentials.mobile,
        adminId: credentials.adminId,
        password: credentials.password,
        
      }, {
        headers: {
          "Content-Type": "application/json",

        },
        withCredentials: true,
      });

      if (!(data.success)) {
        alert(data.message);
      }

      alert('Welcome back!');

      router.push(`/dashboard/${role}Dashboard`);
      return;
    }

    let validUser = false;
    if (role === "police" && users.police[credentials.badgeNumber]?.name === credentials.name) {
      validUser = true;
    } else if (role === "citizen" && users.citizen[credentials.email]?.mobile === credentials.mobile) {
      validUser = true;
    } else if (role === "admin" && users.admin[credentials.adminId]?.password === credentials.password) {
      validUser = true;
    }

    if (validUser) {
      sessionStorage.setItem("loggedIn", role);
      router.push(`/dashboard/${role}Dashboard`);
    } else {
      setError("❌ Invalid credentials");
    }
  };

  return (
    <>
    <Navbar />
      {role !== "anonymous" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-blue-900">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-white text-2xl font-semibold text-center mb-6">
              {isSignup ? "Sign Up" : "Login"} as {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </h2>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <form onSubmit={handleAuth} className="space-y-4">
              {role === "police" && (
                <>
                  <input
                    type="text"
                    placeholder="Badge Number"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                    value={credentials.badgeNumber}
                    onChange={(e) => setCredentials({ ...credentials, badgeNumber: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                    value={credentials.name}
                    onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                  />
                </>
              )}
              {role === "citizen" && (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                    value={credentials.mobile}
                    onChange={(e) => setCredentials({ ...credentials, mobile: e.target.value })}
                  />
                </>
              )}
              {role === "admin" && (
                <>
                  <input
                    type="text"
                    placeholder="Admin ID"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                    value={credentials.adminId}
                    onChange={(e) => setCredentials({ ...credentials, adminId: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring focus:ring-blue-500"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </>
              )}
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                {isSignup ? "Sign Up" : "Login"}
              </button>
            </form>
            <p className="text-gray-400 text-sm text-center mt-4">
              {isSignup ? "Already have an account?" : "Don't have an account?"} {" "}
              <button className="text-blue-400 hover:underline" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Login;
