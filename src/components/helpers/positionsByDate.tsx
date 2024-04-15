import React from "react";
import { IPosition } from "../../shared/interfaces/data.viz.types";

export const getLatestPositionsByDate = (
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