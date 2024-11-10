import React, { useState, useEffect } from 'react';

interface UploadResult {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface ErrorDetails {
  row: number;
  details: {
    name?: string;
    email?: string;
    age?: string;
  };
}

const UploadResultsPage: React.FC = () => {
  const [success, setSuccess] = useState<UploadResult[]>([]);
  const [errors, setErrors] = useState<ErrorDetails[]>([]);

  useEffect(() => {
    // Simulate data fetch, replace with actual API call
    setSuccess([{ id: 1, name: 'Juan Perez', email: 'juan.perez@example.com', age: 28 }]);
    setErrors([
      { row: 4, details: { name: "El campo 'name' no puede estar vacío.", email: "Email inválido", age: "Edad debe ser un número positivo" } },
    ]);
  }, []);

  return (
    <div>
      <h1>Upload Results</h1>

      <h2>Success</h2>
      <ul>
        {success.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <h2>Errors</h2>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>
            Row {error.row}: 
            {error.details.name && <p>Name: {error.details.name}</p>}
            {error.details.email && <p>Email: {error.details.email}</p>}
            {error.details.age && <p>Age: {error.details.age}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadResultsPage;
