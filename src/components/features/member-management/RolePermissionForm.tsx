import { useState, useEffect } from 'react';
import { Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUserRoles, getAllRoles, updateUserRole } from './service/role-permission-service';

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

  // Mapping permission name sang tiếng Việt
  const permissionNameMap: Record<string, string> = {
    EDIT_PROFILE: 'Chỉnh sửa hồ sơ cá nhân',
    VIEW_INTERNAL_DOCS: 'Xem tài liệu nội bộ',
    VIEW_MEMBERS: 'Xem danh sách thành viên',
    MANAGE_MEMBERS: 'Quản lý thành viên',
    // CREATE_PAYMENT_REQUEST: 'Tạo yêu cầu thanh toán',
    // PROCESS_PAYMENT: 'Xử lý thanh toán',
    APPROVE_PAYMENT: 'Duyệt thanh toán',
    VIEW_APPLICATIONS: 'Xem đơn tuyến',
    EDIT_APPLICATIONS: 'Chỉnh sửa đơn tuyến',
    SHARE_POSTS: 'Chia sẻ bài viết',
    MANAGE_EVENT: 'Quản lý sự kiện',
    MANAGE_POST: 'Quản lý bài viết'
  };

  // Lấy danh sách quyền của role đang chọn
  const selectedRolePermissions =
    roles?.find((role: any) => role.id === selectedRoleId)?.permissions || [];

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

        {selectedRoleId && selectedRolePermissions.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Quyền hạn của vai trò này:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {selectedRolePermissions.map((permission: any) => (
                <Typography key={permission.id || permission.name} variant="body2">
                  • {permissionNameMap[permission.name] || permission.name}
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
