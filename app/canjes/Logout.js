import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({
          returnTo: window.location.origin, // Donde redirigir después del logout (normalmente la página de inicio)
        })
      }
    >
      Logout
    </button>
  );
};

export default LogoutButton;
