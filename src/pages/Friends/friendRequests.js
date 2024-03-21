import React from "react";
import BlockDropdown from './blockDropdown';

const FriendRequests = () => {
  const requests = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
    // Add more requests as needed
  ];

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Friend Requests</h3>
          {requests.map((request) => (
            <div key={request.id} className="list-group mb-2">
              <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <span>{request.name}</span>
                <div>
                  <button className="btn btn-success me-2">Accept</button>
                  <button className="btn btn-danger">Reject</button>
                </div>
              </div>
            </div>
          ))}
          {/* Including the BlockDropdown within the card body for cohesive styling */}
          <BlockDropdown />
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
