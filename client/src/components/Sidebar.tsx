import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
    const adminLinks = [
        { to: '/admin/dashboard', text: 'Dashboard' },
        { to: '/admin/farmers', text: 'Manage Farmers' },
    ];

    const farmerLinks = [
        { to: '/farmer/dashboard', text: 'Dashboard' },
        { to: '/farmer/financial', text: 'Financial Services' },
        { to: '/farmer/marketplace', text: 'Marketplace' },
        { to: '/farmer/monitoring', text: 'Monitoring & Advisory' },
        { to: '/farmer/animal-attack', text: 'Animal Attack Prevention' },
        { to: '/farmer/support', text: 'Support & Training' },
    ];

    const links = userRole === 'admin' ? adminLinks : farmerLinks;

    return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <nav>
                <ul>
                    {links.map((link, index) => (
                        <li key={index} className="mb-2">
                            <Link to={link.to} className="block hover:bg-gray-700 p-2 rounded">
                                {link.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;