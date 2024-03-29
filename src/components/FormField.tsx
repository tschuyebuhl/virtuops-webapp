import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  FormHelperText,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { ColumnDef } from '../models/ModalColumns';
import { CreateVirtualMachineRequest } from '../features/vm/VirtualMachine';

interface FormFieldProps<T> {
  column: ColumnDef<T>;
  value: any;
  onChange: (accessorKey: keyof T, value: any) => void;
  items?: any[];
  errors?: { [key in keyof T]?: string };
}

export const FormField = <T extends {}>({
  column,
  value,
  onChange,
  items,
  errors,
}: FormFieldProps<T>) => {
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    onChange(event.target.name as keyof T, event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    onChange(event.target.name as keyof T, event.target.value);
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
              <MenuItem key={item.ID ?? item.id} value={item.ID ?? item.id}>
                {item.name ?? item.Name}
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
    case 'checkbox':
      return (
        <FormGroup>
          <FormControlLabel
            label={column.header}
            name={column.accessorKey}
            control={
              <Checkbox
                checked={value === true} // Ensure that this is a boolean
                onChange={(e) => onChange(column.accessorKey, e)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
          />
        </FormGroup>
      );
    default:
      return null;
  }
};
