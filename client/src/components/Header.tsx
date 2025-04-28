import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
    userName: string;
    userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Naturopura Dashboard</h1>
                <div>
                    <span className="mr-4">{userName} ({userRole})</span>
                    <Link to="/profile" className="hover:underline">Profile</Link>
                    <button className="ml-4 bg-red-500 px-2 py-1 rounded">Logout</button>
                </div>
            </div>
        </header>
    );
};

export default Header;