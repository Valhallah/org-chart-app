import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import changes from "../data/changes.json";
import persons from "../data/persons.json";


export interface IPersonsProps {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  createAt: string;
}

export interface IChangesProps {
  _id: string;
  jobId: string;
  type: string;
  date: string;
  status: string;
  data?: {
    title?: string;
    promotionType?: string;
    managerId?: string;
    personId?: string;
    comp?: {
      currency?: string;
      base?: number;
      grantShares?: number;
      grantType?: string;
    };
    departType?: string;
    fields?: {
      managerNotes?: string;
    };
  };
  createAt: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'jobId', headerName: 'Job ID', width: 150 },
  { field: 'title', headerName: 'Title', width: 150 }, // New 'Title' column
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
];

const DataVizGrid: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'date',
      sort: 'desc',
    },
  ]);

  useEffect(() => {
    // Combine data from 'personss.json' and 'changes.json' into a single array
    const combinedData = combineData(persons, changes);
    setRows(combinedData);
  }, []);

  const combineData = (personsData: IPersonsProps[], changesData: IChangesProps[]) => {
    return changesData.map(change => {
      const matchingPerson = personsData.find(person => person._id === change.data?.personId);
      return {
        id: change._id,
        jobId: change.jobId,
        title: change.data?.title || '', 
        type: change.type,
        date: change.date,
        status: change.status,
        person: matchingPerson ? `${matchingPerson.name.first} ${matchingPerson.name.last}` : '',
      };
    });
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        // pageSize={5}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
      />
    </div>
  );
};

export default DataVizGrid;