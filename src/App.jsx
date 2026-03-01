import React from 'react';
import './App.css';
import '../i18n';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//context
import { AuthProvider } from './context/AuthContext';

//components
import Navbar from './components/Navbar';

//pages
import Login from './Pages/Login';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Router>
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </main>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
