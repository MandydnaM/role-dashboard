// RoleItem.tsx
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../services/roleService';
import { Role, Permission } from '../types/role';

interface RoleItemProps {
  role: Role;
  permissions: Permission[];
}

const getStoredPermissions = (roleId: string): string[] => {
  try {
    const stored = localStorage.getItem(`permissions-${roleId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storePermissions = (roleId: string, permissions: string[]) => {
  localStorage.setItem(`permissions-${roleId}`, JSON.stringify(permissions));
};

export const RoleItem = ({ role, permissions }: RoleItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);
  const [mergedPermissions, setMergedPermissions] = useState<Permission[]>([]);
  const queryClient = useQueryClient();

  // 合并服务端数据和本地存储数据
  useEffect(() => {
    const storedIds = getStoredPermissions(role.id);
    const effectiveIds = storedIds.length > 0 ? storedIds : role.permissions.map(p => p.id);
    const effectivePermissions = permissions.filter(p => effectiveIds.includes(p.id));
    setMergedPermissions(effectivePermissions);
  }, [role, permissions]);

  useEffect(() => {
    if (isEditing) {
      setSelectedPermIds(mergedPermissions.map(p => p.id));
    }
  }, [isEditing, mergedPermissions]);

  const mutation = useMutation<
    Role,
    Error,
    Permission[]
  >({
    mutationFn: (selectedPermissions: Permission[]) => 
      roleService.setPermissionsForRole(role.id, selectedPermissions),
    onSuccess: (updatedRole) => {
      const newIds = updatedRole.permissions.map(p => p.id);
      storePermissions(role.id, newIds);
      setMergedPermissions(updatedRole.permissions);
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

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="role-item">
      <h2>{role.name}</h2>
      
      {!isEditing ? (
        <div>
          <h3>Current Permissions</h3>
          {mergedPermissions.length === 0 ? (
            <p>No permissions assigned</p>
          ) : (
            <ul>
              {mergedPermissions.map(p => <li key={p.id}>{p.name}</li>)}
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
                    storePermissions(role.id, newIds);
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
              onClick={handleCancel}
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