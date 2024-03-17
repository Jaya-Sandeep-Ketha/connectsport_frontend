import React from 'react';
import SidebarComponent from "./sideBar";

const GroupList = ({ groups, onGroupSelect, onManageGroup }) => (
    <div className="group-list">
      {groups.map(group => (
        <div key={group.id} className="group-item">
          <div onClick={() => onGroupSelect(group.id)} className="group-name">
            {group.name}
          </div>
          {/* Adding a manage button for each group */}
          <button onClick={() => onManageGroup(group.id)} className="manage-group-btn">Manage</button>
        </div>
      ))}
    </div>
  );

export default GroupList;
