import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { StyledNode, StyledInfo } from './styled/styledCustomNode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface ICustomNodeProps {
  data: { label: string };
  selected: boolean;
}


const CustomNode: React.FC<ICustomNodeProps> = ({ data, selected }) => {
    return (
        <StyledNode selected={selected}>
          <Handle type="target" position={Position.Left} />
          <StyledInfo>
          <AccountCircleIcon sx={{ fontSize: 50 }}/>
            {data.label.split(' ').map((word: string, index: number) => (
            <div key={index} className={`data-${index}`}>
                <strong>{word}</strong>
              </div>
            ))}
          </StyledInfo>
          <Handle type="source" position={Position.Right} />
        </StyledNode>
      );
  };
  
  

export default memo(CustomNode);
