import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import NavBar from './components/NavBar'

export default function App(){
  return (
    <div className="container-app">
      <NavBar />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .35, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.div>

      <footer className="mt-10 text-center text-sm text-white/50">
       — Portal con autenticación y chat
      </footer>
    </div>
  )
}
