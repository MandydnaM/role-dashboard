import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../services/roleService';
import { Role, Permission } from '../types/role';

interface RoleItemProps {
  role: Role;
  permissions: Permission[];
}

// 获取本地存储的权限设置
const getStoredPermissions = (roleId: string): string[] => {
  try {
    const stored = localStorage.getItem(`permissions-${roleId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// 保存权限设置到本地存储
const storePermissions = (roleId: string, permissions: string[]) => {
  localStorage.setItem(`permissions-${roleId}`, JSON.stringify(permissions));
};

export const RoleItem = ({ role, permissions }: RoleItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEditing) {
      // 优先使用本地存储的权限设置
      const stored = getStoredPermissions(role.id);
      setSelectedPermIds(stored || role.permissions.map(p => p.id));
    }
  }, [isEditing, role.id, role.permissions]);

  const mutation = useMutation<
    Role,
    Error,
    Permission[]
  >({
    mutationFn: (selectedPermissions: Permission[]) => 
      roleService.setPermissionsForRole(role.id, selectedPermissions),
    onSuccess: (updatedRole) => {
      // 更新成功后同步到本地存储
      storePermissions(role.id, updatedRole.permissions.map(p => p.id));
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
    // 清除未保存的本地修改
    localStorage.removeItem(`permissions-${role.id}`);
    setIsEditing(false);
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
                    // 实时保存修改到本地存储
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