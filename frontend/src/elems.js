import React, {useState, useEffect, useRef} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Navbar = () => {
    return (
        <>
        <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">Stable Coin Stats</span>
        </div>
        </nav>
        <ToastContainer
            position="top-right"
            autoClose={15000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        </>
    )
}

export const showMessage = (msg = '', success = true) => {
    const options = {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }
        if (success === true) {
            toast.success(msg, options)
        } else {
            toast.error(msg, options)
        }
};