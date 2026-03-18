import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MaintenanceDialog = React.memo(({
  open,
  reservation,
  displayData,
  isSaving,
  onClose,
  onFieldChange,
  onAddRow,
  onDeleteRow,
  onSave
}) => {
  if (!reservation) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Maintenance Plan - Reservation ID: {reservation.Id}
      </DialogTitle>
      <DialogContent>
        {displayData.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Maintenance Installments ({displayData.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={onAddRow}
                size="small"
              >
                Add Row
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Installment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Percentage</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayData.map((row) => (
                    <TableRow key={row.Id} hover>
                      <TableCell>{row.Id}</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={row.Installment || ''}
                          onChange={(e) => onFieldChange(row.Id, 'Installment', e.target.value)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={row.Percentage || 0}
                          onChange={(e) => onFieldChange(row.Id, 'Percentage', parseFloat(e.target.value) || 0)}
                          variant="outlined"
                          inputProps={{ step: 0.01, min: 0 }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={row.Amount || 0}
                          onChange={(e) => onFieldChange(row.Id, 'Amount', parseFloat(e.target.value) || 0)}
                          variant="outlined"
                          inputProps={{ step: 0.01, min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => onDeleteRow(row.Id)}
                          aria-label="delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
            No maintenance plan data available.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onSave} 
          color="primary" 
          variant="contained"
          disabled={isSaving || displayData.length === 0}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

MaintenanceDialog.displayName = 'MaintenanceDialog';

export default MaintenanceDialog;
