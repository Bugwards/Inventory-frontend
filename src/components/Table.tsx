import React from 'react';

interface TableProps {
  headers?: string[];
  data?: any[];
}

export default function Table({ headers = [], data = [] }: TableProps) {
  return (
    <div className="overflow-x-auto w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-600">
            {headers.map((header, index) => (
              <th key={index} className="p-4 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="p-4">
                    {row[header.toLowerCase().replace(/ /g, '_')] || '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="p-8 text-center text-gray-400 text-sm italic">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
