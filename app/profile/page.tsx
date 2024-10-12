'use client';
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  // Verifica si está autenticado y si existe el objeto `user`
  return (
    isAuthenticated && user && (
      <div>
        {/* Agrega un valor por defecto a la imagen en caso de que no haya */}
        <img src={user.picture || "/default-avatar.png"} alt={user.name || "User"} />
        <h2>{user.name || "No Name"}</h2>
        <p>{user.email || "No Email"}</p>
      </div>
        )
         
  );
};

export default Profile;
