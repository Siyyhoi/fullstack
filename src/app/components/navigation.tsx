'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'flowbite/dist/flowbite.min.css';
import 'flowbite';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Login from './login';
import Register from './register';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('flowbite');
      // โหลดข้อมูลผู้ใช้จาก localStorage เมื่อเริ่มต้น
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsRegister(false); // กลับไป login เสมอเมื่อเปิด modal ใหม่
  };

  const handleLogout = async () => {
    try {
      // เรียก API logout
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // ล้างข้อมูลผู้ใช้จาก state และ localStorage
        setUser(null);
        localStorage.removeItem('user');
        
        // แสดงข้อความสำเร็จ
        Swal.fire({
          title: 'สำเร็จ!',
          text: 'ออกจากระบบเรียบร้อยแล้ว',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // แม้ API จะไม่สำเร็จ ก็ล้างข้อมูลในเครื่อง
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      // แม้เกิดข้อผิดพลาด ก็ล้างข้อมูลในเครื่อง
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <>
      {/* Navbar */}
<nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
    {/* Logo */}
    <Link href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
      <Image
        src="https://flowbite.com/docs/images/logo.svg"
        alt="Flowbite Logo"
        width={32}
        height={32}
        className="w-8 h-8"
      />
      <span className="text-2xl font-bold text-gray-800 dark:text-white">FrontEnd</span>
    </Link>

    {/* Navigation links */}
    <div className="hidden md:flex items-center space-x-6">
      <Link href="#" className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline">Home</Link>
      <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">About</Link>
      <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">Services</Link>
      <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link>
      <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
    </div>

    {/* Login/Register Button */}
    <div className="mt-4 md:mt-0">
      {user ? (
        <div className="flex items-center space-x-3">
          <span className="text-gray-700 font-medium">สวัสดี, {user.username}</span>
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800"
          >
            ออกจากระบบ
          </button>
        </div>
      ) : (
        <button
          onClick={handleToggle}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
        >
          Login / Register
        </button>
      )}
    </div>
  </div>

  {/* Mobile menu */}
  <div className="md:hidden px-4 pb-4">
    <ul className="space-y-2">
      <li><a href="#" className="block text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
      <li><a href="#" className="block text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
      <li><a href="#" className="block text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">Services</a></li>
      <li><a href="#" className="block text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
      <li><a href="#" className="block text-gray-700 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
    </ul>
  </div>
</nav>


      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={handleToggle}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-[400px] h-[450px] perspective"
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d ${
                  isRegister ? 'rotate-y-180' : ''
                }`}
              >
                {/* Login Card Front */}
                  <Login setIsRegister={setIsRegister} onLoginSuccess={setUser} setIsOpen={setIsOpen}/>


                {/* Register Card Back */}
                <div className="absolute w-full h-full rotate-y-180 backface-hidden">
                  <Register setIsRegister={setIsRegister} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}