import React, { useState, useEffect } from "react";
import { IPosition } from "../shared/interfaces/data.viz.types";
import { Box, Button, Grid, Popover, TextField, Tooltip } from "@mui/material";
  
interface IDataVizFormProps {
    createOrUpdatePosition: (
      positions: IPosition[],
      updatedPosition: Partial<Omit<IPosition, "type">> & Pick<IPosition, "type">,
      jobIdToUpdate?: string
    ) => void;
    deletePositionByJobId: (positions: IPosition[], jobIdToDelete: string) => void;
  }
  
export default function DataVizForm (props: IDataVizFormProps) {
    const [position, setPosition] = useState<IPosition[]>([]);
    const positions: IPosition[] = position;
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [jobId, setJobId] = useState("");
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const groupPositionsByJobId = (
        positions: IPosition[]
      ): { [jobId: string]: IPosition[] } => {
        // Sort positions by date in descending order
        const sortedPositions = positions.sort(
          (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        );
    
        // Initialize an empty object to store grouped positions
        const groupedPositions: { [jobId: string]: IPosition[] } = {};
    
        // Iterate over each sorted position
        sortedPositions.forEach((position) => {
          // Check if the jobId already exists in the groupedPositions object
          if (groupedPositions[position.jobId]) {
            // If jobId exists, push the position into the corresponding array
            groupedPositions[position.jobId].push(position);
          } else {
            // If jobId doesn't exist, create a new array with the position
            groupedPositions[position.jobId] = [position];
          }
        });
    
        return groupedPositions;
      };

const createOrUpdatePosition = (
    positions: IPosition[],
    updatedPosition: Partial<Omit<IPosition, "type">> & Pick<IPosition, "type">,
    jobIdToUpdate?: string
  ): { [jobId: string]: IPosition[] } => {
    // Get the current date and time
    const currentDateTime = new Date().toISOString();

    // Determine the type based on whether the jobIdToUpdate is provided
    const type = jobIdToUpdate ? "UPDATED" : "CREATED";

    if (jobIdToUpdate) {
      // Find the index of the position with the given jobId
      const index = positions.findIndex(
        (position) => position.jobId === jobIdToUpdate
      );

      // If the position with the jobId is found
      if (index !== -1) {
        // Create a copy of the positions array to avoid mutating the original array
        const updatedPositions = [...positions];

        // Update the position at the found index with the updatedPosition
        updatedPositions[index] = {
          ...updatedPositions[index], // Copy existing position properties
          ...updatedPosition, // Update with new properties
          type, // Set the type
        };

        // Group the updated positions by jobId
        const groupedPositions: { [jobId: string]: IPosition[] } = {};
        updatedPositions.forEach((position) => {
          if (groupedPositions[position.jobId]) {
            groupedPositions[position.jobId].push(position);
          } else {
            groupedPositions[position.jobId] = [position];
          }
        });

        return groupedPositions;
      } else {
        // If the position with the given jobId is not found
        console.error(`Position with jobId ${jobIdToUpdate} not found.`);
        return {};
      }
    } else {
      // If jobIdToUpdate is not provided, create a new position with the updated properties
      const newPosition = {
        _id: updatedPosition._id || "",
        jobId: updatedPosition.jobId || "",
        title: updatedPosition.title || "",
        createAt: currentDateTime, // Set createAt to current date and time
        status: updatedPosition.status || "",
        name: updatedPosition.name || { first: "", last: "" },
        personId: updatedPosition.personId || "",
        managerId: updatedPosition.managerId || "",
        comp: updatedPosition.comp || {},
        type,
      };

      // Create a copy of the positions array to avoid mutating the original array
      const updatedPositions = [...positions, newPosition];

      // Group the positions by jobId
      const groupedPositions: { [jobId: string]: IPosition[] } = {};
      updatedPositions.forEach((position) => {
        if (groupedPositions[position.jobId]) {
          groupedPositions[position.jobId].push(position);
        } else {
          groupedPositions[position.jobId] = [position];
        }
      });

      return groupedPositions;
    }
  };

  const newPosition = {
    jobId: "123",
    title: "Front Desk",
    status: "ACTIVE",
    name: { first: "Titus", last: "Andromedon" },
    personId: "789",
    managerId: "101112",
  };

//   const updatedPositions = createOrUpdatePosition(positions, newPosition);

  const deletePositionByJobId = (positions: any[], jobIdToDelete: any) => {
    // Filter out the position with the given jobId
    const updatedPositions = positions.filter(
      (position) => position.jobId !== jobIdToDelete
    );
    return updatedPositions;
  };

//   const deletedPosition = deletePositionByJobId(positions, "123");

  const handleCreateOrUpdate = () => {
    // Generate unique IDs for jobId, personId, and managerId
    const newJobId = `JOB_${Math.random().toString(36).substr(2, 9)}`;
    const newPersonId = `PERSON_${Math.random().toString(36).substr(2, 9)}`;
    const newManagerId = `MANAGER_${Math.random().toString(36).substr(2, 9)}`;

    // Create a new position with the generated IDs
    const newPosition: Partial<Omit<IPosition, "type">> & Pick<IPosition, "type"> = {
      jobId: newJobId,
      title,
      status,
      name: { first: firstName, last: lastName },
      personId: newPersonId,
      managerId: newManagerId,
      type: "CREATED", // or "UPDATED" if needed
    };
    
    // Call the createOrUpdatePosition function with the new position
    createOrUpdatePosition([], newPosition);
    handleClose();
};

  const handleDelete = () => {
    deletePositionByJobId([], jobId);
    handleClose();
  };
console.log(newPosition)

    return (
        <div>
        <Button color={'secondary'} aria-describedby={id} variant="contained" onClick={handleClick}>
          Manage Employees
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Job ID"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
              <Tooltip title="Enter Job ID to update" arrow>
                <Button color={"secondary"} variant="contained" onClick={handleCreateOrUpdate}>
                  Create/Update
                </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
              <Tooltip title="Enter Job ID to delete" arrow>
                <Button color={"secondary"} variant="contained" onClick={handleDelete}>
                  Delete
                </Button>
              </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Popover>
      </div>
    );
  }
  