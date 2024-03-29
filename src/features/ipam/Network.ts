import { QueryKey } from '@tanstack/react-query';
import api, { Pagination } from '../../util/api';
import { Network, NetworkWebModel, IPAddress, CreateNetworkRequest, CreateIPAddressRequest, DeleteIPAddressRequest, IPAddressResponse, IP } from './models';

export async function getNetworks(pagination: Pagination): Promise<{ networks: Network[], total: number }> {
  const response = await api.get('/api/v1/ipam/networks', { params: pagination });
  const apiResponse = response.data.data;

  if (!apiResponse || !Array.isArray(apiResponse)) {
    // Handle unexpected data shape by defaulting to an empty array and zero total
    return { networks: [], total: 0 };
  }
  const mappedNetworks = apiResponse.map((network: NetworkWebModel) => ({
    id: network.ID,
    name: network.Name,
    vlanId: network.VlanID,
    subnetMask: network.SubnetMask,
    gateway: network.Gateway,
    address: network.Address,
    dhcpEnabled: network.DHCPEnabled,
    dhcpStart: network.DHCPStart,
    dhcpEnd: network.DHCPEnd,
    portGroupId: network.PortGroupID,
    domain: network.Domain,
    dnsServers: network.DNSServers,
  }));

  return { networks: mappedNetworks, total: response.data.total };
}

export const ipToNumber = (ip: string) => {
  const [a, b, c, d] = ip.split('.').map(Number);
  return a * Math.pow(256, 3) + b * Math.pow(256, 2) + c * 256 + d;
};

export async function getNetwork({ queryKey }: { queryKey: QueryKey; }): Promise<Network> {
  const code = queryKey[1];
  const response = await api.get(`/api/v1/ipam/networks/${code}`);
  const network: NetworkWebModel = response.data;

  return {
    id: network.ID,
    name: network.Name,
    vlanId: network.VlanID,
    subnetMask: network.SubnetMask,
    gateway: network.Gateway,
    address: network.Address,
    dhcpEnabled: network.DHCPEnabled,
    dhcpStart: network.DHCPStart,
    dhcpEnd: network.DHCPEnd,
    portGroupId: network.PortGroupID,
    domain: network.Domain,
    dnsServers: network.DNSServers,
  };
}

export async function networkDetails(code: string): Promise<Network> {
  const response = await api.get(`/api/v1/ipam/networks/${code}`);
  const network: NetworkWebModel = response.data;

  return {
    id: network.ID,
    name: network.Name,
    vlanId: network.VlanID,
    subnetMask: network.SubnetMask,
    gateway: network.Gateway,
    address: network.Address,
    dhcpEnabled: network.DHCPEnabled,
    dhcpStart: network.DHCPStart,
    dhcpEnd: network.DHCPEnd,
    portGroupId: network.PortGroupID,
    domain: network.Domain,
    dnsServers: network.DNSServers,
  };
}


export async function getIPAddresses({ queryKey }: { queryKey: QueryKey; }): Promise<IPAddress[]> {
  const name = queryKey[1];
  const response = await api.get(`/api/v1/ipam/networks/${name}/ip-addresses`);
  const data = response.data.Data;

  return data.map((item: IPAddressResponse) => ({
    ID: item.ID,
    IPAddress: item.ip_address,
    PrefixLength: item.prefix_length,
    Hostname: item.Hostname,
    Description: item.Description,
    State: item.State,
    InterfaceID: item.InterfaceID,
    NetworkID: item.NetworkID
  }));
}


export async function trashFunction(name: string): Promise<IPAddress[]> {
  const response = await api.get(`/api/v1/ipam/networks/${name}/ip-addresses`);
  const data = response.data;
  return data;
}


export async function createNetwork(data: CreateNetworkRequest): Promise<void> {
  await api.post('/api/v1/ipam/networks', data);
}

export async function createIPAddress(code: string, data: CreateIPAddressRequest): Promise<void> {
  await api.post(`/api/v1/ipam/networks/${code}/ip-addresses`, data);
}

export async function deleteIPAddress(data: DeleteIPAddressRequest): Promise<void> {
  await api.delete(`/api/v1/ipam/ip-addresses`, { data });
}

export async function deleteNetwork(code: string): Promise<void> {
  await api.delete(`/api/v1/ipam/networks/${code}`);
}

export async function updateNetwork(code: string, data: CreateNetworkRequest): Promise<void> {
  await api.put(`/api/v1/ipam/networks/${code}`, data);
}

export async function getNextIP(id: string): Promise<IP> {
  const response = await api.get(`/api/v1/ipam/networks/${id}/free-ip`);
  return {
    address: response.data.ip_address,
    prefix: response.data.prefix_length,
  };
}

export const validateForm = (values: CreateNetworkRequest) => {
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

export const validateIP = (values: CreateIPAddressRequest) => {
  const errors: { [key in keyof CreateIPAddressRequest]?: string } = {};

  if (!values.ip_address) {
    errors.ip_address = 'IP is required';
  }
  return errors;
};

