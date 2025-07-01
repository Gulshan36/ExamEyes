import { Link } from "react-router-dom";
import { styled } from "@mui/material";

const LinkStyled = styled(Link)(() => ({
  height: "80px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <img
        src="/logo.png"
        alt="Logo"
        height={80}
        style={{
          width: "auto",
          borderRadius: 40,
        }}
      />
    </LinkStyled>
  );
};

export default Logo;
