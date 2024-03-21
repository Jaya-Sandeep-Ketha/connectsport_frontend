import React, { useState } from 'react';
import Navbar from "../../Components/layout/navbar"; // Adjusted for consistent naming convention
import FilterSidebar from './filterSidebar';
import PeopleList from './peopleList';
import FriendRequests from './friendRequests';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/Friends/friendspage.css';

const App = () => {
    // State to manage search input
    const [searchInput, setSearchInput] = useState('');

    return (
        <div className="container-fluid">
            {/* Pass setSearchInput to manage search state */}
            <Navbar onSearchChange={setSearchInput} />
        
            <div className="container my-5">
                <div className="row g-4"> {/* Preserved gap between columns */}
                    <FilterSidebar />
                    <PeopleList searchInput={searchInput} />
                    <FriendRequests searchInput={searchInput} />
                </div>
            </div>
        </div>
    );
};

export default App;
