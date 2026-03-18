import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Box
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { TableChart as TableChartIcon } from '@mui/icons-material';

const ExcelUploadDialog = React.memo(({
  open,
  reservation,
  excelFile,
  excelInstallments,
  maintenanceDepositInstallments,
  profitRows,
  excelParsingError,
  isUploading,
  snackbar,
  googleSheetUrl,
  onGoogleSheetUrlChange,
  onLoadFromGoogleSheet,
  isLoadingGoogleSheet,
  onClose,
  onFileChange,
  onSubmit,
  onSnackbarClose
}) => {
  if (!reservation) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Update Installments Plan & Maintenance Plan - Reservation ID: {reservation.Id}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Upload an Excel file or paste a Google Sheet link with the same structure: columns for Year, Installment, % (percentage), Due Date, and Amount. Dates will be read directly from the file or sheet.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <input
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              id="excel-upload-input"
              type="file"
              onChange={onFileChange}
            />
            <label htmlFor="excel-upload-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2, height: '56px' }}
              >
                {excelFile ? `Change Excel File (${excelFile.name})` : 'Select Excel File'}
              </Button>
            </label>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Or load from Google Sheet (same columns: Year, Installment, %, Due Date, Amount)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                fullWidth
                placeholder="https://docs.google.com/spreadsheets/d/.../edit?gid=..."
                value={googleSheetUrl || ''}
                onChange={onGoogleSheetUrlChange}
                disabled={isUploading}
                sx={{ flex: '1 1 300px' }}
                inputProps={{ 'aria-label': 'Google Sheet URL' }}
              />
              <Button
                variant="outlined"
                onClick={onLoadFromGoogleSheet}
                disabled={isUploading || isLoadingGoogleSheet}
                startIcon={isLoadingGoogleSheet ? <CircularProgress size={20} color="inherit" /> : <TableChartIcon />}
                sx={{ minWidth: 180 }}
              >
                {isLoadingGoogleSheet ? 'Loading...' : 'Load from Google Sheet'}
              </Button>
            </Box>
          </Grid>

          {excelParsingError && (
            <Grid item xs={12}>
              <Alert severity="error">{excelParsingError}</Alert>
            </Grid>
          )}

          {excelInstallments.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Installments Plan ({excelInstallments.length} installments)
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Number</TableCell>
                        <TableCell>%</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {excelInstallments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.year ?? '—'}</TableCell>
                          <TableCell>{item.number}</TableCell>
                          <TableCell>{item.percentage ?? '—'}</TableCell>
                          <TableCell>{item.dueDate ?? '—'}</TableCell>
                          <TableCell align="right">{item.amount ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}

          {maintenanceDepositInstallments.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Maintenance Deposit ({maintenanceDepositInstallments.length} installments)
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Installment</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>%</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {maintenanceDepositInstallments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.number}</TableCell>
                          <TableCell>{item.percentage ?? '—'}</TableCell>
                          <TableCell>{item.dueDate ?? '—'}</TableCell>
                          <TableCell align="right">{item.amount ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}

          {profitRows && profitRows.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Operation Year / Profit Table ({profitRows.length} rows)
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ maxHeight: 400, overflowX: 'auto' }}>
                  <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', width: 'max-content' }}>
                    <TableHead>
                      <TableRow>
                        {Object.keys(profitRows[0]).map((col) => (
                          <TableCell key={col} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: 200, px: 2 }}>{col || '—'}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profitRows.map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.keys(profitRows[0]).map((col) => (
                            <TableCell key={col} sx={{ whiteSpace: 'nowrap', width: 200, px: 2 }}>{row[col] || '—'}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}

          {snackbar.open && (
            <Grid item xs={12}>
              <Alert 
                severity={snackbar.severity}
                onClose={onSnackbarClose}
              >
                {snackbar.message}
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          color="primary" 
          variant="contained"
          disabled={isUploading || excelInstallments.length === 0}
          startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        >
          {isUploading ? 'Updating...' : 'Update Plans'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ExcelUploadDialog.displayName = 'ExcelUploadDialog';

export default ExcelUploadDialog;
