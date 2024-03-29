import { useParams, useNavigate } from 'react-router-dom';
import { getVirtualMachine, stopVirtualMachine, startVirtualMachine } from './VirtualMachine';
import { useQuery } from '@tanstack/react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Box, Button, Chip, Typography } from '@mui/material';
import { Loading } from '../../components/Loading';

import VMInfo from './VMInfo';
import VMActions from './VMActions';

export function VirtualMachineDetails() {
  const { name } = useParams<string>();
  let navigate = useNavigate();
  const results = useQuery({ queryKey: ['name', name], queryFn: getVirtualMachine });

  if (results.isLoading) {
    <Loading />;
  }
  return (
    <Box>
      <Typography variant="h4" textAlign="center">
        {name}
      </Typography>
      <VMActions />
      <VMInfo />
    </Box>
  );
}
