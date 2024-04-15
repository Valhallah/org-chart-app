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
import { getLatestPositionsByDate } from "./helpers/positionsByDate"
import DataVizGrid from "./DataVizGrid";
import DataVizForm from "./DataVizForm";
import { IPosition } from "../shared/interfaces/data.viz.types";


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



  const positions: IPosition[] = position;


  const latestPositions = getLatestPositionsByDate(positions, selectedDate);

  // react flow node filter
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
            <DataVizForm createOrUpdatePosition={function (positions: IPosition[], updatedPosition: Partial<Omit<IPosition, "type">> & Pick<IPosition, "type">, jobIdToUpdate?: string): void {
              throw new Error("Function not implemented.");
            } } deletePositionByJobId={function (positions: IPosition[], jobIdToDelete: string): void {
              throw new Error("Function not implemented.");
            } }/>
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
