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
  Paper
} from '@mui/material';

const ScheduleDialog = React.memo(({
  open,
  reservation,
  scheduleData,
  maintenanceData = [],
  profitData = [],
  onClose
}) => {
  if (!reservation) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        Installment Schedule - Reservation ID: {reservation.Id}
      </DialogTitle>
      <DialogContent>
        {scheduleData.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Installments ({scheduleData.length})
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>Year</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>%</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '150px' }} align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduleData.map((row) => (
                    <TableRow key={row.Id} hover>
                      <TableCell>{row.Id}</TableCell>
                      <TableCell>{row.Year ?? '—'}</TableCell>
                      <TableCell>{row.Number ?? '—'}</TableCell>
                      <TableCell>{row.Percentage != null && row.Percentage !== '' ? String(row.Percentage) : '—'}</TableCell>
                      <TableCell>{row.DueDate != null && row.DueDate !== '' ? String(row.DueDate) : '—'}</TableCell>
                      <TableCell align="right">{row.Amount != null && row.Amount !== '' ? String(row.Amount) : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
            No installment schedule data available.
          </Typography>
        )}

        {maintenanceData.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Maintenance Plan ({maintenanceData.length})
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
<TableHead>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Installment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>%</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '150px' }} align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceData.map((row) => (
                    <TableRow key={row.Id} hover>
                      <TableCell>{row.Id}</TableCell>
                      <TableCell>{row.Installment ?? row.Number ?? '—'}</TableCell>
                      <TableCell>{row.Percentage != null && row.Percentage !== '' ? String(row.Percentage) : '—'}</TableCell>
                      <TableCell>{row.DueDate != null && row.DueDate !== '' ? String(row.DueDate) : '—'}</TableCell>
                      <TableCell align="right">{row.Amount != null && row.Amount !== '' ? String(row.Amount) : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {profitData.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Operation Year / Profit Table ({profitData.length})
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400, overflowX: 'auto' }}>
              <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', width: 'max-content' }}>
                <TableHead>
                  <TableRow>
                    {Object.keys(profitData[0]).map((col) => (
                      <TableCell key={col} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: 200, px: 2 }}>{col || '—'}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profitData.map((row, idx) => (
                    <TableRow key={idx} hover>
                      {Object.keys(profitData[0]).map((col) => (
                        <TableCell key={col} sx={{ whiteSpace: 'nowrap', width: 200, px: 2 }}>{row[col] || '—'}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ScheduleDialog.displayName = 'ScheduleDialog';

export default ScheduleDialog;
