import React, { useState } from 'react';

interface CsvRow {
  name: string;
  email: string;
  age: number;
}

interface ValidationError {
  name?: string;
  email?: string;
  age?: string;
}

interface ErrorCorrectionRowProps {
  row: CsvRow;
  errors: ValidationError;
  onCorrect: (correctedRow: CsvRow) => void;
}

const ErrorCorrectionRow: React.FC<ErrorCorrectionRowProps> = ({ row, errors, onCorrect }) => {
  const [correctedRow, setCorrectedRow] = useState<CsvRow>(row);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCorrectedRow(prev => ({ ...prev, [name]: value }));
  };

  const handleCorrect = () => {
    onCorrect(correctedRow);
  };

  return (
    <div className="error-correction-row p-4 bg-gray-100 border rounded-md shadow-sm mb-4">
      <div className="flex flex-col space-y-2">
        {['name', 'email', 'age'].map(field => (
          <div key={field} className="field-group">
            <label className="font-semibold capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={(correctedRow as any)[field]}
              onChange={handleInputChange}
              className={`border p-2 rounded-md w-full ${errors[field as keyof ValidationError] ? 'border-red-500' : ''}`}
              placeholder={`Enter correct ${field}`}
            />
            {errors[field as keyof ValidationError] && (
              <p className="text-red-500 text-sm mt-1">{errors[field as keyof ValidationError]}</p>
            )}
          </div>
        ))}
        <button
          onClick={handleCorrect}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Correction
        </button>
      </div>
    </div>
  );
};

export default ErrorCorrectionRow;
