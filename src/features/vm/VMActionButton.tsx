import { Button, CircularProgress } from "@mui/material";
import { VMActionButtonProps } from "../../models/VMActionButtonProps";

const buttonStyle = {
  width: '190px',
  margin: 'auto',
};

export const VMActionButton: React.FC<VMActionButtonProps> = ({
  label,
  onClick,
  loading = false,
  icon: Icon,
  color = "primary",
}) => {
  return (
    <Button
      sx={buttonStyle}
      aria-label={label}
      variant="contained"
      color={color}
      onClick={onClick}
      disabled={loading}
    >
      <Icon />
      {loading ? <CircularProgress size={24} /> : label}
    </Button>
  );
};
