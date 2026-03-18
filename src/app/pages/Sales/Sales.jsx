import { useCallback, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GET_SALES,
  GET_SALES_LEADS,
  GET_USER_LEADS,
  ASSIGN_LEADS,
  UPDATE_LEAD,
  LEAD_STATUS,
  LEAD_STATUS_LABELS,
} from "./Api";
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
  TextField,
  MenuItem,
} from "@mui/material";
import { Button as DxButton } from "devextreme-react/button";

const Sales = () => {
  const [selectedSales, setSelectedSales] = useState(null);
  const [viewLeadsOpen, setViewLeadsOpen] = useState(false);
  const [editLeadsOpen, setEditLeadsOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editLeadStatus, setEditLeadStatus] = useState(LEAD_STATUS.Interested);
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);
  const [viewLeadsRefreshKey, setViewLeadsRefreshKey] = useState(0);

  // Handle View button click - show sales leads
  const handleViewClick = useCallback((row) => {
    setSelectedSales(row);
    setViewLeadsOpen(true);
  }, []);

  // Handle Edit button click - show all leads for selection
  const handleEditClick = useCallback((row) => {
    setSelectedSales(row);
    setSelectedLeadIds([]);
    setEditLeadsOpen(true);
  }, []);

  // Close dialogs
  const handleCloseViewLeads = () => {
    setViewLeadsOpen(false);
    setSelectedSales(null);
  };

  const handleCloseEditLeads = () => {
    setEditLeadsOpen(false);
    setSelectedSales(null);
    setSelectedLeadIds([]);
  };

  // Get sales leads for viewing (normalize camelCase or PascalCase response)
  const getSalesLeads = useCallback(async (params = {}) => {
    if (!selectedSales?.Id) {
      return { Data: [], TotalCount: 0 };
    }

    try {
      let response = await GET_SALES_LEADS(selectedSales.Id, params);
      if (typeof response === "string") {
        try {
          response = JSON.parse(response);
        } catch (_) {}
      }
      const data = response?.Data ?? response?.data ?? [];
      const totalCount = response?.TotalCount ?? response?.totalCount ?? 0;
      return { Data: data, TotalCount: totalCount };
    } catch (error) {
      console.error("Error fetching sales leads:", error);
      return { Data: [], TotalCount: 0 };
    }
  }, [selectedSales]);

  // Get users with role User for selection in edit popup
  const getUserLeads = useCallback(async (params = {}) => {
    try {
      const response = await GET_USER_LEADS(params);
      return {
        Data: response.Data || [],
        TotalCount: response.TotalCount || 0,
      };
    } catch (error) {
      console.error("Error fetching user leads:", error);
      return { Data: [], TotalCount: 0 };
    }
  }, []);

  // Column attributes for sales table
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
        caption: "View Leads",
        captionEn: "View Leads",
        field: "viewLeads",
        widthRatio: 120,
        allowEditing: false,
        cellTemplate: (container, options) => {
          const div = document.createElement("div");
          container.appendChild(div);
          const root = createRoot(div);
          root.render(
            <DxButton
              text="View"
              icon="eye"
              onClick={() => handleViewClick(options.data)}
              stylingMode="contained"
              type="normal"
            />
          );
          container.onDisposing = () => {
            setTimeout(() => root.unmount(), 0);
          };
        },
      },
      {
        caption: "Edit Leads",
        captionEn: "Edit Leads",
        field: "editLeads",
        widthRatio: 120,
        allowEditing: false,
        cellTemplate: (container, options) => {
          const div = document.createElement("div");
          container.appendChild(div);
          const root = createRoot(div);
          root.render(
            <DxButton
              text="Edit"
              icon="edit"
              onClick={() => handleEditClick(options.data)}
              stylingMode="contained"
              type="normal"
            />
          );
          container.onDisposing = () => {
            setTimeout(() => root.unmount(), 0);
          };
        },
      },
    ];
  }, [handleViewClick, handleEditClick]);

  // Open edit lead dialog (note & status)
  const handleEditLeadClick = useCallback((row) => {
    const lead = row?.data ?? row;
    setEditingLead(lead);
    setEditNote(lead?.note ?? lead?.Note ?? "");
    setEditLeadStatus(
      lead?.leadStatus !== undefined && lead?.leadStatus !== null
        ? lead.leadStatus
        : lead?.LeadStatus !== undefined && lead?.LeadStatus !== null
          ? lead.LeadStatus
          : LEAD_STATUS.Interested
    );
    setEditLeadOpen(true);
  }, []);

  const handleCloseEditLead = useCallback(() => {
    setEditLeadOpen(false);
    setEditingLead(null);
    setEditNote("");
    setEditLeadStatus(LEAD_STATUS.Interested);
  }, []);

  const handleSaveLead = useCallback(async () => {
    if (!editingLead) return;
    const leadId = editingLead.Id ?? editingLead.id;
    if (!leadId) return;
    try {
      setIsUpdatingLead(true);
      await UPDATE_LEAD(leadId, { note: editNote, leadStatus: editLeadStatus });
      alert("Lead updated successfully.");
      handleCloseEditLead();
      setViewLeadsRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Error updating lead:", err);
      alert(err?.message || err?.Message || "Failed to update lead.");
    } finally {
      setIsUpdatingLead(false);
    }
  }, [editingLead, editNote, editLeadStatus]);

  // Column attributes for sales leads (view popup)
  const leadsColumnAttributes = useMemo(() => {
    return [
      {
        caption: "Id",
        field: "Id",
        captionEn: "Id",
        disable: true,
        isVisable: false,
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
      },
      {
        caption: "Phone Number",
        field: "PhoneNumber",
        captionEn: "Phone Number",
      },
      {
        caption: "Note",
        field: "note",
        captionEn: "Note",
        calculateDisplayValue: (row) => row?.note ?? row?.Note ?? "",
      },
      {
        caption: "Lead Status",
        field: "leadStatus",
        captionEn: "Lead Status",
        calculateDisplayValue: (row) => {
          const status = row?.leadStatus ?? row?.LeadStatus;
          if (status === undefined || status === null) return "";
          return LEAD_STATUS_LABELS[status] ?? String(status);
        },
      },
      {
        caption: "Created At",
        field: "CreatedAt",
        captionEn: "Created At",
        type: "datetime",
      },
      {
        caption: "Actions",
        captionEn: "Actions",
        field: "editLead",
        widthRatio: 100,
        allowEditing: false,
        cellTemplate: (container, options) => {
          const div = document.createElement("div");
          container.appendChild(div);
          const root = createRoot(div);
          root.render(
            <DxButton
              text="Edit"
              icon="edit"
              onClick={() => handleEditLeadClick(options)}
              stylingMode="contained"
              type="normal"
            />
          );
          container.onDisposing = () => {
            setTimeout(() => root.unmount(), 0);
          };
        },
      },
    ];
  }, [handleEditLeadClick]);

  // Column attributes for users (edit popup with selection)
  const userLeadsColumnAttributes = useMemo(() => {
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
    ];
  }, []);

  // Handle lead selection in edit popup
  const handleLeadSelection = useCallback((e) => {
    // e.selectedRowKeys contains the selected row keys (IDs)
    // e.selectedRowsData contains the full row data
    if (e.selectedRowsData && Array.isArray(e.selectedRowsData)) {
      const ids = e.selectedRowsData.map((row) => row.Id);
      setSelectedLeadIds(ids);
    } else if (e.selectedRowKeys && Array.isArray(e.selectedRowKeys)) {
      // If only keys are provided, use them directly
      setSelectedLeadIds(e.selectedRowKeys);
    }
  }, []);

  // Handle assign users as leads
  const handleAssignLeads = useCallback(async () => {
    if (!selectedSales?.Id || selectedLeadIds.length === 0) {
      alert("Please select at least one user to assign as a lead.");
      return;
    }

    if (isAssigning) return;

    try {
      setIsAssigning(true);
      const response = await ASSIGN_LEADS(selectedSales.Id, selectedLeadIds);
      
      alert(
        `Users assigned as leads successfully!\n` +
        `Assigned: ${response.assignedCount || selectedLeadIds.length}\n` +
        `Not Found: ${response.notFoundCount || 0}\n` +
        `Failed: ${response.failedCount || 0}`
      );
      
      handleCloseEditLeads();
      // Refresh the main table
      window.location.reload();
    } catch (error) {
      console.error("Error assigning users as leads:", error);
      alert("Failed to assign users as leads. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  }, [selectedSales, selectedLeadIds, isAssigning]);

  // Render View Leads Dialog
  const renderViewLeadsDialog = () => {
    if (!selectedSales) return null;

    return (
      <Dialog
        open={viewLeadsOpen}
        onClose={handleCloseViewLeads}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Sales Leads - {selectedSales.Name} ({selectedSales.UserName})
        </DialogTitle>
        <DialogContent>
          <CrudMUI
            key={viewLeadsRefreshKey}
            id={"Id"}
            colAttributes={leadsColumnAttributes}
            view={true}
            GET={getSalesLeads}
            apiKey={"Id"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewLeads} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Edit single lead (note & status) dialog
  const renderEditLeadDialog = () => (
    <Dialog open={editLeadOpen} onClose={handleCloseEditLead} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Lead – Note &amp; Status</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Note"
            multiline
            rows={3}
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            select
            label="Lead Status"
            value={editLeadStatus}
            onChange={(e) => setEditLeadStatus(Number(e.target.value))}
            fullWidth
            variant="outlined"
          >
            <MenuItem value={LEAD_STATUS.Interested}>
              {LEAD_STATUS_LABELS[LEAD_STATUS.Interested]}
            </MenuItem>
            <MenuItem value={LEAD_STATUS.NotInterested}>
              {LEAD_STATUS_LABELS[LEAD_STATUS.NotInterested]}
            </MenuItem>
            <MenuItem value={LEAD_STATUS.CallHimBack}>
              {LEAD_STATUS_LABELS[LEAD_STATUS.CallHimBack]}
            </MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditLead} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSaveLead}
          color="primary"
          variant="contained"
          disabled={isUpdatingLead}
          startIcon={isUpdatingLead ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isUpdatingLead ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render Edit Leads Dialog (with selection)
  const renderEditLeadsDialog = () => {
    if (!selectedSales) return null;

    return (
      <Dialog
        open={editLeadsOpen}
        onClose={handleCloseEditLeads}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Assign Users (as Leads) to {selectedSales.Name} ({selectedSales.UserName})
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Select users with role "User" from the list below to assign them as leads to this sales user.
              Currently selected: {selectedLeadIds.length} user(s)
            </Typography>
          </Box>
          <CrudMUI
            id={"Id"}
            colAttributes={userLeadsColumnAttributes}
            view={true}
            GET={getUserLeads}
            apiKey={"Id"}
            onSelectionChanged={handleLeadSelection}
            selectionMode="multiple"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditLeads} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAssignLeads}
            color="primary"
            variant="contained"
            disabled={isAssigning || selectedLeadIds.length === 0}
            startIcon={isAssigning ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isAssigning ? "Assigning..." : `Assign ${selectedLeadIds.length} User(s) as Lead(s)`}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        view={true}
        GET={GET_SALES}
        apiKey={"Id"}
      />
      {renderViewLeadsDialog()}
      {renderEditLeadsDialog()}
      {renderEditLeadDialog()}
    </PageLayout>
  );
};

export default Sales;

