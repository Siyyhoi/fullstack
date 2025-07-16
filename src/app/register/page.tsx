'use client'
import axios from 'axios';
import { useState } from 'react';

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [RegisterSuccess, setRegister] = useState(false);

    const Register = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        // ตรวจสอบข้อมูลครบถ้วน
        if (!username || !email || !password || !confirmPassword) {
            setMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }
        // ตรวจสอบรหัสผ่านตรงกัน
        if (password !== confirmPassword) {
            setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }
        try {
            setLoading(true);
            setMessage("");
            const res = await axios.post('/api/register', {
                email,
                password,
                username
            });
            if (res.status) {
                if (res.data.message) {
                    setMessage(res.data.message);
                    setTimeout(() => {
                        setMessage("");
                    }, 2000)
                } else {
                    setRegister(true);
                }
            }
        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
<div className="container mx-auto py-8">
  <h1 className="text-2xl font-bold mb-6 text-center">Registration Form</h1>
  <form className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md" onSubmit={Register}>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
      <input className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" type="text" id="name" name="name" 
      placeholder="John Doe" 
      onChange={(v) => setUsername(v.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
      <input className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" type="email" id="email" name="email" 
      placeholder="john@example.com" 
      onChange={(v) => setEmail(v.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
      <input className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" type="password" id="password" name="password" 
      placeholder="********" 
      onChange={(v) => setPassword(v.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
      <input className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" type="password" id="confirm-password" name="confirm-password" 
      placeholder="********" 
      onChange={(v) => setConfirmPassword(v.target.value)}
      />
    </div>
    {message && <div className="mb-4 text-red-500 text-sm">{message}</div>}
    <button
    className="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300" type="submit">
    {RegisterSuccess ? " Register in successfully" : loading ? " Logging in..." : "Register"}
    </button>
  </form>
</div>

    </>
  )
}

export default RegisterPage
