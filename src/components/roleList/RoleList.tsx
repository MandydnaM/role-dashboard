import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../services/roleService';
import RoleItem from '../roleItem/RoleItem';
import { Role, Permission } from '../../types/role';
import './roleList.scss';

const RoleList = () => {
  const { 
    data: roles, 
    isLoading: rolesLoading, 
    error: rolesError 
  } = useQuery<Role[], Error>({
  queryKey: ['roles'],          
  queryFn: () => roleService.getRoles()
});

  const { 
  data: permissions, 
  isLoading: permsLoading, 
  error: permsError 
} = useQuery<Permission[], Error>({  
  queryKey: ['permissions'],        
  queryFn: () => roleService.getPermissions()
});

  if (rolesLoading || permsLoading) return <div>Loading...</div>;
  if (rolesError) return <div>Error loading roles: {(rolesError as Error).message}</div>;
  if (permsError) return <div>Error loading permissions: {(permsError as Error).message}</div>;

  return (
    <div className="role-list">
      <h1>Role Permissions Management</h1>
      <div className="role-card">
        {roles?.map((role) => (
        <RoleItem key={role.id} role={role} permissions={permissions || []} />
      ))}
      </div>
    </div>
  );
};

export default RoleList;