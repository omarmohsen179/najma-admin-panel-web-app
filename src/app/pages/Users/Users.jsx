import { useCallback, useMemo, useState } from "react";
import { DELETE_USER, EDIT_USER, GET_USERS, UPLOAD_EXCEL } from "./Api";
import PageLayout from "app/components/PageLayout/PageLayout";
import CrudMUI from "app/components/CrudTable/CrudMUI";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const Users = () => {
  const [uploadExcelOpen, setUploadExcelOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

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

    // Validate file type
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
      
      // Refresh the main table after a delay
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
    console.log("onRowInserting called with data:", e.data);
    // Ensure Role is always set to "User" for new users
    e.data.Role = "User";
    console.log("Added Role to insert data:", e.data.Role);
  }, []);

  // Handle row updating - ensure Role is set to "User" if not already set
  const onRowUpdating = useCallback((e) => {
    console.log("onRowUpdating called with newData:", e.newData);
    console.log("onRowUpdating called with oldData:", e.oldData);
    
    // Start with all original data
    const fullData = { ...e.oldData };
    
    // Override with new data
    Object.keys(e.newData).forEach(key => {
      if (e.newData[key] !== null && e.newData[key] !== undefined) {
        fullData[key] = e.newData[key];
      }
    });
    
    // Ensure Role is always set to "User"
    fullData.Role = "User";
    
    // Replace e.newData with the full data
    e.newData = fullData;
    console.log("Full data being sent for update:", JSON.stringify(fullData, null, 2));
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
        caption: "User Name",
        field: "UserName",
        captionEn: "User Name",
      },
      {
        caption: "Name",
        field: "Name",
        captionEn: "Name",
      },
      {
        caption: "Email",
        field: "Email",
        captionEn: "Email",
        type: "email",
      },
      {
        caption: "Phone Number",
        field: "PhoneNumber",
        captionEn: "Phone Number",
      },
      {
        caption: "Password",
        field: "Password",
        captionEn: "Password",
      },
    ];
  }, []);

  // Render Upload Excel Dialog
  const renderUploadExcelDialog = () => {
    return (
      <Dialog
        open={uploadExcelOpen}
        onClose={handleCloseUploadExcel}
        maxWidth="sm"
        fullWidth
      >
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
                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                      Upload completed successfully!
                    </Typography>
                    <Typography variant="body2">
                      Added: {uploadResult.added} user(s)
                    </Typography>
                    <Typography variant="body2">
                      Skipped (duplicates): {uploadResult.skipped} user(s)
                    </Typography>
                    <Typography variant="body2">
                      Failed: {uploadResult.failed} user(s)
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="error">
                    <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                      Upload failed!
                    </Typography>
                    <Typography variant="body2">
                      {uploadResult.error}
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadExcel} color="primary">
            Close
          </Button>
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
      {renderUploadExcelDialog()}
    </PageLayout>
  );
};

export default Users;

