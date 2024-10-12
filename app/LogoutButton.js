import { useRouter } from 'next/router';
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        // Redirige al login después de cerrar la sesión
        router.push('/login');
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '5px' }}>
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
