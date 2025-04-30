import { useQuery } from '@tanstack/react-query';
import { roleService } from '../services/roleService';
import { RoleItem } from './RoleItem';
import { Role, Permission } from '../types/role';

export const RoleList = () => {
  const { data: roles, isLoading: rolesLoading, error: rolesError } = useQuery<Role[], Error>({
  queryKey: ['roles'],          // 必须使用数组形式的queryKey
  queryFn: () => roleService.getRoles()
});
  const { 
  data: permissions, 
  isLoading: permsLoading, 
  error: permsError 
} = useQuery<Permission[], Error>({  // 添加 Error 类型参数
  queryKey: ['permissions'],        // 使用数组格式的queryKey
  queryFn: () => roleService.getPermissions()
});

  if (rolesLoading || permsLoading) return <div>Loading...</div>;
  if (rolesError) return <div>Error loading roles: {(rolesError as Error).message}</div>;
  if (permsError) return <div>Error loading permissions: {(permsError as Error).message}</div>;

  return (
    <div className="role-list">
      <h1>Role Permissions Management</h1>
      {roles?.map((role) => (
        <RoleItem key={role.id} role={role} permissions={permissions || []} />
      ))}
    </div>
  );
};