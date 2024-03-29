import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import { ColumnDef } from '../../models/ModalColumns';
import { GenerateSSHKeyRequest } from './models';

interface FormFieldProps<T> {
  column: ColumnDef<T>;
  value: any;
  onChange: (accessorKey: string, value: any) => void;
  items?: any[];
  errors?: { [key: string]: string };
}

export const SSHFormField: React.FC<FormFieldProps<GenerateSSHKeyRequest>> = ({
  column,
  value,
  onChange,
  items,
  errors,
}) => {
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    onChange(event.target.name as string, event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    onChange(event.target.name as string, event.target.value as string);
  };

  switch (column.type) {
    case 'select':
      return (
        <FormControl fullWidth error={Boolean(errors?.[column.accessorKey])}>
          <InputLabel htmlFor={column.accessorKey}>{column.header}</InputLabel>
          <Select
            label={column.header}
            name={column.accessorKey}
            value={value}
            onChange={handleSelectChange}
            error={Boolean(errors?.[column.accessorKey])}
          >
            {items?.map((item) => (
              <MenuItem key={item.ID ?? item.id} value={item.Name ?? item.name}>
                {item.Name ?? item.name}
              </MenuItem>
            ))}
          </Select>
          {errors?.[column.accessorKey] && (
            <FormHelperText>{errors[column.accessorKey]}</FormHelperText>
          )}
        </FormControl>
      );
    case 'text':
      return (
        <TextField
          fullWidth
          label={column.header}
          name={column.accessorKey}
          value={value}
          onChange={handleChange}
          helperText={errors?.[column.accessorKey]}
          error={Boolean(errors?.[column.accessorKey])}
        />
      );
    case 'number':
      return (
        <TextField
          fullWidth
          label={column.header}
          name={column.accessorKey}
          value={value as Number}
          onChange={handleChange}
          helperText={errors?.[column.accessorKey]}
          error={Boolean(errors?.[column.accessorKey])}
        />
      );
    default:
      return null;
  }
};
