import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Tab,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getNetwork, getIPAddresses, Network, CreateNetworkRequest } from './Network';
import { NetworkBoard } from './NetworkBoard';
import EditNetworkModal from '../../components/FormModal';
import { networkColumns } from './NetworkColumns';
import FormModal from '../../components/FormModal';

export const NetworkDetails: React.FC = () => {
  const { name } = useParams<string>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const network = useQuery(['name', name], getNetwork);
  const ips = useQuery(['code', name], getIPAddresses);
  const fetch = () => {
    getNetwork({ queryKey: ['name', name] });
  };
  const handleCreateNewRow = async (values: CreateNetworkRequest) => {};
  const handleCreateModalClose = () => {
    console.log(network.data);
    setModalOpen(false);
  };

  const totalIPs = network.data?.subnetMask ? Math.pow(2, 32 - network.data.subnetMask) - 2 : 0;
  const count = ips.data?.length ?? 0;
  const percentageTaken = Math.round((count / (totalIPs === 0 ? 1 : totalIPs)) * 100);

  const validateForm = (values: CreateNetworkRequest) => {
    const errors: { [key in keyof CreateNetworkRequest]?: string } = {};

    if (!values.name) {
      errors.name = 'Name is required';
    }

    if (!values.address) {
      errors.address = 'Network address is required';
    }
    if (!values.subnetMask) {
      errors.subnetMask = 'Subnet Mask is required';
    }

    if (!values.gateway) {
      errors.gateway = 'Gateway is required';
    }

    return errors;
  };
  return (
    <>
      {network.isLoading && <CircularProgress />}
      {network.data && (
        <Card
          sx={{
            //space it a little bit between left and right edges
            margin: '0 10px',
            //space it a little bit between top and bottom edges
            mb: 2,
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <CardContent>
            <Typography variant="h5">{network.data.name}</Typography>
            <Typography>{network.data.address}</Typography>
            <Typography>{'Number of usable addresses: ' + totalIPs}</Typography>
            <Typography>{'Number of taken addresses: ' + ips.data?.length ?? 0}</Typography>

            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: '20px' }}
              onClick={() => setModalOpen(!modalOpen)}
            >
              Edit Network
            </Button>
          </CardContent>
        </Card>
      )}
      <Typography style={{ margin: '20px 0' }}>Percentage of IP Addresses Taken:</Typography>
      <LinearProgress variant="determinate" value={percentageTaken} />
      {ips.data && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IP Address</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Hostname</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ips.data.map((ipAddress) => (
              <TableRow key={ipAddress.ID}>
                <TableCell>{ipAddress.IPAddress + '/' + ipAddress.PrefixLength}</TableCell>
                <TableCell>{ipAddress.Description}</TableCell>
                <TableCell>{ipAddress.Hostname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <NetworkBoard
        network={network.data ?? ({} as Network)}
        ipAddresses={ips.data ?? []}
        totalIPs={totalIPs}
      />
      <FormModal
        title={'Test'}
        open={modalOpen}
        onClose={handleCreateModalClose}
        onSubmit={handleCreateNewRow}
        columns={networkColumns}
        initialValues={network.data ?? ({} as Network)}
        onCompletion={fetch}
        validate={validateForm}
      />
    </>
  );
};
