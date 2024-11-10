import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { error } from 'console';

interface Record {
  id: number;
  name: string;
  email: string;
  age: number;
  errorDetails?: string[];
}

const FileUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [records, setRecords] = useState<Record[]>([]); // Holds records with errors
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New success message state
  const navigate = useNavigate();

  // Check if the user is authenticated (has JWT token)
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem('jwtToken');
    const formData = new FormData();
    formData.append('file', file);

    try {
      if (token) {
        const response = await axios.post('http://localhost:5500/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const { success, errors } = response.data.data;
        console.log("sabiendo",response.data.data.errors);
        // Handle errors (if any)
        if (!success) {
          setErrorMessages(errors || ['Unknown error occurred during file upload.']);
        }

        // Format error records (those with issues)

        const errorRecords = errors.map((error: any, index: number) => ({
          id: index + 1, // Assign unique id for each row
          name: error.rowData.name || '',
          email: error.rowData.email || '',
          age: error.rowData.age || '',
          errorDetails: error.details || [],
        }));

        setRecords(errorRecords);
        //console.log(errorRecords);
        console.log("recors",records);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessages(['Error uploading the file. Please try again later.']);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5500/logout');
      localStorage.removeItem('jwtToken');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Redirect to login page if not authenticadted
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Handle inline field editing
  const handleFieldChange = (id: number, field: string, value: string) => {
    console.log("estso los campos",id, field, value);
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const handleSaveRecord = async (record: Record) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const successfullySavedRecords: number[] = [];

      if (token) {
        const formData = new FormData();
        formData.append('name', record.name);
        formData.append('email', record.email);
        formData.append('age', record.age.toString());
        formData.append('password', "Elpassword")
        console.log("formData para el registro individual:", formData);
        const response = await axios.post('http://localhost:5500/register', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        // Remove the saved record from the records array
        setRecords((prevRecords) => prevRecords.filter((r) => r.id !== record.id));

        // Remove errors from record if successfully saved
        setRecords((prevRecords) =>
          prevRecords.map((r) =>
            r.id === record.id ? { ...r, errorDetails: [] } : r
          )
        );
        setErrorMessages([]);
        successfullySavedRecords.push(record.id);
        setSuccessMessage(`${successfullySavedRecords.length} Registro Guardados.`);
      }
    } catch (error) {
      console.error('Error saving record:', error);
      setErrorMessages(['Error Guardando el Registro']);
    }
  };

  const handleSaveChanges = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setErrorMessages(['User is not authenticated.']);
      return;
    }

    // Filter records with no errors
const updatedRecords = records.filter((record) => !record.errorDetails?.length);
    //   (record) => Array.isArray(record.errorDetails) && record.errorDetails.length === 2
    //);
    console.log(updatedRecords);
    if (!updatedRecords.length) {
      setErrorMessages(['No valid records to save.']);
      return;
    }

    const successfullySavedRecords: number[] = [];
    const errors: string[] = [];

    for (const record of updatedRecords) {
      try {
        const formData = new FormData();
        formData.append('name', record.name);
        formData.append('email', record.email);
        formData.append('age', record.age.toString());
        formData.append('password', "Elpassword");

        const response = await axios.post('http://localhost:5500/register', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(`Record saved: ${record.id}`, response.data);
        successfullySavedRecords.push(record.id);
      } catch (err) {
        console.error(`Error saving record ${record.id}:`, err);
        errors.push(`Failed to save record with ID: ${record.id}`);
      }
    }

    // Remove successfully saved records from the view
    setRecords((prevRecords) =>
      prevRecords.filter((record) => !successfullySavedRecords.includes(record.id))
    );

    // Update error messages if there were any issues
    if (errors.length > 0) {
      setErrorMessages(errors);
      setSuccessMessage(null);
    } else {
        setErrorMessages([]);
        setSuccessMessage(`${successfullySavedRecords.length} Registro Guardados.`);

      //navigate('/upload', {
//state: { success: true, errors: [] },
      //});
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    setErrorMessages(['Error saving the corrected records.'])
    setSuccessMessage(null);
  }
};

  return (
    <div className='p-8'>
      <h1 className="text-2xl font-bold mb-4">Ingresar Registros desde un Archivo</h1>
      {errorMessages.length > 0 && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <ul>
            {errorMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
      {successMessage && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{successMessage}</div>}
      {/* <input type="file" accept=".csv" onChange={handleFileChange} className="border p-2 mb-4" /> */}
      <label className="border p-2 mb-4 bg-blue-500 text-white rounded cursor-pointer inline-block">
        Seleccionar archivo CSV
        <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
        />
      </label>
      {file && (
        <p className="mt-2 text-gray-700">
          Archivo seleccionado: <strong>{file.name}</strong>
        </p>
      )}
      <button onClick={handleFileUpload} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 ml-5">Sube el Archivo</button>
      <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded">Salir</button>

      {records.length > 0 && (
        <div className='mt-8'>
          <h2 className="text-xl font-bold mb-4">Errores</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Correo</th>
                <th className="px-4 py-2 border">Edad</th>
                <th className="px-4 py-2 border">Errores</th>
                <th className="px-4 py-2 border">Accion</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className='text-center'>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={record.name}
                      onChange={(e) => handleFieldChange(record.id, 'name', e.target.value)}
                      className='px-4 py-2 '
                    />
                  </td>
                  <td className='px-4 py-2 border'>
                    <input
                      type="text"
                      value={record.email}
                      onChange={(e) => handleFieldChange(record.id, 'email', e.target.value)}
                      className=' p-2 w-full'
                    />
                  </td>
                  <td className='px-4 py-2 border'>
                    <input
                      type="number"
                      value={record.age}
                      onChange={(e) => handleFieldChange(record.id, 'age', e.target.value)}
                      className=' p-2 w-full'
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    {record.errorDetails && typeof record.errorDetails === 'object' ? (
                    Object.entries(record.errorDetails).map(([key, error], index) => (
                    <p key={index} className='text-red-500'>
                    {key}:{error}
                    </p>
                    ))
                    ) : (
                    <p>No errors</p>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        handleSaveRecord(record)
                      }}
                      className='bg-green-500 text-white px-2 py-1 rounded'
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveChanges}>Save All Corrected Records</button>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;
