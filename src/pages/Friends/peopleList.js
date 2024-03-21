import React from "react";

const PeopleList = () => {
  // Updated people data to include mutual friends count
  const people = [
    { id: 1, name: "John Doe", mutualFriends: 5 },
    { id: 2, name: "Jane Doe", mutualFriends: 3 },
    // Add more people as needed
  ];

  return (
    <div className="col-md-5 mb-5">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">People You May Know</h3>
          {people.map((person) => (
            <div key={person.id} className="list-group mb-2">
              <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <div>
                  <span>{person.name}</span>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {person.mutualFriends} mutual friend{person.mutualFriends > 1 ? 's' : ''}
                  </div>
                </div>
                <button className="btn btn-primary">Send Request</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeopleList;
