
import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  if (!text) return null;

  const renderMarkdownText = (markdown: string): React.ReactNode[] => {
    const lines = markdown.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let laymanPointerLines: string[] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableBody: string[][] = [];

    let contentLines = [...lines];
    const hrIndex = lines.findIndex(line => line.trim() === '---');
    if (hrIndex !== -1) {
      laymanPointerLines = lines.slice(hrIndex + 1).filter(line => line.trim() !== '');
      contentLines = lines.slice(0, hrIndex);
    }
    
    const closeTable = () => {
        if(inTable) {
             elements.push(
              <div key={`table-${elements.length}`} className="my-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600 rounded-lg shadow-md">
                  <thead className="bg-gray-700">
                    <tr>
                      {tableHeaders.map((header, idx) => (
                        <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {tableBody.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 border-b border-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            inTable = false;
            tableHeaders = [];
            tableBody = [];
        }
    };

    const closeList = () => {
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 ml-4">{currentList}</ul>);
        currentList = [];
      }
    };


    for (const line of contentLines) {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('|')) {
        closeList();
        const cells = trimmedLine.split('|').map(cell => cell.trim()).slice(1, -1);
        if (cells.length > 0) {
          if (!inTable) {
            inTable = true;
            tableHeaders = cells;
            tableBody = [];
          } else if (!cells.some(cell => cell.includes('---'))) {
            tableBody.push(cells);
          }
        }
      } else {
        closeTable();
        if (trimmedLine.startsWith('## ')) {
            closeList();
            elements.push(<h3 key={`h2-${elements.length}`} className="text-2xl font-medium mb-3 mt-6 text-purple-300">{trimmedLine.substring(3)}</h3>);
        } else if (trimmedLine.startsWith('### ')) {
            closeList();
            elements.push(<h4 key={`h3-${elements.length}`} className="text-xl font-medium mb-2 mt-4 text-blue-300">{trimmedLine.substring(4)}</h4>);
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            currentList.push(<li key={`li-${elements.length}-${currentList.length}`}>{trimmedLine.substring(2)}</li>);
        }
      }
    }
    
    closeTable();
    closeList();

    if (laymanPointerLines.length > 0) {
      elements.push(<hr key="hr-layman" className="my-6 border-gray-600" />);
      elements.push(
        <div key="layman-summary" className="mt-6 p-4 bg-indigo-900 rounded-lg border border-indigo-700 text-center italic text-lg text-blue-200">
          {laymanPointerLines.map((line, idx) => (
            <p key={`layman-p-${idx}`}>{line}</p>
          ))}
        </div>
      );
    }

    return elements;
  };

  return <>{renderMarkdownText(text)}</>;
};

export default MarkdownRenderer;
