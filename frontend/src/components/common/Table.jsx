import React from 'react';

const Table = ({
  headers = [],
  data = [],
  renderRow,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  return (
    <div className="w-full overflow-x-auto border border-zinc-800 rounded-lg bg-[#0e0f14]">
      <table className="w-full border-collapse text-left text-sm text-zinc-300">
        <thead className="bg-[#12131a] text-zinc-400 border-b border-zinc-850">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-850">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-10 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-zinc-500 font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
