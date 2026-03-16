import React from 'react';
import './App.css';
import '../i18n';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//context
import { AuthProvider } from './context/AuthContext';

//protected route
import ProtectedRoute from './routes/ProtectedRoute';

//components
import Navbar from './components/Navbar';

//pages
import Login from './Pages/Login';
import Unathorized from './Pages/Unathorized';
import UserDashboard from './Pages/UserDashboard';
import MaintainerDashboard from './Pages/MaintainerDashboard';
import Register from './Pages/Register';
import Landing from './Pages/Landing';
import NotFound from './Pages/NotFound';
import ReportDetails from './Pages/ReportDetails';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Router>
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="*" element={<NotFound />} />
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/unauthorized"
                                element={<Unathorized />}
                            />
                            <Route
                                path="/my-reports"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={['user', 'admin']}
                                        element={<UserDashboard />}
                                    />
                                }
                            />
                            <Route
                                path="/maintainer-dashboard"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={['maintainer', 'admin']}
                                        element={<MaintainerDashboard />}
                                    />
                                }
                            />
                            <Route
                                path="/maintainer-dashboard/:reportId"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={['maintainer', 'admin']}
                                        element={<ReportDetails />}
                                    />
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={['admin']}
                                        element={<Register />}
                                    />
                                }
                            />
                        </Routes>
                    </main>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
