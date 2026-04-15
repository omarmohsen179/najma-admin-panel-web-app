import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { DELETE_USER, EDIT_USER, GET_USERS, UPLOAD_EXCEL } from "./Api";
import { GET_SALES, LEAD_STATUS_LABELS } from "../Sales/Api";
import PageLayout from "app/components/PageLayout/PageLayout";
import CrudMUI from "app/components/CrudTable/CrudMUI";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import { Button as DxButton } from "devextreme-react/button";

const LEAD_STATUS_OPTIONS = [
  { Id: 0, CategoryName: "Interested" },
  { Id: 1, CategoryName: "Not Interested" },
  { Id: 2, CategoryName: "Call Him Back" },
];

const LEAD_STATUS_COLORS = {
  0: "success",
  1: "error",
  2: "warning",
};

const DetailField = ({ label, value, icon }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 1 }}>
    {icon && (
      <Box sx={{ color: "text.secondary", mt: 0.25 }}>{icon}</Box>
    )}
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

const Users = () => {
  const [uploadExcelOpen, setUploadExcelOpen] = useState(false);
  const [salesUsers, setSalesUsers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const dataGridRef = useRef(null);

  // Load sales users for dropdown
  useEffect(() => {
    GET_SALES({ PageIndex: 1, PageSize: 1000 })
      .then((res) => setSalesUsers(res.Data || res.data || []))
      .catch(() => {});
  }, []);

  const handleViewClick = useCallback((row) => {
    setSelectedLead(row);
    setDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedLead(null);
  }, []);

  // Handle Excel upload button click
  const handleUploadExcelClick = useCallback(() => {
    setUploadExcelOpen(true);
    setUploadResult(null);
  }, []);

  // Close upload dialog
  const handleCloseUploadExcel = () => {
    setUploadExcelOpen(false);
    setUploadResult(null);
  };

  // Handle Excel file upload
  const handleExcelUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      alert("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }

    if (isUploading) return;

    try {
      setIsUploading(true);
      setUploadResult(null);

      const response = await UPLOAD_EXCEL(file);

      setUploadResult({
        success: true,
        added: response.added || 0,
        skipped: response.skipped || 0,
        failed: response.failed || 0,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error uploading Excel:", error);
      setUploadResult({
        success: false,
        error: error.message || "Failed to upload Excel file",
      });
    } finally {
      setIsUploading(false);
    }
  }, [isUploading]);

  // Handle row inserting - ensure Role is set to "User"
  const onRowInserting = useCallback((e) => {
    e.data.Role = "User";
  }, []);

  // Handle row updating - ensure Role is set to "User" if not already set
  const onRowUpdating = useCallback((e) => {
    const fullData = { ...e.oldData };
    Object.keys(e.newData).forEach(key => {
      if (e.newData[key] !== null && e.newData[key] !== undefined) {
        fullData[key] = e.newData[key];
      }
    });
    fullData.Role = "User";
    e.newData = fullData;
  }, []);

  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "Id",
        field: "Id",
        captionEn: "Id",
        disable: true,
        isVisable: false,
      },
      {
        caption: "Email",
        field: "Email",
        captionEn: "Email",
        type: "email",
      },
      {
        caption: "Name",
        field: "Name",
        captionEn: "Name",
      },
      {
        caption: "Phone Number",
        field: "PhoneNumber",
        captionEn: "Phone Number",
      },
      {
        caption: "Address",
        field: "Address",
        captionEn: "Address",
      },
      {
        caption: "Date Of Birth",
        field: "DateOfBirth",
        captionEn: "Date Of Birth",
        type: "date",
      },
      {
        caption: "Occupation",
        field: "Occupation",
        captionEn: "Occupation",
      },
      {
        caption: "Monthly Income",
        field: "MonthlyIncome",
        captionEn: "Monthly Income",
        type: "number",
      },
      {
        caption: "Lead Status",
        field: "LeadStatus",
        captionEn: "Lead Status",
        type: "select",
        data: LEAD_STATUS_OPTIONS,
        display: "CategoryName",
        displayEn: "CategoryName",
        value: "Id",
        widthRatio: 150,
        calculateDisplayValue: (row) => {
          const status = row?.LeadStatus ?? row?.leadStatus;
          if (status === undefined || status === null) return "";
          return LEAD_STATUS_LABELS[status] ?? String(status);
        },
      },
      {
        caption: "Note",
        field: "Note",
        captionEn: "Note",
      },
      {
        caption: "Assigned To",
        field: "LeadOwnerId",
        captionEn: "Assigned To",
        type: "select",
        data: salesUsers,
        display: "Name",
        displayEn: "Name",
        value: "Id",
        calculateDisplayValue: (row) => row?.LeadOwnerName ?? row?.leadOwnerName ?? "—",
      },
      {
        caption: "Actions",
        captionEn: "Actions",
        field: "viewAction",
        widthRatio: 80,
        disable: true,
        allowEditing: false,
        cellTemplate: (container, options) => {
          const div = document.createElement("div");
          container.appendChild(div);
          const root = createRoot(div);
          root.render(
            <DxButton
              icon="eyeopen"
              onClick={() => handleViewClick(options.data)}
              stylingMode="text"
              type="default"
              hint="View Details"
            />
          );
          container.onDisposing = () => {
            setTimeout(() => root.unmount(), 0);
          };
        },
      },
    ];
  }, [salesUsers, handleViewClick]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // Lead Details Dialog
  const renderDetailsDialog = () => {
    if (!selectedLead) return null;
    const status = selectedLead.LeadStatus ?? selectedLead.leadStatus;
    const statusLabel = status !== undefined && status !== null ? (LEAD_STATUS_LABELS[status] ?? "—") : "—";
    const statusColor = status !== undefined && status !== null ? (LEAD_STATUS_COLORS[status] ?? "default") : "default";

    return (
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" component="span">Lead Details</Typography>
          </Box>
          <IconButton onClick={handleCloseDetails} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {/* Header: Name + Status */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {selectedLead.Name || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedLead.Email || "—"}
              </Typography>
            </Box>
            <Chip label={statusLabel} color={statusColor} size="medium" sx={{ fontWeight: 500, fontSize: "0.875rem" }} />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Contact Information */}
          <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Contact Information
          </Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <DetailField label="Phone Number" value={selectedLead.PhoneNumber} icon={<PhoneIcon fontSize="small" />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailField label="Email" value={selectedLead.Email} icon={<EmailIcon fontSize="small" />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailField label="Address" value={selectedLead.Address} icon={<HomeIcon fontSize="small" />} />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Personal Information */}
          <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Personal Information
          </Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <DetailField label="Date of Birth" value={formatDate(selectedLead.DateOfBirth)} icon={<CakeIcon fontSize="small" />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailField label="Occupation" value={selectedLead.Occupation} icon={<WorkIcon fontSize="small" />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DetailField label="Monthly Income" value={selectedLead.MonthlyIncome ? Number(selectedLead.MonthlyIncome).toLocaleString() : null} icon={<MoneyIcon fontSize="small" />} />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Lead Information */}
          <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Lead Information
          </Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <DetailField label="Note" value={selectedLead.Note} icon={<NotesIcon fontSize="small" />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailField label="Assigned To" value={selectedLead.LeadOwnerName || "—"} icon={<PersonIcon fontSize="small" />} />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Timestamps */}
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Created At</Typography>
              <Typography variant="body2">{formatDateTime(selectedLead.CreatedAt)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Updated At</Typography>
              <Typography variant="body2">{formatDateTime(selectedLead.UpdatedAt)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Email Confirmed</Typography>
              <Typography variant="body2">
                <Chip label={selectedLead.EmailConfirmed ? "Yes" : "No"} size="small" color={selectedLead.EmailConfirmed ? "success" : "default"} variant="outlined" />
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Role</Typography>
              <Typography variant="body2">
                <Chip label={selectedLead.Role || "User"} size="small" color="info" variant="outlined" />
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDetails} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render Upload Excel Dialog
  const renderUploadExcelDialog = () => {
    return (
      <Dialog open={uploadExcelOpen} onClose={handleCloseUploadExcel} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Excel File</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Upload an Excel file (.xlsx or .xls) to create new users with the "User" role.
              Duplicates will be skipped based on Name, Email, and Phone Number.
            </Typography>

            <input
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              id="excel-upload-input"
              type="file"
              onChange={handleExcelUpload}
              disabled={isUploading}
            />
            <label htmlFor="excel-upload-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<CloudUploadIcon />}
                disabled={isUploading}
                sx={{ mb: 2 }}
              >
                {isUploading ? "Uploading..." : "Select Excel File"}
              </Button>
            </label>

            {isUploading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {uploadResult && (
              <Box sx={{ mt: 2 }}>
                {uploadResult.success ? (
                  <Alert severity="success">
                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>Upload completed successfully!</Typography>
                    <Typography variant="body2">Added: {uploadResult.added} user(s)</Typography>
                    <Typography variant="body2">Skipped (duplicates): {uploadResult.skipped} user(s)</Typography>
                    <Typography variant="body2">Failed: {uploadResult.failed} user(s)</Typography>
                  </Alert>
                ) : (
                  <Alert severity="error">
                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>Upload failed!</Typography>
                    <Typography variant="body2">{uploadResult.error}</Typography>
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadExcel} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Custom toolbar to add Excel upload button
  const onToolbarPreparing = useCallback((toolbarItems) => {
    toolbarItems.push({
      location: "after",
      widget: "dxButton",
      options: {
        icon: "upload",
        text: "Upload Excel",
        onClick: handleUploadExcelClick,
      },
    });
  }, [handleUploadExcelClick]);

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        EDIT={EDIT_USER}
        ADD={EDIT_USER}
        DELETE={DELETE_USER}
        GET={GET_USERS}
        apiKey={"Id"}
        onToolbarPreparing={onToolbarPreparing}
        onRowInserting={onRowInserting}
        onRowUpdating={onRowUpdating}
      />
      {renderDetailsDialog()}
      {renderUploadExcelDialog()}
    </PageLayout>
  );
};

export default Users;
