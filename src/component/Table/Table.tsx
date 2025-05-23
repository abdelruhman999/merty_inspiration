import React from 'react';

export interface TableHeader<T> {
    key: keyof T;
    label: string;
    render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
    headers: TableHeader<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    className?: string;
}

export function Table<T>({
    headers,
    data,
    onRowClick,
    className = ''
}: TableProps<T>) {
    
    return (
        <div className="w-full overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={String(header.key)+String(header.label)}
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                 
                    
                <tr
                    key={index}
                    onClick={() => onRowClick?.(item)}
                    className={`${onRowClick || index === 0 ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                    {headers.map((header) => (
                        <td
                            key={`${index}-${String(header.key)}-${String(header.label)}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center"
                        >
                            {header.render 
                                ? header.render(item)
                                : String(item[header.key])}
                        </td>
                    ))}
                </tr>
            ))}
         </tbody>
            </table>
        </div>
    );
}