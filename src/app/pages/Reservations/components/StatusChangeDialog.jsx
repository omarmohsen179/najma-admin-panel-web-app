import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import { getStatusText, getStatusColor } from '../utils/reservationHelpers';

const StatusChangeDialog = React.memo(({
  open,
  reservation,
  newStatus,
  cancellationReason,
  isSubmitting,
  onClose,
  onStatusChange,
  onCancellationReasonChange,
  onSubmit
}) => {
  if (!reservation) return null;

  const statusOptions = [
    { value: 0, label: "Pending", color: "warning" },
    { value: 1, label: "Confirmed", color: "success" },
    { value: 2, label: "Purchased", color: "info" },
    { value: 3, label: "Cancelled", color: "error" }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Change Reservation Status - ID: {reservation.Id}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Unit: {reservation.UnitNumber}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Client: {reservation.ClientName}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Current Status:
            </Typography>
            <Chip 
              label={getStatusText(reservation.Status)} 
              color={getStatusColor(reservation.Status)}
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">New Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={newStatus}
                label="New Status"
                onChange={onStatusChange}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={option.label} 
                        color={option.color}
                        size="small"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {newStatus === 3 && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cancellation Reason"
                placeholder="Please provide a reason for cancellation..."
                multiline
                rows={3}
                value={cancellationReason}
                onChange={onCancellationReasonChange}
                required
                helperText="Required when cancelling a reservation"
              />
            </Grid>
          )}

          {newStatus !== reservation.Status && (
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'info.light', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'info.main'
              }}>
                <Typography variant="body2" color="info.dark">
                  Status will be changed from <strong>{getStatusText(reservation.Status)}</strong> to <strong>{getStatusText(newStatus)}</strong>
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          color="primary" 
          variant="contained"
          disabled={
            isSubmitting ||
            newStatus === reservation.Status || 
            (newStatus === 3 && !cancellationReason.trim())
          }
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

StatusChangeDialog.displayName = 'StatusChangeDialog';

export default StatusChangeDialog;
