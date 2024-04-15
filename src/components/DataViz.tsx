import React, { useState, useEffect } from "react";
import changes from "../data/changes.json";
import persons from "../data/persons.json";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import DatePicker from "./DatePicker";
import CustomNode from "./CustomNode";
import "reactflow/dist/style.css";
import styled from "styled-components";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DataVizGrid from "./DataVizGrid";
import { IPersonsProps, IChangesProps, IPosition } from "../shared/interfaces/data.viz.types";


export default function DataViz() {
  const [position, setPosition] = useState<IPosition[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_node, setNodes] = useState<any[]>([]); // Replace any with your node type
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_edge, setEdges] = useState<any[]>([]);

  useEffect(() => {
    // Check if both changes and persons arrays are available
    if (changes && persons) {
      // Create a map of person IDs to their corresponding names
      const personNamesMap: {
        [personId: string]: { personId: string; first: string; last: string };
      } = {};
      persons.forEach((person) => {
        personNamesMap[person._id] = {
          personId: person._id,
          first: person.name.first,
          last: person.name.last,
        };
      });

      // Map over the changes array and transform each item to match the IPosition interface
      const newPosition: IPosition[] = changes.map((change) => {
        // Find the corresponding person based on personId
        let correspondingPerson;
        if (
          change.data &&
          change.data.personId &&
          personNamesMap[change.data.personId]
        ) {
          correspondingPerson = {
            first: personNamesMap[change.data.personId].first,
            last: personNamesMap[change.data.personId].last,
          };
        }

        // Create a new position object
        const newPositionItem: IPosition = {
          _id:
            persons.find((person) => person._id === change.data?.personId)
              ?._id || "",
          jobId: change.jobId,
          title: change.data && change.data.title ? change.data.title : "",
          createAt: change.createAt,
          status: change.status,
          type: change.type,
          comp: change.data?.comp,
          personId: change.data?.personId || "",
          managerId: change.data?.managerId || "",
          name: correspondingPerson
            ? {
                first: correspondingPerson.first,
                last: correspondingPerson.last,
              }
            : { first: "", last: "" },
          promotionType: change.data?.promotionType || "",
        };

        return newPositionItem;
      });

      // Sort the newPosition array by createdAt in ascending order
      newPosition.sort((a, b) => {
        return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
      });

      // Update the state with the new array of positions
      setPosition(newPosition);
    }
  }, []);

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

  const positions: IPosition[] = position;

  // Planned to create a form to add and delete nodes.
  // I got the code working but ran out of time for the UI unfortunately
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

  const updatedPositions = createOrUpdatePosition(positions, newPosition);

  const deletePositionByJobId = (positions: any[], jobIdToDelete: any) => {
    // Filter out the position with the given jobId
    const updatedPositions = positions.filter(
      (position) => position.jobId !== jobIdToDelete
    );
    return updatedPositions;
  };

  const deletedPosition = deletePositionByJobId(positions, "123");

  // I left these here to show the functions working - I wouldn't usually leave consoles
  // console.log("UPDATED!", updatedPositions);
  // console.log("DELTED!", deletedPosition);

  // I wanted to simplify this function but I ran out of time. I know it's unwieldy.
  // I also realized at the last second I'm not handling for time and changes made on the same day
  // I think that's where I'm running into a bug where names and titles aren't being returned when they should
  const getLatestPositionsByDate = (
    positions: IPosition[],
    date: Date
  ): {
    [jobId: string]: IPosition & {
      name: { first: string; last: string };
      title: string;
      managerId: string;
      personId: string;
      comp: {
        currency: string;
        base: number;
        grantShares: number;
        grantType: string;
      };
      promotionType?: string;
      _id: string;
    };
  } => {
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    // Filter positions for the specified date
    const filteredPositions = positions.filter((position) =>
      position.createAt.startsWith(formattedDate)
    );

    // Object to store personId and _id associations
    const personIdMap: { [id: string]: string } = {};
    const idMap: { [id: string]: string } = {};

    // Assign personId and _id to positions
    positions.forEach((position) => {
      if (position.personId && position._id) {
        personIdMap[position.jobId] = position.personId;
        idMap[position.jobId] = position._id;
      }
    });
    // If there are positions available for the specified date, return the latest positions
    if (filteredPositions.length > 0) {
      const latestPositions: {
        [jobId: string]: IPosition & {
          name: { first: string; last: string };
          title: string;
          managerId: string;
          personId: string;
          comp: {
            currency: string;
            base: number;
            grantShares: number;
            grantType: string;
          };
          promotionType?: string;
          _id: string; // Add _id to the return type
        };
      } = {};
      const latestNames: { [jobId: string]: { first: string; last: string } } =
        {};
      const latestTitles: { [jobId: string]: string } = {};
      const latestManagerIds: { [jobId: string]: string } = {};
      const latestComp: {
        [jobId: string]: {
          currency: string;
          base: number;
          grantShares: number;
          grantType: string;
        };
      } = {};
      // Group positions by createAt date
      const positionsByDate: { [date: string]: IPosition[] } = {};
      filteredPositions.forEach((position) => {
        const createDate = new Date(position.createAt).toDateString();
        if (!positionsByDate[createDate]) {
          positionsByDate[createDate] = [];
        }
        positionsByDate[createDate].push(position);
      });
      // Iterate over positions grouped by date
      Object.values(positionsByDate).forEach((positions) => {
        // Sort positions within each group by createAt time in descending order
        positions.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        );
        positions.forEach((position) => {
          const existingPosition = latestPositions[position.jobId];
          // this was an attempt to handle changes made on the same day
          if (
            !existingPosition ||
            // Check if the new position's createAt date is before the existing position's createAt date
            (new Date(position.createAt).getTime() ===
              new Date(existingPosition.createAt).getTime() &&
              // Compare times if dates are the same
              new Date(position.createAt).getTime() <
                new Date(existingPosition.createAt).getTime()) ||
            // Check if the new position's createAt date is after the existing position's createAt date
            new Date(position.createAt).getTime() >
              new Date(existingPosition.createAt).getTime()
          ) {
            // If no existing position or current position is newer, update the latest position
            latestPositions[position.jobId] = {
              ...position,
              name: position.name
                ? {
                    first: position.name.first || "",
                    last: position.name.last || "",
                  }
                : { first: "", last: "" },
              title: position.title || "",
              managerId: position.managerId || "",
              personId: personIdMap[position.jobId] || "", // Assign personId from map
              comp: position.comp
                ? {
                    currency: position.comp.currency || "",
                    base: position.comp.base || 0,
                    grantShares: position.comp.grantShares || 0,
                    grantType: position.comp.grantType || "",
                  }
                : { currency: "", base: 0, grantShares: 0, grantType: "" },
              promotionType: "",
              _id: idMap[position.jobId] || "", // Assign _id from map
            };
          }
          // Update latest data for the jobId
          latestNames[position.jobId] = position.name || {
            first: "",
            last: "",
          };
          latestTitles[position.jobId] = position.title || "";
          latestManagerIds[position.jobId] = position.managerId || "";
          latestComp[position.jobId] = position.comp
            ? {
                currency: position.comp.currency || "",
                base: position.comp.base || 0,
                grantShares: position.comp.grantShares || 0,
                grantType: position.comp.grantType || "",
              }
            : { currency: "", base: 0, grantShares: 0, grantType: "" };
        });
      });

      // Fill in data using the latest known data for each jobId
      Object.keys(latestPositions).forEach((jobId) => {
        if (
          !latestPositions[jobId].name ||
          !latestPositions[jobId].name.first ||
          !latestPositions[jobId].name.last
        ) {
          latestPositions[jobId].name = latestNames[jobId] || {
            first: "",
            last: "",
          };
        }

        if (!latestPositions[jobId].title) {
          latestPositions[jobId].title = latestTitles[jobId] || "";
        }

        if (!latestPositions[jobId].managerId) {
          latestPositions[jobId].managerId = latestManagerIds[jobId] || "";
        }

        if (!latestPositions[jobId].comp) {
          latestPositions[jobId].comp = latestComp[jobId] || {
            currency: "",
            base: 0,
            grantShares: 0,
            grantType: "",
          };
        }

        if (latestPositions[jobId].promotionType === "PROMOTION") {
          latestPositions[jobId].title =
            latestPositions[jobId].title + " - Promotion";
        }
      });

      return latestPositions;
    }
    // If no positions are available for the specified date, find the most recent positions relative to the given date
    const specifiedDate = new Date(date).getTime();
    const latestPositions: {
      [jobId: string]: IPosition & {
        name: { first: string; last: string };
        title: string;
        managerId: string;
        personId: string;
        comp: {
          currency: string;
          base: number;
          grantShares: number;
          grantType: string;
        };
        promotionType?: string;
        _id: string;
      };
    } = {};
    const latestNames: { [jobId: string]: { first: string; last: string } } =
      {};
    const latestTitles: { [jobId: string]: string } = {};
    const latestManagerIds: { [jobId: string]: string } = {};
    const managerIds: Set<string> = new Set();
    const latestComp: {
      [jobId: string]: {
        currency: string;
        base: number;
        grantShares: number;
        grantType: string;
      };
    } = {};

    positions.forEach((position) => {
      if (position.managerId) {
        managerIds.add(position.managerId);
      }
    });
    const uniqueManagerIds = Array.from(managerIds);
    positions.forEach((position) => {
      const existingPosition = latestPositions[position.jobId];
      const currentPositionDate = new Date(position.createAt).getTime();
      // Check if the current position's createAt date is before or equal to the specified date
      if (
        currentPositionDate <= specifiedDate &&
        (!existingPosition ||
          currentPositionDate > new Date(existingPosition.createAt).getTime())
      ) {
        latestPositions[position.jobId] = {
          ...position,
          name: position.name
            ? {
                first: position.name.first || "",
                last: position.name.last || "",
              }
            : { first: "", last: "" },
          title: position.title || "",
          managerId: position.managerId || "",
          personId: position.personId || "", // Assign personId from map
          comp: position.comp
            ? {
                currency: position.comp.currency || "",
                base: position.comp.base || 0,
                grantShares: position.comp.grantShares || 0,
                grantType: position.comp.grantType || "",
              }
            : { currency: "", base: 0, grantShares: 0, grantType: "" },
          promotionType: "",
          _id: position._id || "", // Assign _id from map
        };
      }
      // Update latest data for the jobId
      latestNames[position.jobId] = position.name || { first: "", last: "" };
      latestTitles[position.jobId] = position.title || "";
      latestManagerIds[position.jobId] = position.managerId || "";
      latestComp[position.jobId] = position.comp
        ? {
            currency: position.comp.currency || "",
            base: position.comp.base || 0,
            grantShares: position.comp.grantShares || 0,
            grantType: position.comp.grantType || "",
          }
        : { currency: "", base: 0, grantShares: 0, grantType: "" };
    });

    // Fill in missing data using the latest known data for each jobId
    Object.keys(latestPositions).forEach((jobId) => {
      if (
        !latestPositions[jobId].name ||
        !latestPositions[jobId].name.first ||
        !latestPositions[jobId].name.last
      ) {
        latestPositions[jobId].name = latestNames[jobId] || {
          first: "",
          last: "",
        };
      }

      if (!latestPositions[jobId].title) {
        latestPositions[jobId].title = latestTitles[jobId] || "";
      }
      if (!latestPositions[jobId].managerId && uniqueManagerIds.length > 0) {
        latestPositions[jobId].managerId = uniqueManagerIds[0];
      }
      if (!latestPositions[jobId].managerId) {
        latestPositions[jobId].managerId = latestManagerIds[jobId] || "";
      }

      if (!latestPositions[jobId].personId) {
        latestPositions[jobId].personId = personIdMap[jobId] || "";
      }

      if (!latestPositions[jobId].comp) {
        latestPositions[jobId].comp = latestComp[jobId] || {
          currency: "",
          base: 0,
          grantShares: 0,
          grantType: "",
        };
      }

      if (latestPositions[jobId].promotionType === "PROMOTION") {
        latestPositions[jobId].title =
          latestPositions[jobId].title + " - Promotion";
      }
    });

    return latestPositions;
  };

  const latestPositions = getLatestPositionsByDate(positions, selectedDate);

  // node filter
  const edges: { id: string; source: string; target: string; type: string }[] =
    [];
  const nodeMap: { [jobId: string]: any } = {};
  let x = 0;
  let y = 0;

  // Create nodes
  Object.entries(latestPositions).forEach(([jobId, position]) => {
    const node = {
      id: jobId,
      data: {
        label: `${position.title && "Position:"} ${position.title}  Comp: $${
          position.comp?.base ?? ""
        } ${position.name?.first && position.name?.last && "Name:"} ${
          position.name?.first ?? ""
        }${position.name?.first && "\u00A0"}${position.name?.last ?? ""} ${
          position.type && "Type:"
        }${position.type && "\u00A0"}${position.type}  Status:${
          position.status && "\u00A0"
        }${position.status} Job\u00A0ID: ${position.jobId} Manager\u00A0ID: ${
          position.managerId
        }`,
      },
      _id: position._id,
      personId: position.personId,
      position: { x, y },
      managerId: position.managerId,
      comp: position.comp,
      name: { first: position.name?.first, last: position.name?.last },
      type: "custom",
    };
    x += 300;
    y += 100;
    nodeMap[jobId] = node;
  });

  // Create edges
  Object.entries(latestPositions).forEach(([jobId, position]) => {
    if (
      position.managerId &&
      nodeMap[position.managerId] &&
      position.managerId !== jobId
    ) {
      const edge = {
        id: `${position.managerId}-${jobId}`,
        source: position.managerId,
        target: jobId,
        type: "step",
      };
      edges.push(edge);
    }
  });

  const arrangeNodesInTree = (nodeId: string): any => {
    const node = nodeMap[nodeId];
    const childrenEdges = edges.filter((edge) => edge.source === nodeId);
    const childrenNodes = childrenEdges.map((edge) =>
      arrangeNodesInTree(edge.target)
    );
    return { ...node, children: childrenNodes };
  };

  arrangeNodesInTree("CEO");
  const nodes = Object.values(nodeMap);

  const handleDateChange = (selectedDate: Date) => {
    const dateObject = new Date(selectedDate);
    selectedDate.setMinutes(
      selectedDate.getMinutes() + dateObject.getTimezoneOffset()
    );
    dateObject.setDate(dateObject.getDate() + 1);

    const latestPositions = getLatestPositionsByDate(positions, dateObject);
    setNodes(latestPositions.nodes as unknown as any[]);
    setEdges(latestPositions.edges as unknown as any[]);
    setSelectedDate(selectedDate);
  };

  const ReactFlowStyled = styled(ReactFlow)`
    position: relative;
    z-index: 0;
    .react-flow__edge-path {
      stroke: magenta;
      stroke-width: 3px;
    }
    .react-flow__edge-interaction {
      border-width: 3px;
    }
    .react-flow__controls {
      display: flex;
      vertical-align: center !important;
      text-align: center;
      &:before {
        content: "controls";
        position: relative;
        display: flex;
        top: 8px;
        margin-left: 5px;
        font-size: 11px;
        font-weight: bold;
      }
    }
  `;

  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.up("md"));
    console.log('breakpoint', breakpoint)
  const nodeTypes = {
    custom: CustomNode,
  };

  return (
    <>
      <Container style={{ height: "90vh" }}>
        {breakpoint ? (
          <>
            <Box component="section">
              <DatePicker
                selected={selectedDate}
                onDateChange={handleDateChange}
              />
            </Box>
            <ReactFlowStyled
              nodeTypes={nodeTypes}
              fitView
              nodes={nodes}
              edges={edges}
            >
              <Background />
              <MiniMap pannable position={"bottom-left"} nodeStrokeWidth={3} />
              <Controls position={"bottom-right"} />
            </ReactFlowStyled>
          </>
        ) : (
          <>
            <DataVizGrid />
          </>
        )}
      </Container>
    </>
  );
}
