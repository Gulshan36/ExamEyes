import { Link } from 'react-router-dom';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <img 
        src="/images/logos/dark-logo.svg" 
        alt="Logo" 
        height={70} 
        style={{ width: 'auto' }}
      />
    </LinkStyled>
  );
};

export default Logo;
