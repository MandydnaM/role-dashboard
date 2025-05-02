import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../../services/roleService';
import { Role, Permission } from '../../types/role';
import './roleItem.scss';

interface RoleItemProps {
  role: Role;
  permissions: Permission[];
}

const RoleItem = ({ role, permissions }: RoleItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEditing) setSelectedPermIds(role.permissions.map(p => p.id));
  }, [isEditing, role.permissions]);

const mutation = useMutation<
  Role,        
  Error,       
  Permission[] 
>({
  mutationFn: (selectedPermissions: Permission[]) => 
    roleService.setPermissionsForRole(role.id, selectedPermissions),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['roles'] }); 
    setIsEditing(false);
  },
  onError: (error: Error) => {
    alert(`Error updating permissions: ${error.message}`);
  }
});

  const handleSave = () => {
    const selectedPermissions = permissions.filter(p => selectedPermIds.includes(p.id));
    mutation.mutate(selectedPermissions);
  };

  return (
    <div className="role-item">
      <h2>{role.name}</h2>
      
      {!isEditing ? (
        <div>
          <h3>Current Permissions</h3>
          {role.permissions.length === 0 ? (
            <p>No permissions assigned</p>
          ) : (
            <ul>
              {role.permissions.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
          )}
          <button onClick={() => setIsEditing(true)}>Edit Permissions</button>
        </div>
      ) : (
        <div className="edit-section">
          <h3>Modify Permissions</h3>
          <div className="permissions-grid">
            {permissions.map(p => (
              <label key={p.id} className="permission-item">
                <input
                  type="checkbox"
                  checked={selectedPermIds.includes(p.id)}
                  onChange={(e) => {
                    const newIds = e.target.checked
                      ? [...selectedPermIds, p.id]
                      : selectedPermIds.filter(id => id !== p.id);
                    setSelectedPermIds(newIds);
                  }}
                />
                {p.name}
              </label>
            ))}
          </div>
          <div className="action-buttons">
            <button 
              onClick={handleSave}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
          </div>
          {mutation.isError && (
            <p className="error-message">Error: {mutation.error.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleItem;