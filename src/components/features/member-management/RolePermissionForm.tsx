import { useState, useEffect } from 'react';
import { Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, Checkbox, FormGroup, FormControlLabel, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUserRoles, getAllRoles, getAllPermissions, updateUserRole } from './service/role-permission-service';

interface RolePermissionFormProps {
  userId: number;
  onSuccess: () => void;
}

export default function RolePermissionForm({ userId, onSuccess }: RolePermissionFormProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách quyền và vai trò
  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles
  });

  const { data: userRoleData, isLoading: loadingUserRole } = useQuery({
    queryKey: ['userRole', userId],
    queryFn: () => getUserRoles(userId),
    enabled: !!userId
  });

  // Cập nhật selected role khi có data
  useEffect(() => {
    if (userRoleData?.roleId) {
      setSelectedRoleId(userRoleData.roleId);
    }
  }, [userRoleData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) {
      setError('Vui lòng chọn vai trò');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateUserRole(userId, selectedRoleId);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật vai trò');
    } finally {
      setLoading(false);
    }
  };

  if (loadingRoles || loadingUserRole) {
    return <CircularProgress size={24} />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!error}>
            <InputLabel id="role-select-label">Vai trò</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRoleId || ''}
              onChange={(e) => setSelectedRoleId(Number(e.target.value))}
              label="Vai trò"
            >
              {roles?.map((role: any) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        </Grid>

        {selectedRoleId && userRoleData?.permissions && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Quyền hạn của vai trò này:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {userRoleData.permissions.map((permission: any) => (
                <Typography key={permission.id} variant="body2">
                  • {permission.name}
                </Typography>
              ))}
            </Box>
          </Grid>
        )}

        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={onSuccess}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Lưu'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
