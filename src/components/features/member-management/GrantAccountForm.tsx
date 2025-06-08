import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

interface GrantAccountFormProps {
  memberId: number;
  onSuccess?: () => void;
}

const GrantAccountForm: React.FC<GrantAccountFormProps> = ({ memberId, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`/api/member_management?action=createAccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, password, username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Có lỗi xảy ra");
      } else {
        setSuccess("Cấp tài khoản thành công!");
        setUsername("");
        setPassword("");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, width: 350 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        label="Username (tuỳ chọn)"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <TextField
        label="Mật khẩu"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        type="password"
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Đang cấp tài khoản..." : "Cấp tài khoản"}
      </Button>
    </Box>
  );
};

export default GrantAccountForm;
