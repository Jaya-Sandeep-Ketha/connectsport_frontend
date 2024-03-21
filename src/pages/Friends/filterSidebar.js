import React from "react";

const FilterSidebar = () => {
  return (
    // Changed from col-md-4 to col-md-3 for a narrower sidebar
    <div className="col-md-3 mb-4"> 
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Filter</h3>
          <select className="form-select mb-3">
            <option>Sport</option>
            {/* Populate with more options as needed */}
          </select>
          <select className="form-select">
            <option>Friends of Friends</option>
            {/* Populate with more options as needed */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
