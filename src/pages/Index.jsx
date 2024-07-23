import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Download, Upload } from 'lucide-react';

const CSVEditor = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [newRow, setNewRow] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      const headers = lines[0].split(',');
      setHeaders(headers);
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });
      setData(rows);
    };
    reader.readAsText(file);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
  };

  const handleSave = () => {
    const updatedData = data.map(row => row === editingRow ? { ...row, ...newRow } : row);
    setData(updatedData);
    setEditingRow(null);
    setNewRow({});
  };

  const handleDelete = (row) => {
    const updatedData = data.filter(item => item !== row);
    setData(updatedData);
  };

  const handleAddRow = () => {
    setData([...data, newRow]);
    setNewRow({});
  };

  const handleDownload = () => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'edited_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleInputChange = useCallback((header, value) => {
    setNewRow(prev => ({ ...prev, [header]: value }));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Editor</h1>
      
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2" />
        <Button onClick={handleDownload} className="ml-2">
          <Download className="mr-2 h-4 w-4" /> Download CSV
        </Button>
      </div>

      {headers.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map(header => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {headers.map(header => (
                    <TableCell key={header}>
                      {editingRow === row ? (
                        <Input
                          value={newRow[header] || row[header] || ''}
                          onChange={(e) => handleInputChange(header, e.target.value)}
                        />
                      ) : (
                        row[header]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editingRow === row ? (
                      <Button onClick={handleSave}>Save</Button>
                    ) : (
                      <>
                        <Button onClick={() => handleEdit(row)} className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(row)} variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Row
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Row</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {headers.map(header => (
                  <div key={header} className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={header} className="text-right">
                      {header}
                    </label>
                    <Input
                      id={header}
                      value={newRow[header] || ''}
                      onChange={(e) => handleInputChange(header, e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleAddRow}>Add Row</Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default CSVEditor;